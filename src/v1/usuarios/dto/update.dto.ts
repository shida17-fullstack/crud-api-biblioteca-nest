import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Direccion } from '@usuarios/interfaces/direccion.interface';

/**
 * DTO para actualizar los datos de un usuario.
 */
export class UpdateDto {
  /**
   * El nombre del usuario (opcional).
   *
   * @type {string}
   */
  @IsOptional()
  @IsString()
  nombre?: string;

  /**
   * El nombre de usuario (opcional).
   *
   * @type {string}
   */
  @IsOptional()
  @IsString()
  nombreUsuario?: string;

  /**
   * El correo electrónico del usuario (opcional).
   *
   * @type {string}
   */
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * La contraseña del usuario (opcional).
   *
   * @type {string}
   */
  @IsOptional()
  @IsString()
  password?: string;

  /**
   * La edad del usuario (opcional).
   *
   * @type {number}
   */
  @IsOptional()
  @IsNumber()
  edad?: number;

  /**
   * La carrera o profesión del usuario (opcional).
   *
   * @type {string}
   */
  @IsOptional()
  @IsString()
  carreraOProfesion?: string;

  /**
   * La dirección del usuario (opcional).
   *
   * @type {Direccion}
   */
  @IsOptional()
  @IsObject()
  direccion?: Direccion;
}
