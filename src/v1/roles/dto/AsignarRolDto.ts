// src/v1/roles/dto/asignar-rol.dto.ts
import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { Rol } from '@usuarios/usuario.entity';

/**
 * DTO para la asignación de roles.
 */
export class AsignarRolDto {
  @IsNotEmpty()
  @IsEnum(Rol, { message: 'Rol debe ser un valor válido' })
  rol: Rol;

  @IsNotEmpty()
  @IsNumber()
  usuarioAutenticadoId: number;
}
