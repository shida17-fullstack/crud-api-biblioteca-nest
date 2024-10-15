/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsDate, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger'; 

/**
 * DTO para crear una nueva reserva.
 *
 * @api {post} /reservas Crear reserva
 * @apiName CreateReserva
 * @apiGroup Reservas
 * @apiParam {Number} libroId ID del libro que se desea reservar.
 * @apiParam {Number} usuarioId ID del usuario que realiza la reserva.
 * @apiParam {Date} fechaReserva Fecha en que se realiza la reserva.
 * @apiParam {Date} [fechaNotificacion] Fecha de notificación (opcional).
 * @apiParam {Boolean} [isDeleted] Indica si la reserva está eliminada (opcional).
 *
 * @export
 * @class CreateReservaDto
 */
export class CreateReservaDto {
  @ApiProperty() // Decorador de Swagger para documentar la propiedad
  @IsInt()
  @IsNotEmpty()
  libroId: number;

  @ApiProperty() // Decorador de Swagger para documentar la propiedad
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty() // Decorador de Swagger para documentar la propiedad
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  fechaReserva: Date;

  @ApiProperty({ required: false }) // Decorador de Swagger para documentar la propiedad opcional
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaNotificacion?: Date;

  @ApiProperty({ required: false }) // Decorador de Swagger para documentar la propiedad opcional
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

/**
 * DTO para actualizar una reserva existente.
 *
 * @api {put} /reservas/:id Actualizar reserva
 * @apiName UpdateReserva
 * @apiGroup Reservas
 * @apiParam {Date} [fechaReserva] Fecha en que se realiza la reserva (opcional).
 * @apiParam {Date} [fechaNotificacion] Fecha de notificación (opcional).
 * @apiParam {Boolean} [isDeleted] Indica si la reserva está eliminada (opcional).
 *
 * @export
 * @class UpdateReservaDto
 */
export class UpdateReservaDto {
  @ApiProperty({ required: false }) // Decorador de Swagger para documentar la propiedad opcional
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaReserva?: Date;

  @ApiProperty({ required: false }) // Decorador de Swagger para documentar la propiedad opcional
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaNotificacion?: Date;

  @ApiProperty({ required: false }) // Decorador de Swagger para documentar la propiedad opcional
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
