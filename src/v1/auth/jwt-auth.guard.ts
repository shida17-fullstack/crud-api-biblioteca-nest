import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('No autorizado');
    }
    console.log('Usuario autenticado:', user); 
    return user; // 'user' debe contener 'usuarioId' y 'nombreUsuario'
  }
}
