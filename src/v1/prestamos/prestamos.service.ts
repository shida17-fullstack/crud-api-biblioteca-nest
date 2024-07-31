import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { Prestamo } from './prestamo.entity';
import { Reserva } from '../reservas/reserva.entity';
import { Libro } from '../libros/libro.entity';
import * as moment from 'moment-timezone';

/**
 * Servicio que gestiona las operaciones relacionadas con los préstamos de libros.
 */
@Injectable()
export class PrestamosService {
  constructor(
    @InjectRepository(Prestamo)
    private prestamosRepository: Repository<Prestamo>,
    
    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,

    @InjectRepository(Libro)
    private librosRepository: Repository<Libro>,
  ) {}

  /**
   * Crea un nuevo préstamo.
   * Verifica si el libro está reservado y si ya existe un préstamo para el libro y usuario.
   * @param prestamo El objeto préstamo a crear.
   * @returns Un mensaje indicando el éxito de la operación y el préstamo creado.
   * @throws ConflictException si el libro está reservado o el préstamo ya existe.
   */
  async create(prestamo: Prestamo): Promise<{ message: string; prestamo: Prestamo }> {
    if (!prestamo.libro || !prestamo.libro.id) {
      throw new BadRequestException('Información del libro es requerida.');
    }

    if (!prestamo.usuario || !prestamo.usuario.id) {
      throw new BadRequestException('Información del usuario es requerida.');
    }

    // Convertir fechas a la zona horaria de Argentina sin desfase
    const fechaPrestamo = moment.tz(prestamo.fechaPrestamo, 'America/Argentina/Buenos_Aires').toDate();
    const fechaDevolucion = prestamo.fechaDevolucion ? moment.tz(prestamo.fechaDevolucion, 'America/Argentina/Buenos_Aires').toDate() : null;

    // Verificar si el libro está eliminado (soft deleted)
    const libro = await this.librosRepository.findOne({
      where: {
        id: prestamo.libro.id,
        isDeleted: false,
      },
    });

    if (!libro) {
      throw new NotFoundException(`Libro con ID ${prestamo.libro.id} no encontrado o está eliminado.`);
    }

    // Verificar si ya existe un préstamo eliminado previamente para el mismo usuario y libro
    const prestamoEliminado = await this.prestamosRepository.findOne({
      where: {
        libro: { id: prestamo.libro.id },
        usuario: { id: prestamo.usuario.id },
        isDeleted: true,
      },
      relations: ['libro', 'usuario'], //relaciones 
    });

    // Verificar si hay una reserva activa para el libro y el usuario
    const reserva = await this.reservasRepository.findOne({
      where: {
        libro: { id: prestamo.libro.id },
        usuario: { id: prestamo.usuario.id },
        isDeleted: false,
      },
      relations: ['libro', 'usuario'], //  relaciones 
    });

    // Verificar si la reserva no ha expirado
    const hoy = moment();
    const fechaNotificacion = reserva ? moment(reserva.fechaNotificacion) : null;

    console.log('Fecha de notificación de la reserva:', fechaNotificacion ? fechaNotificacion.toString() : 'No hay reserva');
    console.log('Fecha actual:', hoy.toString());

    const reservaActiva = reserva && fechaNotificacion && fechaNotificacion.isSameOrAfter(hoy, 'day');

    // Si hay una reserva activa por el mismo usuario y dentro del plazo de reserva, convertir la reserva en préstamo
    if (reservaActiva && reserva.usuario.id === prestamo.usuario.id) {
      prestamo.reserva = reserva;
      prestamo.fechaPrestamo = reserva.fechaReserva;
      prestamo.fechaDevolucion = reserva.fechaNotificacion;
    } else if (prestamoEliminado) {
      // Si existe un préstamo eliminado previamente, permitir un nuevo préstamo si no hay otra reserva activa
      const overlappingReservas = await this.reservasRepository.find({
        where: {
          libro: { id: prestamo.libro.id },
          usuario: { id: Not(prestamo.usuario.id) }, // un usuario diferente
          fechaNotificacion: MoreThanOrEqual(fechaPrestamo),
          fechaReserva: LessThanOrEqual(fechaDevolucion || fechaPrestamo),
          isDeleted: false,
        },
        relations: ['libro', 'usuario'], // relaciones 
      });

      if (overlappingReservas.length > 0) {
        throw new ConflictException('El libro está reservado por otro usuario en el rango de fechas solicitado.');
      }
      prestamo.reserva = null;
    } else {
      // Si no hay reserva activa ni préstamo eliminado, proceder con el nuevo préstamo
      prestamo.reserva = null;
    }

    // Verifica si ya existe un préstamo activo para el libro en el rango de fechas
    const overlappingPrestamos = await this.prestamosRepository.find({
      where: {
        libro: { id: prestamo.libro.id },
        fechaDevolucion: MoreThanOrEqual(fechaPrestamo),
        fechaPrestamo: LessThanOrEqual(fechaDevolucion || fechaPrestamo),
        isDeleted: false,
      },
      relations: ['libro', 'usuario'], // relaciones 
    });

    if (overlappingPrestamos.length > 0) {
      throw new ConflictException('El libro ya está prestado en el rango de fechas solicitado.');
    }

    const nuevoPrestamo = this.prestamosRepository.create({
      ...prestamo,
      fechaPrestamo,
      fechaDevolucion,
    });

    try {
      const savedPrestamo = await this.prestamosRepository.save(nuevoPrestamo);

      // Si el préstamo fue convertido de una reserva, actualiza la reserva
      if (reserva && reservaActiva && reserva.usuario.id === prestamo.usuario.id) {
        reserva.prestamo = savedPrestamo;
        await this.reservasRepository.save(reserva);
      }

      // Cambia el estado de disponibilidad del libro a no disponible
      libro.disponible = false;
      await this.librosRepository.save(libro);

      const message = prestamo.reserva
        ? 'Préstamo creado exitosamente. Su reserva ha sido convertida en un préstamo.'
        : 'Préstamo creado exitosamente.';
      return { message, prestamo: savedPrestamo };
    } catch (error) {
      throw new ConflictException(`Error al crear el préstamo. Detalles: ${error.message}`);
    }
  }


