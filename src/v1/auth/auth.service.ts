import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '@usuarios/usuarios.service';
import { RegisterDto } from '@usuarios/dto/register.dto';
import { LoginDto } from '@usuarios/dto/login.dto';
import { Usuario } from '@usuarios/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    nombreUsuario: string,
    password: string,
  ): Promise<Omit<Usuario, 'password'> | null> {
    try {
      const usuario =
        await this.usuariosService.findUserByUsername(nombreUsuario);
      if (!usuario) {
        console.error('Usuario no encontrado');
        return null;
      }

      if (!usuario.password) {
        console.error('Contraseña no encontrada en el usuario');
        return null;
      }

      const isMatch = await bcrypt.compare(password, usuario.password);
      if (isMatch) {
        const { password, ...result } = usuario;
        return result;
      } else {
        console.error('Contraseña incorrecta');
        return null;
      }
    } catch (error) {
      console.error('Error al validar usuario:', error);
      return null;
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ message: string; access_token: string }> {
    const { nombreUsuario, password } = loginDto;
    const usuario = await this.validateUser(nombreUsuario, password);
    if (usuario) {
      const payload = { nombreUsuario: usuario.nombreUsuario, sub: usuario.id };
      const token = this.jwtService.sign(payload);
      return {
        message: 'Usuario logueado exitosamente',
        access_token: token,
      };
    } else {
      throw new NotFoundException('Usuario o contraseña incorrectos');
    }
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ usuario: Omit<Usuario, 'password'>; message: string }> {
    return this.usuariosService.register(registerDto);
  }
}
