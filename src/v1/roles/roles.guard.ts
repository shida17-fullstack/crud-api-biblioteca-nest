/import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Rol } from '@usuarios/usuario.entity'; 
import { JwtPayload } from '@auth/jwt-payload.interface'; 
import { RolesService } from '@roles/roles.service';
// No necesitas la importación explícita de Request desde 'express'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    // Puedes usar directamente el tipo Request extendido globalmente
    const request = context.switchToHttp().getRequest<Request>();
    const usuario = request.user as JwtPayload;

    if (!usuario) {
      throw new ForbiddenException('No se ha autenticado');
    }

    const usuarioEnDb = await this.rolesService.getUsuarioById(usuario.sub);
    if (!usuarioEnDb) {
      throw new ForbiddenException('Usuario no encontrado');
    }

    if (!requiredRoles.includes(usuarioEnDb.rol)) {
      throw new ForbiddenException(
        'No tienes permisos suficientes para acceder a este recurso',
      );
    }

    return true;
  }
}
