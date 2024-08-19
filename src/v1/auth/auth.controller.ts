import { Controller, Request, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '@auth/auth.service';
import { LocalAuthGuard } from '@auth/local-auth.guard';
import { RegisterDto } from '@usuarios/dto/register.dto'; // Ruta Absoluta

/**
 * Controlador para la autenticación de usuarios.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Inicia sesión de un usuario.
   * 
   * @param {Request} req - La solicitud del usuario.
   * @returns {Promise<any>} La respuesta de autenticación.
   */
  @ApiOperation({ summary: 'Inicia sesión de un usuario.' })
  @ApiResponse({ status: 201, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.body);
  }

  /**
   * Registra un nuevo usuario.
   * 
   * @param {RegisterDto} registerDto - Los datos del nuevo usuario.
   * @returns {Promise<any>} La respuesta de registro.
   */
  @ApiOperation({ summary: 'Registra un nuevo usuario.' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos.' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }
}
