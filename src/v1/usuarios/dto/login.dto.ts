import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para el inicio de sesión de un usuario.
 */
export class LoginDto {
  /**
   * El nombre de usuario del usuario.
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  /**
   * La contraseña del usuario.
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
