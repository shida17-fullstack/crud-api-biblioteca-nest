import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  
} from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository, Not} from 'typeorm';
import { Usuario, Rol } from '@usuarios/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@auth/jwt-payload.interface';
import { RegisterDto } from '@usuarios/dto/register.dto';
import { LoginDto } from '@usuarios/dto/login.dto';
import { UpdateDto } from '@usuarios/dto/update.dto';
import * as bcrypt from 'bcrypt';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('usuarios')
@Injectable()
export class UsuariosService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Registra un nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  async register(
    registerDto: RegisterDto,
  ): Promise<{ usuario: Omit<Usuario, 'password'>; message: string }> {
    const { nombreUsuario, password, ...rest } = registerDto;

    const existingUser = await this.usuariosRepository.findOne({
      where: { nombreUsuario },
    });
    if (existingUser) {
      throw new ForbiddenException('El nombre de usuario ya está en uso');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const usuario = this.usuariosRepository.create({
      ...rest,
      nombreUsuario,
      password: hashedPassword,
    });

    // Verificar si existe un usuario con el rol de DIRECTOR
    const existingDirector = await this.usuariosRepository.findOne({
      where: { rol: Rol.DIRECTOR },
    });

    // Si no existe, asignar el rol de DIRECTOR al primer usuario registrado
    if (!existingDirector) {
      usuario.rol = Rol.DIRECTOR;
    }

    await this.usuariosRepository.save(usuario);

    const { password: _, ...result } = usuario;
    return {
      usuario: result,
      message: 'Usuario registrado exitosamente',
    };
  }

  @ApiOperation({ summary: 'Encuentra un usuario por su nombre de usuario' })
  @ApiParam({ name: 'nombreUsuario', description: 'Nombre de usuario a buscar', type: String })
  async findUserByUsername(nombreUsuario: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOneBy({ nombreUsuario });
    if (!usuario) {
      throw new NotFoundException(
        `Usuario con nombre de usuario ${nombreUsuario} no encontrado`,
      );
    }
    return usuario;
  }

  @ApiOperation({ summary: 'Inicia sesión de un usuario' })
  @ApiBody({ type: LoginDto })
  async login(
    loginDto: LoginDto,
  ): Promise<{ usuario: Omit<Usuario, 'password'>; message: string }> {
    const { nombreUsuario, password } = loginDto;
    const usuario = await this.findUserByUsername(nombreUsuario);

    if (!usuario) {
      throw new NotFoundException('Usuario o contraseña incorrectos');
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      throw new NotFoundException('Usuario o contraseña incorrectos');
    }

    const { password: _, ...result } = usuario;
    return {
      usuario: result,
      message: 'Usuario logueado exitosamente',
    };
  }

/**
   * Encuentra todos los usuarios si el usuario autenticado tiene el rol adecuado.
   * 
   * @param usuarioAutenticado - La información del usuario autenticado.
   * @returns Una lista de usuarios, la cantidad de usuarios encontrados y un mensaje.
   */
async findAll(usuarioAutenticado: JwtPayload): Promise<{ usuarios: Usuario[], cantidad: number, message: string }> {
  const usuarioAutenticadoBD = await this.usuariosRepository.findOne({
    where: { id: usuarioAutenticado.sub },
  });
  if (!usuarioAutenticadoBD) {
    throw new NotFoundException(
      `Usuario autenticado con ID ${usuarioAutenticado.sub} no encontrado`,
    );
  }

  const tienePermisoEspecial = [
    Rol.DIRECTOR,
    Rol.AUXILIAR,
    Rol.BIBLIOTECARIO,
  ].includes(usuarioAutenticadoBD.rol);

  if (!tienePermisoEspecial) {
    throw new ForbiddenException('No tiene permisos para listar usuarios');
  }

  const usuarios = await this.usuariosRepository.find();
  return {
    usuarios,
    cantidad: usuarios.length,
    message: 'Usuarios listados con éxito',
  };
}



  @ApiOperation({ summary: 'Encuentra un usuario por su ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario a buscar', type: Number })
  async findUserById(
    id: number,
    usuarioAutenticado: JwtPayload,
  ): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const usuarioAutenticadoBD = await this.usuariosRepository.findOne({
      where: { id: usuarioAutenticado.sub },
    });
    if (!usuarioAutenticadoBD) {
      throw new NotFoundException(
        `Usuario autenticado con ID ${usuarioAutenticado.sub} no encontrado`,
      );
    }

    const tienePermisoEspecial = [
      Rol.DIRECTOR,
      Rol.AUXILIAR,
      Rol.BIBLIOTECARIO,
    ].includes(usuarioAutenticadoBD.rol);

    if (usuario.id === usuarioAutenticado.sub || tienePermisoEspecial) {
      return usuario;
    } else {
      throw new ForbiddenException('No tiene permiso para ver este usuario');
    }
  }

  async remove(
    id: number,
    usuarioAutenticado: JwtPayload,
  ): Promise<{ message: string }> {
    // Buscar el usuario a eliminar
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Buscar el usuario autenticado
    const usuarioAutenticadoBD = await this.usuariosRepository.findOne({ where: { id: usuarioAutenticado.sub } });
    if (!usuarioAutenticadoBD) {
      throw new NotFoundException(`Usuario autenticado con ID ${usuarioAutenticado.sub} no encontrado`);
    }

    // Verificar permisos
    const tienePermisoEspecial = [
      Rol.DIRECTOR,
      Rol.AUXILIAR,
      Rol.BIBLIOTECARIO,
    ].includes(usuarioAutenticadoBD.rol);

    if (usuario.id !== usuarioAutenticado.sub && !tienePermisoEspecial) {
      throw new ForbiddenException('No tiene permiso para eliminar este usuario');
    }

    // Verificar si el usuario ya ha sido eliminado
    if (usuario.isDeleted) {
      throw new ConflictException(`El usuario con ID ${id} ya ha sido eliminado`);
    }

    // Marcar el usuario como eliminado
    usuario.isDeleted = true;
    await this.usuariosRepository.save(usuario);

    return { message: `Usuario con ID ${id} eliminado exitosamente` };
  }

  @ApiOperation({ summary: 'Actualiza los datos de un usuario' })
