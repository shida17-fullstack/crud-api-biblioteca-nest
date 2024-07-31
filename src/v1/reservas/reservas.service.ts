import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { Reserva } from './reserva.entity';
import { Prestamo } from '../prestamos/prestamo.entity';
import { Libro } from '../libros/libro.entity';
import * as moment from 'moment-timezone';

/**
 * Servicio que maneja las operaciones relacionadas con las reservas de libros.
 */
@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,

    @InjectRepository(Prestamo)
    private prestamosRepository: Repository<Prestamo>,

    @InjectRepository(Libro)
    private librosRepository: Repository<Libro>,
  ) {}

  /**
   * Crea una nueva reserva.
   * @param reserva - Datos de la reserva a crear.
   * @returns Un objeto que contiene un mensaje de éxito y la reserva creada.
   * @throws ConflictException si hay conflictos con otras reservas o préstamos.
   * @throws NotFoundException si el libro no se encuentra o está eliminado.
   */
  async create(reserva: Reserva): Promise<{ message: string; reserva: Reserva }> {
    console.log('Datos de la reserva:', reserva);

    // Convertir fechas a la zona horaria de Argentina sin desfase
    const fechaReserva = moment.tz(reserva.fechaReserva, 'America/Argentina/Buenos_Aires').startOf('day').toDate();
    const fechaNotificacion = reserva.fechaNotificacion 
      ? moment.tz(reserva.fechaNotificacion, 'America/Argentina/Buenos_Aires').startOf('day').toDate()
      : null;
    
    console.log('Fecha de Reserva convertida:', fechaReserva);
    console.log('Fecha de Notificación convertida:', fechaNotificacion);

    // Verificar si el libro está eliminado (soft deleted)
    console.log(`Verificando libro con ID ${reserva.libro.id}`);
    const libro = await this.librosRepository.findOne({
      where: {
        id: reserva.libro.id,
        isDeleted: false,
      },
    });
    console.log(`Resultado de la verificación del libro:`, libro);

    if (!libro) {
      console.error(`Libro con ID ${reserva.libro.id} no encontrado o está eliminado.`);
      throw new NotFoundException(`Libro con ID ${reserva.libro.id} no encontrado o está eliminado.`);
    }

    // Verificar si hay un préstamo que coincida con el libro y el período de la reserva
    const prestamo = await this.prestamosRepository.findOne({
      where: {
        libro: { id: reserva.libro.id },
        fechaDevolucion: MoreThan(fechaReserva),
        fechaPrestamo: LessThanOrEqual(fechaReserva),
        isDeleted: false,
      },
      relations: ['usuario'],
    });

    if (prestamo && prestamo.usuario && prestamo.usuario.id !== reserva.usuario.id) {
      throw new ConflictException('El libro está prestado en el período seleccionado.');
    }

    // Verificar si ya existe una reserva activa para el mismo libro en el mismo rango de fechas
    const overlappingReservas = await this.reservasRepository.find({
      where: [
        {
          libro: { id: reserva.libro.id },
          fechaReserva: LessThanOrEqual(fechaNotificacion || fechaReserva),
          fechaNotificacion: MoreThanOrEqual(fechaReserva),
          isDeleted: false,
        },
      ],
      relations: ['usuario', 'libro'],
    });

    if (overlappingReservas.some(res => res.usuario.id !== reserva.usuario.id)) {
      throw new ConflictException('Ya existe una reserva para el libro en el rango de fechas solicitado.');
    }

    // Verificar si el usuario ya tiene una reserva para el mismo libro en la misma fecha
    const usuarioReservas = await this.reservasRepository.find({
      where: {
        usuario: { id: reserva.usuario.id },
        libro: { id: reserva.libro.id },
        fechaReserva: fechaReserva,
        isDeleted: false,
      },
    });

    if (usuarioReservas.length > 0) {
      throw new ConflictException('El usuario ya tiene una reserva para este libro en la misma fecha.');
    }

    // Verificar si el usuario ya tiene 2 reservas en la misma fecha para diferentes libros
    const usuarioReservasMismaFecha = await this.reservasRepository.find({
      where: {
        usuario: { id: reserva.usuario.id },
        fechaReserva: fechaReserva,
        isDeleted: false,
      },
      relations: ['libro'],
    });

    // Filtrar las reservas que son de diferentes libros
    const reservasDiferentesLibros = usuarioReservasMismaFecha.filter(
      (res) => res.libro.id !== reserva.libro.id
    );

    if (reservasDiferentesLibros.length >= 2) {
      throw new ConflictException('El usuario ya tiene 2 reservas en la misma fecha para diferentes libros.');
    }

    // Verificar si otro usuario tiene una reserva para el mismo libro en la misma fecha
    const reservaMismoLibroMismaFecha = await this.reservasRepository.findOne({
      where: {
        libro: { id: reserva.libro.id },
        fechaReserva: fechaReserva,
        usuario: { id: Not(reserva.usuario.id) }, // Esto comprueba si otro usuario tiene la reserva
        isDeleted: false,
      },
    });

    if (reservaMismoLibroMismaFecha) {
      throw new ConflictException('Otro usuario ya tiene una reserva para el mismo libro en la misma fecha.');
    }

    // Verificar si hay un préstamo activo del mismo usuario para el mismo libro y asociar el préstamo
    if (prestamo && prestamo.usuario.id === reserva.usuario.id) {
      reserva.prestamo = prestamo; // Asignar el préstamo a la reserva
    }

    const nuevaReserva = this.reservasRepository.create({
      ...reserva,
      fechaReserva,
      fechaNotificacion,
    });

    try {
      const savedReserva = await this.reservasRepository.save(nuevaReserva);

      // Cambia el estado de disponibilidad del libro a no disponible
      console.log('Estado del libro antes de actualizar:', libro.disponible);
      libro.disponible = false;
      await this.librosRepository.save(libro);
      console.log('Estado del libro después de actualizar:', libro.disponible);

      const message = 'Reserva creada exitosamente.';
      return { message, reserva: savedReserva };
    } catch (error) {
      console.error(`Error al crear la reserva: ${error.message}`);
      throw new ConflictException(`Error al crear la reserva. Detalles: ${error.message}`);
    }
  }

  /**
   * Obtiene todas las reservas almacenadas en la base de datos.
   * @returns Objeto que contiene un mensaje de éxito, la lista de todas las reservas con relaciones cargadas y el total de registros.
   * @throws Error si ocurre un problema durante la obtención de las reservas.
   */
  async findAll(): Promise<{ message: string, reservas: Reserva[], total: number }> {
    try {
      const [reservas, total] = await this.reservasRepository.findAndCount({ relations: ['usuario', 'libro'] });
      return { message: 'Reservas obtenidas exitosamente', reservas, total };
    } catch (error) {
      throw new Error(`Error al obtener todas las reservas: ${error.message}`);
    }
  }

  /**
   * Obtiene una reserva específica por su ID.
   * @param id - El ID de la reserva a buscar.
   * @returns Objeto que contiene un mensaje de éxito y la reserva encontrada con relaciones cargadas.
   * @throws NotFoundException si no se encuentra la reserva con el ID proporcionado.
   * @throws Error si ocurre un problema durante la obtención de la reserva.
   */
  async findOne(id: number): Promise<{ message: string, reserva: Reserva }> {
    try {
      const reserva = await this.reservasRepository.findOne({ where: { id }, relations: ['usuario', 'libro'] });
      if (!reserva) {
        throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
      }
      return { message: `Reserva con ID ${id} obtenida exitosamente`, reserva };
    } catch (error) {
      throw new Error(`Error al obtener la reserva con ID ${id}: ${error.message}`);
    }
  }

  /**
 * Realiza una eliminación lógica de una reserva específica por su ID.
 * Verifica si la reserva ya está eliminada antes de intentar eliminarla.
 * También verifica si el préstamo asociado ya fue eliminado.
 * @param id - El ID de la reserva a eliminar.
 * @returns Objeto que contiene un mensaje de éxito y la reserva eliminada lógicamente con relaciones cargadas.
 * @throws NotFoundException si no se encuentra la reserva con el ID proporcionado.
 * @throws ConflictException si la reserva o el préstamo asociado ya están eliminados.
 * @throws Error si ocurre un problema durante la eliminación de la reserva.
 */
