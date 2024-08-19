/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsDate, IsBoolean, IsInt} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para crear una nueva reserva.
 */
export class CreateReservaDto {
  @IsInt()
  @IsNotEmpty()
  libroId: number;

  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  fechaReserva: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaNotificacion?: Date;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

/**
 * DTO para actualizar una reserva existente.
 */
export class UpdateReservaDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaReserva?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaNotificacion?: Date;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
