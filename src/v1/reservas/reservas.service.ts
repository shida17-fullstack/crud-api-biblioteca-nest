import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan, MoreThanOrEqual } from 'typeorm';
import { Reserva } from '@reservas/reserva.entity';
import { Prestamo } from '@prestamos/prestamo.entity';
import { Libro } from '@libros/libro.entity';
import * as moment from 'moment-timezone';
import { Usuario } from '@usuarios/usuario.entity';
import { CreateReservaDto, UpdateReservaDto } from '@reservas/dto/reserva.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsuariosService } from '@usuarios/usuarios.service';
import { JwtPayload } from '@auth/jwt-payload.interface';

@ApiTags('reservas')
@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,

    @InjectRepository(Prestamo)
    private prestamosRepository: Repository<Prestamo>,

    @InjectRepository(Libro)
    private librosRepository: Repository<Libro>,

    private usuariosService: UsuariosService,
  ) {}

  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @ApiResponse({ status: 201, description: 'Reserva creada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Libro o usuario no encontrado.' })
  @ApiResponse({ status: 409, description: 'Conflicto con la reserva, libro ya reservado o usuario ya tiene reservas en la misma fecha.' })
  @ApiResponse({ status: 403, description: 'Permiso denegado.' })
  async create(
    createReservaDto: CreateReservaDto,
    usuarioAutenticado: JwtPayload,
  ): Promise<{ message: string; reserva: Reserva }> {
    console.log('Datos de la reserva:', createReservaDto);
    console.log('Usuario autenticado:', usuarioAutenticado);

    const fechaReserva = moment
      .tz(createReservaDto.fechaReserva, 'America/Argentina/Buenos_Aires')
      .startOf('day')
      .toDate();
    const fechaNotificacion = createReservaDto.fechaNotificacion
      ? moment
          .tz(createReservaDto.fechaNotificacion, 'America/Argentina/Buenos_Aires')
          .startOf('day')
          .toDate()
      : null;

    console.log('Fecha de Reserva convertida:', fechaReserva);
    console.log('Fecha de Notificación convertida:', fechaNotificacion);

    // Verificar si el libro está disponible y no ha sido eliminado
    const libro = await this.librosRepository.findOne({
      where: {
        id: createReservaDto.libroId,
        isDeleted: false,
        disponible: true,
      },
    });
    console.log('Resultado de la verificación del libro:', libro);

    if (!libro) {
      console.error(`Libro con ID ${createReservaDto.libroId} no encontrado o está eliminado.`);
      throw new NotFoundException(`Libro con ID ${createReservaDto.libroId} no encontrado o está eliminado.`);
    }

    const prestamo = await this.prestamosRepository.findOne({
      where: {
        libro: { id: createReservaDto.libroId },
        fechaDevolucion: MoreThan(fechaReserva),
        fechaPrestamo: LessThanOrEqual(fechaReserva),
        isDeleted: false,
      },
      relations: ['usuario'],
    });
    console.log('Resultado de la verificación del préstamo:', prestamo);

    if (prestamo && prestamo.usuario && prestamo.usuario.id !== createReservaDto.usuarioId) {
      throw new ConflictException('El libro está prestado en el período seleccionado.');
    }

    const overlappingReservas = await this.reservasRepository.find({
      where: [
        {
          libro: { id: createReservaDto.libroId },
          fechaReserva: LessThanOrEqual(fechaNotificacion || fechaReserva),
          fechaNotificacion: MoreThanOrEqual(fechaReserva),
          isDeleted: false,
        },
      ],
      relations: ['usuario', 'libro'],
    });
    console.log('Reservas que se solapan:', overlappingReservas);

    if (overlappingReservas.some((res) => res.usuario.id !== createReservaDto.usuarioId)) {
      throw new ConflictException('Ya existe una reserva para el libro en el rango de fechas solicitado.');
    }

    if (usuarioAutenticado.sub !== createReservaDto.usuarioId) {
      console.error(`El usuario autenticado (ID ${usuarioAutenticado.sub}) no coincide con el usuario que crea la reserva (ID ${createReservaDto.usuarioId}).`);
      throw new ForbiddenException('No tienes permisos para crear una reserva en nombre de otro usuario.');
    }

    const usuario = await this.usuariosService.findUserById(createReservaDto.usuarioId, usuarioAutenticado);
    console.log('Usuario encontrado:', usuario);

    const usuarioReservas = await this.reservasRepository.find({
      where: {
        usuario: { id: createReservaDto.usuarioId },
        libro: { id: createReservaDto.libroId },
        fechaReserva: fechaReserva,
        isDeleted: false,
      },
    });
    console.log('Reservas del usuario para el libro:', usuarioReservas);

    if (usuarioReservas.length > 0) {
      throw new ConflictException('El usuario ya tiene una reserva para este libro en la misma fecha.');
    }

    const usuarioReservasMismaFecha = await this.reservasRepository.find({
      where: {
        usuario: { id: createReservaDto.usuarioId },
        fechaReserva: fechaReserva,
        isDeleted: false,
      },
      relations: ['libro'],
    });
    console.log('Reservas del usuario en la misma fecha:', usuarioReservasMismaFecha);

    const reservasDiferentesLibros = usuarioReservasMismaFecha.filter(
      (res) => res.libro.id !== createReservaDto.libroId,
    );

    if (reservasDiferentesLibros.length >= 2) {
      throw new ConflictException('El usuario ya tiene 2 reservas en la misma fecha para diferentes libros.');
    }

    const reservaMismoLibroMismaFecha = await this.reservasRepository.findOne({
      where: {
        libro: { id: createReservaDto.libroId },
        fechaReserva: fechaReserva,
        isDeleted: false,
      },
    });
    console.log('Reserva del libro en la misma fecha:', reservaMismoLibroMismaFecha);

    if (reservaMismoLibroMismaFecha) {
      throw new ConflictException('El libro ya tiene una reserva en la misma fecha.');
    }

     
  // Crear la nueva reserva con instancias completas de Libro y Usuario
const nuevaReserva = {
  libro,
  usuario,
  fechaReserva,
  fechaNotificacion,
  
} as Reserva;

console.log('Nueva Reserva:', nuevaReserva);

const reservaCreada = await this.reservasRepository.save(nuevaReserva);
console.log('Reserva Creada:', reservaCreada);


   // Actualizar el estado del libro a no disponible
   libro.disponible = false;
   await this.librosRepository.save(libro);
 
   return {
     message: 'Reserva creada exitosamente.',
     reserva: reservaCreada,
   };
 }


  
