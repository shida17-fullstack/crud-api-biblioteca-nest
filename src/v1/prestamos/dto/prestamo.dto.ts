// src/prestamos/dto/prestamo.dto.ts
import { IsNotEmpty, IsOptional, IsInt, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePrestamoDto {
  @IsNotEmpty()
  @IsInt()
  libroId: number;

  @IsNotEmpty()
  @IsInt()
  usuarioId: number;

  @IsOptional()
  @IsInt()
  reservaId?: number;

  @IsDate()
  @Type(() => Date)
  fechaPrestamo: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaDevolucion?: Date;
}

export class UpdatePrestamoDto {
  @IsOptional()
  @IsInt()
  libroId?: number;

  @IsOptional()
  @IsInt()
  usuarioId?: number;

  @IsOptional()
  @IsInt()
  reservaId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaPrestamo?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaDevolucion?: Date;
}