  /**
   * Obtiene todos los préstamos.
   * @returns Una lista de todos los préstamos y el conteo total.
   * @throws NotFoundException si ocurre un error durante la recuperación.
   */
  async findAll(): Promise<{ message: string; prestamos: Prestamo[]; total: number }> {
    try {
      const prestamos = await this.prestamosRepository.find({ relations: ['usuario', 'libro'] });
      const total = await this.prestamosRepository.count();
      return { message: 'Préstamos recuperados exitosamente.', prestamos, total };
    } catch (error) {
      throw new NotFoundException(`Error al obtener los préstamos. Detalles: ${error.message}`);
    }
  }

  /**
   * Obtiene un préstamo por su ID.
   * @param id El ID del préstamo a obtener.
   * @returns Un mensaje indicando el éxito de la operación y el préstamo encontrado.
   * @throws NotFoundException si el préstamo no se encuentra.
   */
  async findOne(id: number): Promise<{ message: string; prestamo: Prestamo }> {
    try {
      const prestamo = await this.prestamosRepository.findOne({
        where: { id },
        relations: ['usuario', 'libro'],
      });
      if (!prestamo) {
        throw new NotFoundException('Préstamo no encontrado.');
      }
      return { message: 'Préstamo recuperado exitosamente.', prestamo };
    } catch (error) {
      throw new NotFoundException(`Error al obtener el préstamo. Detalles: ${error.message}`);
    }
  }

