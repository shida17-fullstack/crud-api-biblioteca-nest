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
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para el registro de un nuevo usuario.
 *
 * @api {post} /register Registrar usuario
 * @apiName Register
 * @apiGroup Usuarios
 * @apiParam {String} nombre El nombre del usuario.
 * @apiParam {String} [nombreUsuario] El nombre de usuario (opcional).
 * @apiParam {String} email El correo electrónico del usuario.
 * @apiParam {String} password La contraseña del usuario.
 * @apiParam {Number} edad La edad del usuario.
 * @apiParam {String} carreraOProfesion La carrera o profesión del usuario.
 * @apiParam {Direccion} direccion La dirección del usuario.
 * @apiParam {Rol} rol El rol del usuario en el sistema.
 *
 * @export
 * @class RegisterDto
 */
export class RegisterDto {
  /**
   * El nombre del usuario.
   *
   * @type {string}
   */
  @ApiProperty({ type: String, description: 'El nombre del usuario.' }) 
  @IsString()
  @IsNotEmpty()
  nombre: string;

  /**
   * El nombre de usuario (opcional).
   *
   * @type {string}
   */
  @ApiProperty({ type: String, description: 'El nombre de usuario (opcional).' }) 
  @IsOptional()
  @IsString()
  nombreUsuario?: string;

  /**
   * El correo electrónico del usuario.
   *
   * @type {string}
   */
  @ApiProperty({ type: String, description: 'El correo electrónico del usuario.' }) 
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * La contraseña del usuario.
   *
   * @type {string}
   */
  @ApiProperty({ type: String, description: 'La contraseña del usuario.' }) 
  @IsString()
  @IsNotEmpty()
  password: string;

  /**
   * La edad del usuario.
   *
   * @type {number}
   */
  @ApiProperty({ type: Number, description: 'La edad del usuario.' }) 
  @IsNumber()
  @IsNotEmpty()
  edad: number;

  /**
   * La carrera o profesión del usuario.
   *
   * @type {string}
   */
  @ApiProperty({ type: String, description: 'La carrera o profesión del usuario.' })
  @IsString()
  @IsNotEmpty()
  carreraOProfesion: string;

  /**
   * La dirección del usuario.
   *
   * @type {Direccion}
   */
  @ApiProperty({ type: Object, description: 'La dirección del usuario.' }) 
  @IsObject()
  @IsNotEmpty()
  direccion: Direccion;

  /**
   * El rol del usuario en el sistema.
   *
   * @type {Rol}
   */
  @ApiProperty({ enum: Rol, description: 'El rol del usuario en el sistema.' }) 
  @IsEnum(Rol)
  @IsNotEmpty()
  rol: Rol;
}
