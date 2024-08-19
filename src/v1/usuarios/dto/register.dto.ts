import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  IsObject,
  IsEnum,
} from 'class-validator';
import { Direccion } from '@usuarios/interfaces/direccion.interface';
import { Rol } from '@usuarios/usuario.entity';

/**
 * DTO para el registro de un nuevo usuario.
 */
export class RegisterDto {
  /**
   * El nombre del usuario.
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  nombre: string;

  /**
   * El nombre de usuario (opcional).
   *
   * @type {string}
   */
  @IsOptional()
  @IsString()
  nombreUsuario?: string;

  /**
   * El correo electrónico del usuario.
   *
   * @type {string}
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * La contraseña del usuario.
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  password: string;

  /**
   * La edad del usuario.
   *
   * @type {number}
   */
  @IsNumber()
  @IsNotEmpty()
  edad: number;

  /**
   * La carrera o profesión del usuario.
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  carreraOProfesion: string;

  /**
   * La dirección del usuario.
   *
   * @type {Direccion}
   */
  @IsObject()
  @IsNotEmpty()
  direccion: Direccion;

  /**
   * El rol del usuario en el sistema.
   *
   * @type {Rol}
   */
  @IsEnum(Rol)
  @IsNotEmpty()
  rol: Rol;
}
