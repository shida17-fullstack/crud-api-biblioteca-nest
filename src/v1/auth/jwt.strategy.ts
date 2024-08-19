// src/v1/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@auth/jwt-payload.interface'; // Define esta interfaz para el payload del JWT

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY, // Utiliza la variable de entorno para la clave secreta
    });
  }

  async validate(payload: JwtPayload) {
    // El 'sub' en el payload es el ID del usuario (usuario.id)
    return { usuarioId: payload.sub, nombreUsuario: payload.nombreUsuario };
  }
}
