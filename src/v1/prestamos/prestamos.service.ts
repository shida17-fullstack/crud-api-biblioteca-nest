import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { Prestamo } from '@prestamos/prestamo.entity';
import { Reserva } from '@reservas/reserva.entity';
import { Libro } from '@libros/libro.entity';
import { Usuario } from '@usuarios/usuario.entity';
import { CreatePrestamoDto, UpdatePrestamoDto } from '@prestamos/dto/prestamo.dto';
import * as moment from 'moment-timezone';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtPayload } from '@auth/jwt-payload.interface';

@ApiTags('prestamos')
@Injectable()
export class PrestamosService {
  constructor(
    @InjectRepository(Prestamo)
    private prestamosRepository: Repository<Prestamo>,

    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,

    @InjectRepository(Libro)
    private librosRepository: Repository<Libro>,

    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>, 
  ) {}

  @ApiOperation({ summary: 'Crea un nuevo préstamo.' })
  @ApiResponse({ status: 201, description: 'Préstamo creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Información del libro o usuario requerida.' })
  @ApiResponse({ status: 404, description: 'Libro o usuario no encontrado o está eliminado.' })
  @ApiResponse({ status: 409, description: 'El libro ya está prestado o reservado.' })
  async create(
    createPrestamoDto: CreatePrestamoDto,
    usuarioAutenticado: JwtPayload,
  ): Promise<{ message: string; prestamo: Prestamo }> {
    const { libroId, fechaPrestamo, fechaDevolucion, usuarioId, reservaId } = createPrestamoDto;
    
    // Validar la información requerida
    if (!libroId || !usuarioId) {
      throw new BadRequestException('Información del libro y del usuario es requerida.');
    }

    // Convertir las fechas a la zona horaria de Buenos Aires
    const fechaPrestamoTZ = moment.tz(fechaPrestamo, 'America/Argentina/Buenos_Aires').toDate();
    const fechaDevolucionTZ = fechaDevolucion ? moment.tz(fechaDevolucion, 'America/Argentina/Buenos_Aires').toDate() : null;

    // Buscar el libro y el usuario
    const libro = await this.librosRepository.findOne({ where: { id: libroId, isDeleted: false } });
    const usuario = await this.usuariosRepository.findOne({ where: { id: usuarioId, isDeleted: false } });

    if (!libro) {
      throw new NotFoundException(`Libro con ID ${libroId} no encontrado o está eliminado.`);
    }

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado o está eliminado.`);
    }

    // Verificar si el usuario autenticado es el mismo que el usuario del préstamo
    if (usuarioAutenticado.sub !== usuarioId) {
      throw new ForbiddenException('No tienes permisos para crear un préstamo en nombre de otro usuario.');
    }

    // Verificar si el libro ya está prestado en el rango de fechas solicitado
    const overlappingPrestamos = await this.prestamosRepository.find({
      where: {
        libro: { id: libroId },
        fechaDevolucion: MoreThanOrEqual(fechaPrestamoTZ),
        fechaPrestamo: LessThanOrEqual(fechaDevolucionTZ || fechaPrestamoTZ),
        isDeleted: false,
      },
    });

    if (overlappingPrestamos.length > 0) {
      throw new ConflictException('El libro ya está prestado en el rango de fechas solicitado.');
    }

    // Verificar si hay una reserva activa para este usuario y libro
    const reserva = await this.reservasRepository.findOne({
      where: { libro: { id: libroId }, usuario: { id: usuarioId }, isDeleted: false },
      relations: ['libro', 'usuario'],
    });

    const hoy = moment();
    const fechaNotificacion = reserva ? moment(reserva.fechaNotificacion) : null;
    const reservaActiva = reserva && fechaNotificacion && fechaNotificacion.isSameOrAfter(hoy, 'day');

    if (reservaActiva) {
      createPrestamoDto.fechaPrestamo = reserva.fechaReserva;
      createPrestamoDto.fechaDevolucion = reserva.fechaNotificacion;
    } else {
      // Verificar si hay reservas que se superponen con las fechas solicitadas
      const overlappingReservas = await this.reservasRepository.find({
        where: {
          libro: { id: libroId },
          usuario: { id: Not(usuarioId) },
          fechaNotificacion: MoreThanOrEqual(fechaPrestamoTZ),
          fechaReserva: LessThanOrEqual(fechaDevolucionTZ || fechaPrestamoTZ),
          isDeleted: false,
        },
      });

      if (overlappingReservas.length > 0) {
        throw new ConflictException('El libro está reservado por otro usuario en el rango de fechas solicitado.');
      }
    }

    const nuevoPrestamo = this.prestamosRepository.create({
      libro,
      usuario,
      fechaPrestamo: fechaPrestamoTZ,
      fechaDevolucion: fechaDevolucionTZ,
      reserva,
    });

    const savedPrestamo = await this.prestamosRepository.save(nuevoPrestamo);

    if (reserva && reservaActiva) {
      reserva.prestamo = savedPrestamo;
      await this.reservasRepository.save(reserva);
    }

    libro.disponible = false;
    await this.librosRepository.save(libro);

    const message = reserva ? 'Préstamo creado exitosamente. Su reserva ha sido convertida en un préstamo.' : 'Préstamo creado exitosamente.';
    return { message, prestamo: savedPrestamo };
  }

  /**
   * Obtiene todos los préstamos.
   * 
   * @returns {Promise<{ message: string; prestamos: Prestamo[]; total: number }>} La lista de todos los préstamos y el total.
   * @throws {NotFoundException} Si ocurre un error al recuperar los préstamos.
   */
  @ApiOperation({ summary: 'Obtiene todos los préstamos.' })
  @ApiResponse({ status: 200, description: 'Préstamos recuperados exitosamente.' })
  @ApiResponse({ status: 404, description: 'Error al obtener los préstamos.' })
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
   *
   * @param {number} id - El ID del préstamo.
   * @returns {Promise<{ message: string; prestamo: Prestamo }>} El préstamo encontrado.
   * @throws {NotFoundException} Si el préstamo no se encuentra.
   */
  @ApiOperation({ summary: 'Obtiene un préstamo por su ID.' })
  @ApiResponse({ status: 200, description: 'Préstamo recuperado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Préstamo no encontrado.' })
  async findOne(id: number): Promise<{ message: string; prestamo: Prestamo }> {
    try {
      const prestamo = await this.prestamosRepository.findOne({
        where: { id, isDeleted: false },
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
   * Actualiza un préstamo existente.
   * 
   * @param {number} id - El ID del préstamo.
   * @param {UpdatePrestamoDto} updatePrestamoDto - Los datos actualizados del préstamo.
   * @returns {Promise<{ message: string; prestamo: Prestamo }>} El préstamo actualizado.
   * @throws {NotFoundException} Si el préstamo no se encuentra.
   * @throws {ConflictException} Si ocurre un error al actualizar el préstamo.
   */
  @ApiOperation({ summary: 'Actualiza un préstamo existente.' })
  @ApiResponse({ status: 200, description: 'Préstamo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Préstamo no encontrado.' })
  @ApiResponse({ status: 409, description: 'Error al actualizar el préstamo.' })
  async update(id: number, updatePrestamoDto: UpdatePrestamoDto): Promise<{ message: string; prestamo: Prestamo }> {
    const prestamo = await this.prestamosRepository.findOne({ where: { id }, relations: ['reserva'] });
    if (!prestamo) {
      throw new NotFoundException('Préstamo no encontrado.');
    }

    if (prestamo.reserva) {
      // Si el préstamo fue creado a partir de una reserva, no permitir cambios en usuarioId y libroId
      if (updatePrestamoDto.usuarioId || updatePrestamoDto.libroId) {
        throw new ConflictException('No se puede modificar usuarioId o libroId en un préstamo creado a partir de una reserva.');
      }
    } else {
      // Actualizar el usuario si usuarioId está presente en el DTO
      if (updatePrestamoDto.usuarioId) {
        const usuario = await this.usuariosRepository.findOne({ where: { id: updatePrestamoDto.usuarioId } });
        if (!usuario) {
          throw new NotFoundException('Usuario no encontrado.');
        }
        prestamo.usuario = usuario;
      }

      // Actualizar el libro si libroId está presente en el DTO
      if (updatePrestamoDto.libroId) {
        const libro = await this.librosRepository.findOne({ where: { id: updatePrestamoDto.libroId } });
        if (!libro) {
          throw new NotFoundException('Libro no encontrado.');
        }
        prestamo.libro = libro;
      }
    }

    // Actualizar otros campos que no están relacionados con entidades
    if (updatePrestamoDto.fechaPrestamo) {
      prestamo.fechaPrestamo = updatePrestamoDto.fechaPrestamo;
    }

    if (updatePrestamoDto.fechaDevolucion) {
      prestamo.fechaDevolucion = updatePrestamoDto.fechaDevolucion;
    }

    try {
      const updatedPrestamo = await this.prestamosRepository.save(prestamo);
      return { message: 'Préstamo actualizado exitosamente.', prestamo: updatedPrestamo };
    } catch (error) {
      throw new ConflictException(`Error al actualizar el préstamo. Detalles: ${error.message}`);
    }
  }

  /**
   * Elimina un préstamo por su ID.
   * 
   * @param {number} id - El ID del préstamo.
   * @returns {Promise<{ message: string }>} Mensaje de éxito de la eliminación.
   * @throws {NotFoundException} Si el préstamo no se encuentra.
   * @throws {ConflictException} Si ocurre un error al eliminar el préstamo.
   */
  @ApiOperation({ summary: 'Elimina un préstamo por su ID.' })
  @ApiResponse({ status: 200, description: 'Préstamo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Préstamo no encontrado.' })
  @ApiResponse({ status: 409, description: 'Error al eliminar el préstamo.' })
  async remove(id: number): Promise<{ message: string }> {
    const prestamo = await this.prestamosRepository.findOne({ where: { id }, relations: ['libro'] });
    if (!prestamo) {
      throw new NotFoundException('Préstamo no encontrado.');
    }

    try {
      // Marca el préstamo como eliminado
      prestamo.isDeleted = true;
      await this.prestamosRepository.save(prestamo);

      // Actualiza la disponibilidad del libro
      if (prestamo.libro) {
        prestamo.libro.disponible = true;
        await this.librosRepository.save(prestamo.libro);
      }

      return { message: 'Préstamo eliminado exitosamente.' };
    } catch (error) {
      throw new ConflictException(`Error al eliminar el préstamo. Detalles: ${error.message}`);
    }
  }
}