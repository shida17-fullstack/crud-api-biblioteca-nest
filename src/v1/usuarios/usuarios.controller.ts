import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsuariosService } from '@usuarios/usuarios.service'; // Ruta Absoluta
import { Usuario, Rol } from '@usuarios/usuario.entity'; // Ruta Absoluta
import { JwtAuthGuard } from '@auth/jwt-auth.guard'; // Ruta Absoluta
import { JwtPayload } from '@auth/jwt-payload.interface';
import { RegisterDto } from '@usuarios/dto/register.dto';
import { LoginDto } from '@usuarios/dto/login.dto';
import { UpdateDto } from '@usuarios/dto/update.dto';
import { Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam} from '@nestjs/swagger';

/**
 * Controlador para gestionar las rutas relacionadas con los usuarios.
 */
@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  /**
   * Registra un nuevo usuario.
   * 
   * @param registerDto - Los datos del usuario a registrar.
   * @returns Un objeto con el usuario registrado (sin contraseña) y un mensaje.
   * @throws BadRequestException Si ocurre un error al registrar el usuario.
   * @throws ConflictException Si el usuario ya existe.
   */
  @Post('register')
  @ApiOperation({ summary: 'Registra un nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado con éxito' })
  @ApiResponse({ status: 400, description: 'Error al registrar el usuario' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ usuario: Omit<Usuario, 'password'>; message: string }> {
    try {
      const result = await this.usuariosService.register(registerDto);
      return result;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException('Error al registrar el usuario');
    }
  }

  /**
   * Inicia sesión de un usuario.
   * 
   * @param loginDto - Los datos del usuario para iniciar sesión.
   * @returns Un objeto con el usuario autenticado (sin contraseña) y un mensaje.
   * @throws BadRequestException Si ocurre un error al iniciar sesión.
   * @throws NotFoundException Si el usuario no se encuentra.
   */
  @Post('login')
  @ApiOperation({ summary: 'Inicia sesión de un usuario' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 400, description: 'Error al iniciar sesión' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ usuario: Omit<Usuario, 'password'>; message: string }> {
    try {
      const result = await this.usuariosService.login(loginDto);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Error al iniciar sesión');
    }
  }
  
  /**
   * Obtiene todos los usuarios si el usuario autenticado tiene el rol adecuado.
   * 
   * @param req - La solicitud del cliente.
   * @returns Una lista de usuarios, la cantidad de usuarios encontrados y un mensaje.
   * @throws ForbiddenException Si el usuario no tiene permisos para listar usuarios.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Esto agrega el campo para el token en Swagger
  @ApiOperation({ summary: 'Obtiene todos los usuarios si el usuario autenticado tiene el rol adecuado' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida con éxito', schema: {
    type: 'object',
    properties: {
      usuarios: { type: 'array', items: { $ref: '#/components/schemas/Usuario' } },
      cantidad: { type: 'number' },
      message: { type: 'string' }
    }
  }})
  @ApiResponse({ status: 403, description: 'No tiene permisos para listar usuarios' })
  async findAll(@Req() req: Request): Promise<{ usuarios: Usuario[], cantidad: number, message: string }> {
    const usuarioAutenticado: JwtPayload = {
      sub: req.user.usuarioId, // ID del usuario
      nombreUsuario: req.user.nombreUsuario,
    };

    return this.usuariosService.findAll(usuarioAutenticado);
  }

  /**
   * Encuentra un usuario por nombre de usuario.
   * 
   * @param nombreUsuario - El nombre de usuario a buscar.
   * @returns El usuario encontrado.
   * @throws BadRequestException Si ocurre un error al buscar el usuario.
   * @throws NotFoundException Si el usuario no se encuentra.
   */
  @UseGuards(JwtAuthGuard)
  @Get('nombre/:nombreUsuario')
  @ApiOperation({ summary: 'Encuentra un usuario por nombre de usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: Usuario })
  @ApiResponse({ status: 400, description: 'Error al buscar el usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findUserByUsername(
    @Param('nombreUsuario') nombreUsuario: string,
  ): Promise<Usuario> {
    try {
      return await this.usuariosService.findUserByUsername(nombreUsuario);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        'Error al buscar el usuario por nombre de usuario',
      );
    }
  }

  /**
   * Encuentra un usuario por ID.
   * 
   * @param id - El ID del usuario a buscar.
   * @param req - La solicitud HTTP que incluye la información del usuario autenticado.
   * @returns El usuario encontrado.
   */
  @UseGuards(JwtAuthGuard)
  @Get('id/:id')
  @ApiOperation({ summary: 'Encuentra un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: Usuario })
  async findUserById(@Param('id') id: number, @Req() req: any) {
    const usuarioAutenticado: JwtPayload = {
      sub: req.user.usuarioId, // ID del usuario
      nombreUsuario: req.user.nombreUsuario,
    };

    console.log('Usuario autenticado:', usuarioAutenticado);

    return this.usuariosService.findUserById(id, usuarioAutenticado);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualiza los datos de un usuario' })
  @ApiBody({ type: UpdateDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: Usuario })
  @ApiResponse({ status: 403, description: 'Usuario no autenticado' })
  async updateUsuario(
    @Param('id') id: number,
    @Body() updateDto: UpdateDto,
    @Req() req: Request,
  ) {
    console.log(`Solicitud para actualizar usuario con ID: ${id}`);
    const nombreUsuario = req.user?.nombreUsuario;
  
    if (!nombreUsuario) {
      throw new ForbiddenException('Usuario no autenticado');
    }
  
    console.log('Nombre de usuario autenticado:', nombreUsuario);
  
    return this.usuariosService.update(id, updateDto, nombreUsuario);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Aplica el guardia para proteger la ruta
  @ApiOperation({ summary: 'Marca un usuario como eliminado (soft delete) por su ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario a eliminar', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 403, description: 'No tiene permiso para eliminar este usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El usuario ya ha sido eliminado' })
  async remove(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<{ message: string }> {
    // Verifica si req.user está definido
    if (!req.user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Construir el objeto JwtPayload desde el request
    const usuarioAutenticado: JwtPayload = {
      sub: req.user.usuarioId, // ID del usuario autenticado
      nombreUsuario: req.user.nombreUsuario,
    };

    console.log("usuario autenticado payload desde controlador", usuarioAutenticado);

    if (!usuarioAutenticado.sub) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Llamar al servicio de eliminación
    return this.usuariosService.remove(id, usuarioAutenticado);
  }
}