import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Direccion } from '@usuarios/interfaces/direccion.interface';
import { ApiProperty } from '@nestjs/swagger'; 

/**
 * DTO para actualizar los datos de un usuario.
 *
 * @api {put} /usuarios Actualizar usuario
 * @apiName UpdateUser
 * @apiGroup Usuarios
 * @apiParam {String} [nombre] El nombre del usuario (opcional).
 * @apiParam {String} [nombreUsuario] El nombre de usuario (opcional).
 * @apiParam {String} [email] El correo electrónico del usuario (opcional).
 * @apiParam {String} [password] La contraseña del usuario (opcional).
 * @apiParam {Number} [edad] La edad del usuario (opcional).
 * @apiParam {String} [carreraOProfesion] La carrera o profesión del usuario (opcional).
 * @apiParam {Direccion} [direccion] La dirección del usuario (opcional).
 *
 * @export
 * @class UpdateDto
 */
export class UpdateDto {
  /**
   * El nombre del usuario (opcional).
   *
   * @type {string}
   */
  @ApiProperty({ type: String, description: 'El nombre del usuario (opcional).' }) 
  @IsOptional()
  @IsString()
  nombre?: string;

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
   * El correo electrónico del usuario (opcional).
   *
   * @type {string}
   */
  @ApiProperty({ type: String, description: 'El correo electrónico del usuario (opcional).' }) 
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * La contraseña del usuario (opcional).
   *
   * @type {string}
   */
  @ApiProperty({ type: String, description: 'La contraseña del usuario (opcional).' }) 
  @IsOptional()
  @IsString()
  password?: string;

  /**
   * La edad del usuario (opcional).
   *
   * @type {number}
   */
  @ApiProperty({ type: Number, description: 'La edad del usuario (opcional).' }) 
  @IsOptional()
  @IsNumber()
  edad?: number;

  /**
   * La carrera o profesión del usuario (opcional).
   *
   * @type {string}
   */
  @ApiProperty({ type: String, description: 'La carrera o profesión del usuario (opcional).' }) 
  @IsOptional()
  @IsString()
  carreraOProfesion?: string;

  /**
   * La dirección del usuario (opcional).
   *
   * @type {Direccion}
   */
  @ApiProperty({ type: Object, description: 'La dirección del usuario (opcional).' }) 
  @IsOptional()
  @IsObject()
  direccion?: Direccion;
}
