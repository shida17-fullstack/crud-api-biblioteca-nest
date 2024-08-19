import { Usuario } from '@usuarios/usuario.entity';

declare global {
  namespace Express {
    interface Request {
      user?: {
        usuarioId: number;
        sub?: number; // ID del usuario extraído del JWT
        nombreUsuario?: string; // Nombre de usuario extraído del JWT (opcional)
      };
    }
  }
}
