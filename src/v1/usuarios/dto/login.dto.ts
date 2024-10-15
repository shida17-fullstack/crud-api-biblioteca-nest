import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

/**
 * DTO para el inicio de sesión de un usuario.
 *
 * @api {post} /login Iniciar sesión
 * @apiName Login
 * @apiGroup Autenticación
 * @apiParam {String} nombreUsuario El nombre de usuario del usuario.
 * @apiParam {String} password La contraseña del usuario.
 *
 * @export
 * @class LoginDto
 */
export class LoginDto {
  /**
   * El nombre de usuario del usuario.
   *
   * @type {string}
   */
  @ApiProperty({ type: String, description: 'El nombre de usuario del usuario.' }) 
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  /**
   * La contraseña del usuario.
   *
   * @type {string}
   */
  @ApiProperty({ type: String, description: 'La contraseña del usuario.' }) 
  @IsString()
  @IsNotEmpty()
  password: string;
}
