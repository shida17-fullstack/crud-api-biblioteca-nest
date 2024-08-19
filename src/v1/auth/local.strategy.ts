import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@auth/auth.service'; // Ruta Absoluta

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'nombreUsuario' });
  }

  async validate(nombreUsuario: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(nombreUsuario, password);
    if (!user) {
      throw new Error('Invalidas credenciales');
    }
    return user;
  }
}
