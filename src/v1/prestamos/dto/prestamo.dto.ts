// src/prestamos/dto/prestamo.dto.ts
import { IsNotEmpty, IsOptional, IsInt, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; 

/**
 * Data Transfer Object (DTO) para crear un nuevo préstamo.
 *
 * Este DTO define la estructura y las validaciones necesarias para los datos
 * que se requieren al crear un préstamo en el sistema.
 *
 * @api {post} /prestamos Crear préstamo
 * @apiName CreatePrestamo
 * @apiGroup Prestamos
 * @apiParam {Number} libroId ID del libro que se desea prestar.
 * @apiParam {Number} usuarioId ID del usuario que solicita el préstamo.
 * @apiParam {Number} [reservaId] ID de la reserva asociada (opcional).
 * @apiParam {Date} fechaPrestamo Fecha en que se realiza el préstamo.
 * @apiParam {Date} [fechaDevolucion] Fecha de devolución del libro (opcional).
 *
 * @export
 * @class CreatePrestamoDto
 */
export class CreatePrestamoDto {
  @ApiProperty() // Agrega decorador para la propiedad
  @IsNotEmpty()
  @IsInt()
  libroId: number;

  @ApiProperty() // Agrega decorador para la propiedad
  @IsNotEmpty()
  @IsInt()
  usuarioId: number;

  @ApiPropertyOptional() // Agrega decorador para la propiedad opcional
  @IsOptional()
  @IsInt()
  reservaId?: number;

  @ApiProperty() // Agrega decorador para la propiedad
  @IsDate()
  @Type(() => Date)
  fechaPrestamo: Date;

  @ApiPropertyOptional() // Agrega decorador para la propiedad opcional
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaDevolucion?: Date;
}

/**
 * Data Transfer Object (DTO) para actualizar un préstamo.
 *
 * Este DTO define la estructura y las validaciones necesarias para los datos
 * que se pueden actualizar de un préstamo en el sistema. Todos los campos son opcionales,
 * lo que significa que solo los campos que se proporcionan serán actualizados.
 *
 * @api {put} /prestamos/:id Actualizar préstamo
 * @apiName UpdatePrestamo
 * @apiGroup Prestamos
 * @apiParam {Number} [libroId] ID del libro que se desea prestar (opcional).
 * @apiParam {Number} [usuarioId] ID del usuario que solicita el préstamo (opcional).
 * @apiParam {Number} [reservaId] ID de la reserva asociada (opcional).
 * @apiParam {Date} [fechaPrestamo] Fecha en que se realiza el préstamo (opcional).
 * @apiParam {Date} [fechaDevolucion] Fecha de devolución del libro (opcional).
 *
 * @export
 * @class UpdatePrestamoDto
 */
export class UpdatePrestamoDto {
  @ApiPropertyOptional() // Agrega decorador para la propiedad opcional
  @IsOptional()
  @IsInt()
  libroId?: number;

  @ApiPropertyOptional() // Agrega decorador para la propiedad opcional
  @IsOptional()
  @IsInt()
  usuarioId?: number;

  @ApiPropertyOptional() // Agrega decorador para la propiedad opcional
  @IsOptional()
  @IsInt()
  reservaId?: number;

  @ApiPropertyOptional() // Agrega decorador para la propiedad opcional
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaPrestamo?: Date;

  @ApiPropertyOptional() // Agrega decorador para la propiedad opcional
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaDevolucion?: Date;
}
