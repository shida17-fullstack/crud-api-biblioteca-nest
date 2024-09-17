import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@auth/jwt-payload.interface'; // Define esta interfaz para el payload del JWT

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Determina el entorno y usa la clave secreta adecuada
    const isProduction = process.env.NODE_ENV === 'production';
    const secretOrKey = isProduction ? process.env.PROD_JWT_SECRET_KEY : process.env.JWT_SECRET_KEY;

    // Imprime el valor de la clave secreta para depuración
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`JWT Secret Key: ${secretOrKey}`);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretOrKey,
    });
  }

  async validate(payload: JwtPayload) {
    // El 'sub' en el payload es el ID del usuario (usuario.id)
    return { usuarioId: payload.sub, nombreUsuario: payload.nombreUsuario };
  }
}