/**
 * Obtiene todas las reservas con detalles, incluyendo mensajes si los campos `usuario` o `libro` no están disponibles.
 *
 * Este método recupera todas las reservas que no están marcadas como eliminadas y agrega un mensaje
 * en lugar de valores nulos para los campos `usuario` o `libro` si no están disponibles.
 *
 * @returns {Promise<{ message: string; reservas: any[]; total: number }>} Un objeto que contiene:
 * - `message`: Un mensaje que indica el estado de las reservas.
 * - `reservas`: La lista de reservas, donde los campos `usuario` y `libro` tendrán un mensaje si están ausentes.
 * - `total`: El número total de reservas recuperadas.
 */
@ApiOperation({ summary: 'Obtiene todas las reservas con detalles, incluyendo mensajes si los campos `usuario` o `libro` no están disponibles.' })
@ApiResponse({ status: 200, description: 'Reservas obtenidas exitosamente.' })
@ApiResponse({ status: 404, description: 'No se encontraron reservas.' })
async findAll(): Promise<{
  message: string;
  reservas: any[];
  total: number;
}> {
  const [reservas, total] = await this.reservasRepository.findAndCount({
    where: { isDeleted: false },
    relations: ['usuario', 'libro'],
  });

  const reservasConMensajes = reservas.map(reserva => ({
    ...reserva,
    usuario: reserva.usuario ? reserva.usuario : { mensaje: 'No hay usuario disponible' },
    libro: reserva.libro ? reserva.libro : { mensaje: 'No hay libro disponible' },
  }));

  return {
    message: total > 0 ? 'Reservas obtenidas exitosamente.' : 'No hay reservas disponibles.',
    reservas: reservasConMensajes,
    total,
  };
}


  /**
   * Obtiene una reserva por su ID.
   * @param id - ID de la reserva a obtener.
   * @returns Un objeto con un mensaje y la reserva encontrada.
   * @throws NotFoundException - Si la reserva no se encuentra.
   */
  @ApiOperation({ summary: 'Obtener una reserva por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Reserva obtenida exitosamente.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
  async findOne(id: number): Promise<{ message: string; reserva: Reserva }> {
    const reserva = await this.reservasRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['libro', 'usuario'],
    });
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    return {
      message: 'Reserva obtenida exitosamente.',
      reserva,
    };
  }

  /**
   * Actualiza una reserva existente.
   * @param id - ID de la reserva a actualizar.
   * @param updateReservaDto - Datos para actualizar la reserva.
   * @returns Un objeto con un mensaje y la reserva actualizada.
   * @throws NotFoundException - Si la reserva no se encuentra.
   */
  @ApiOperation({ summary: 'Actualizar una reserva existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Reserva actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
  async update(
    id: number,
    updateReservaDto: UpdateReservaDto,
  ): Promise<{ message: string; reserva: Reserva }> {
    const reserva = await this.reservasRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }

    const fechaReserva = updateReservaDto.fechaReserva
      ? moment
          .tz(updateReservaDto.fechaReserva, 'America/Argentina/Buenos_Aires')
          .startOf('day')
          .toDate()
      : reserva.fechaReserva;
    const fechaNotificacion = updateReservaDto.fechaNotificacion
      ? moment
          .tz(updateReservaDto.fechaNotificacion, 'America/Argentina/Buenos_Aires')
          .startOf('day')
          .toDate()
      : reserva.fechaNotificacion;

    console.log('Fecha de Reserva actualizada:', fechaReserva);
    console.log('Fecha de Notificación actualizada:', fechaNotificacion);

    reserva.fechaReserva = fechaReserva;
    reserva.fechaNotificacion = fechaNotificacion;
    reserva.isDeleted = updateReservaDto.isDeleted || reserva.isDeleted;

    const reservaActualizada = await this.reservasRepository.save(reserva);
    console.log('Reserva Actualizada:', reservaActualizada);

    return {
      message: 'Reserva actualizada exitosamente.',
      reserva: reservaActualizada,
    };
  }

  /**
   * Elimina una reserva por ID.
   * @param id - ID de la reserva a eliminar.
   * @returns Un objeto con un mensaje y la reserva eliminada.
   * @throws NotFoundException - Si la reserva no se encuentra.
   */
  @ApiOperation({ summary: 'Eliminar una reserva por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Reserva eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
  async delete(id: number): Promise<{ message: string; reserva: Reserva }> {
    const reserva = await this.reservasRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    reserva.isDeleted = true;
    const reservaEliminada = await this.reservasRepository.save(reserva);
    return {
      message: 'Reserva eliminada exitosamente.',
      reserva: reservaEliminada,
    };
  }
}