@ApiParam({ name: 'id', description: 'ID del usuario a actualizar', type: Number })
@ApiBody({ type: UpdateDto })
async update(
  id: number,
  updateDto: UpdateDto,
  nombreUsuarioAutenticado: string,
): Promise<{ usuario: Usuario; message: string }> {
  console.log(`Solicitud para actualizar usuario con ID: ${id}`);
  console.log(`Nombre de usuario autenticado: ${nombreUsuarioAutenticado}`);

  // Buscar el usuario existente
  const existingUsuario = await this.usuariosRepository.findOne({ where: { id } });
  if (!existingUsuario) {
    throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  }

  // Verificar permisos
  if (
    existingUsuario.nombreUsuario !== nombreUsuarioAutenticado &&
    existingUsuario.nombreUsuario !== Rol.DIRECTOR
  ) {
    throw new ForbiddenException('No tiene permiso para actualizar este usuario');
  }

  // Verificar conflicto de nombre de usuario si se proporciona uno nuevo
  if (
    updateDto.nombreUsuario &&
    updateDto.nombreUsuario !== existingUsuario.nombreUsuario
  ) {
    console.log(`Verificando conflicto de nombre de usuario: ${updateDto.nombreUsuario}`);
    const userWithSameName = await this.usuariosRepository.findOne({
      where: {
        nombreUsuario: updateDto.nombreUsuario,
        id: Not(existingUsuario.id) // Excluir al usuario actual
      }
    });
    if (userWithSameName) {
      throw new ConflictException('Nombre de usuario ya en uso');
    }
  }

  // Comprobar si los datos han cambiado
  const hasChanges = Object.keys(updateDto).some(key => updateDto[key] !== existingUsuario[key]);

  if (!hasChanges) {
    return {
      usuario: existingUsuario,
      message: 'No se realizaron cambios en los datos del usuario',
    };
  }

  // Actualizar campos manualmente
  existingUsuario.nombre = updateDto.nombre ?? existingUsuario.nombre;
  existingUsuario.nombreUsuario = updateDto.nombreUsuario ?? existingUsuario.nombreUsuario;
  existingUsuario.email = updateDto.email ?? existingUsuario.email;
  existingUsuario.password = updateDto.password ?? existingUsuario.password;
  existingUsuario.edad = updateDto.edad ?? existingUsuario.edad;
  existingUsuario.carreraOProfesion = updateDto.carreraOProfesion ?? existingUsuario.carreraOProfesion;
  existingUsuario.direccion = updateDto.direccion ?? existingUsuario.direccion;

  // Guardar el usuario actualizado
  await this.usuariosRepository.save(existingUsuario);

  console.log('Usuario actualizado:', existingUsuario);

  return {
    usuario: existingUsuario,
    message: 'Usuario actualizado exitosamente',
  };
}
}