async delete(id: number): Promise<{ message: string, reserva: Reserva }> {
  try {
    // Buscar la reserva por ID, incluyendo las relaciones necesarias
    const reserva = await this.reservasRepository.findOne({ where: { id }, relations: ['libro'] });
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }
    if (reserva.isDeleted) {
      throw new ConflictException(`La reserva con ID ${id} ya fue eliminada`);
    }

    // Verificar si el préstamo asociado a esta reserva ya fue eliminado
    const prestamo = await this.prestamosRepository.findOne({ where: { reserva: { id } } });
    if (prestamo && prestamo.isDeleted) {
      throw new ConflictException(`El préstamo asociado a la reserva con ID ${id} ya fue eliminado`);
    }

    // Marcar la reserva como eliminada
    reserva.isDeleted = true;

    // Guardar la reserva marcada como eliminada
    const reservaEliminada = await this.reservasRepository.save(reserva);
    return { message: `Reserva con ID ${id} eliminada exitosamente`, reserva: reservaEliminada };
  } catch (error) {
    throw new Error(`Error al eliminar la reserva con ID ${id}: ${error.message}`);
  }
}

/**
 * Realiza una actualización lógica de una reserva específica por su ID.
 * @param id - El ID de la reserva a actualizar.
 * @param updateData - Los nuevos datos de la reserva.
 * @returns Objeto que contiene un mensaje de éxito y la reserva actualizada.
 * @throws NotFoundException si no se encuentra la reserva con el ID proporcionado.
 * @throws Error si ocurre un problema durante la actualización de la reserva.
 */
async update(id: number, updateData: Partial<Reserva>): Promise<{ message: string, reserva: Reserva }> {
  try {
    // Buscar la reserva por ID, incluyendo las relaciones necesarias
    const reserva = await this.reservasRepository.findOne({ where: { id }, relations: ['libro'] });
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    // Actualizar la reserva con los nuevos datos
    const updatedReserva = Object.assign(reserva, updateData);
    const reservaGuardada = await this.reservasRepository.save(updatedReserva);

    // Actualizar el estado del libro si la reserva fue eliminada
    if (updatedReserva.isDeleted) {
      const reservasActivas = await this.reservasRepository.find({
        where: {
          libro: { id: reserva.libro.id },
          isDeleted: false,
        },
      });

      const prestamosActivos = await this.prestamosRepository.find({
        where: {
          libro: { id: reserva.libro.id },
          isDeleted: false,
        },
      });

      if (reservasActivas.length === 0 && prestamosActivos.length === 0) {
        reserva.libro.disponible = true;
        await this.librosRepository.save(reserva.libro);
      }
    }

    return { message: `Reserva con ID ${id} actualizada exitosamente`, reserva: reservaGuardada };
  } catch (error) {
    throw new Error(`Error al actualizar la reserva con ID ${id}: ${error.message}`);
  }
}

}