  /**
 * Realiza una eliminación lógica de un préstamo específico por su ID.
 * Verifica si el préstamo ya está eliminado antes de intentar eliminarlo.
 * También verifica si hay alguna reserva asociada al libro del préstamo.
 * @param id - El ID del préstamo a eliminar.
 * @returns Objeto que contiene un mensaje de éxito y el préstamo eliminado lógicamente con relaciones cargadas.
 * @throws NotFoundException si no se encuentra el préstamo con el ID proporcionado.
 * @throws ConflictException si el préstamo ya está eliminado o si hay una reserva asociada al libro.
 * @throws Error si ocurre un problema durante la eliminación del préstamo.
 */
async remove(id: number): Promise<{ message: string }> {
  // Buscar el préstamo por ID, incluyendo las relaciones necesarias
  const prestamo = await this.prestamosRepository.findOne({ where: { id }, relations: ['libro'] });
  if (!prestamo) {
    throw new NotFoundException(`Préstamo con ID ${id} no encontrado`);
  }
  if (prestamo.isDeleted) {
    throw new ConflictException(`El préstamo con ID ${id} ya fue eliminado`);
  }

  // Verificar si hay alguna reserva asociada al libro del préstamo
  const reserva = await this.reservasRepository.findOne({ where: { libro: { id: prestamo.libro.id }, isDeleted: false } });
  if (reserva) {
    throw new ConflictException(`El libro asociado al préstamo con ID ${id} tiene una reserva activa`);
  }

  // Marcar el préstamo como eliminado
  prestamo.isDeleted = true;

  // Guardar el préstamo marcado como eliminado
  await this.prestamosRepository.save(prestamo);

  return { message: `Préstamo con ID ${id} eliminado exitosamente` };
}


  /**
   * Actualiza un préstamo existente.
   * Verifica que no exista un préstamo duplicado y que el libro no esté reservado en el período de actualización.
   * 
   * @param id El ID del préstamo a actualizar.
   * @param prestamo Los datos de actualización del préstamo.
   * @returns Un mensaje indicando el éxito de la operación y el préstamo actualizado.
   * @throws NotFoundException si el préstamo no se encuentra.
   * @throws ConflictException si el préstamo ya existe para el mismo usuario y libro, o si el libro está reservado en el período de actualización.
   */
  async update(id: number, prestamo: Partial<Prestamo>): Promise<{ message: string; prestamo: Prestamo }> {
    const existingPrestamo = await this.prestamosRepository.findOne({
      where: { id },
      relations: ['usuario', 'libro'],
    });

    if (!existingPrestamo) {
      throw new NotFoundException('El préstamo no existe.');
    }

    // Actualización de fechas conforme a la lógica de creación
    const fechaPrestamo = prestamo.fechaPrestamo 
      ? moment.tz(prestamo.fechaPrestamo, 'America/Argentina/Buenos_Aires').startOf('day').toDate() 
      : existingPrestamo.fechaPrestamo;
    const fechaDevolucion = prestamo.fechaDevolucion 
      ? moment.tz(prestamo.fechaDevolucion, 'America/Argentina/Buenos_Aires').startOf('day').toDate() 
      : existingPrestamo.fechaDevolucion;

    const overlappingPrestamos = await this.prestamosRepository.find({
      where: {
        libro: prestamo.libro || existingPrestamo.libro,
        fechaDevolucion: MoreThanOrEqual(fechaPrestamo),
        fechaPrestamo: LessThanOrEqual(fechaDevolucion),
        id: Not(id),
        isDeleted: false,
      },
    });

    if (overlappingPrestamos.length > 0) {
      throw new ConflictException('El libro ya está prestado en el rango de fechas solicitado.');
    }

    // Verifica si el libro está reservado
    const reserva = await this.reservasRepository.findOne({
      where: {
        libro: prestamo.libro || existingPrestamo.libro,
        fechaReserva: LessThanOrEqual(fechaDevolucion),
        fechaNotificacion: MoreThanOrEqual(fechaPrestamo),
        isDeleted: false,
      },
    });

    if (reserva && reserva.usuario.id !== (prestamo.usuario?.id || existingPrestamo.usuario.id)) {
      throw new ConflictException('El libro está reservado en el período seleccionado.');
    }

    const updatedPrestamo = this.prestamosRepository.merge(existingPrestamo, prestamo, {
      fechaPrestamo,
      fechaDevolucion,
    });

    try {
      const savedPrestamo = await this.prestamosRepository.save(updatedPrestamo);
      return { message: 'Préstamo actualizado exitosamente.', prestamo: savedPrestamo };
    } catch (error) {
      throw new ConflictException(`Error al actualizar el préstamo. Detalles: ${error.message}`);
    }
  }
}





