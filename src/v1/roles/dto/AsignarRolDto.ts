// src/v1/roles/dto/asignar-rol.dto.ts
import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { Rol } from '@usuarios/usuario.entity';
import { ApiProperty } from '@nestjs/swagger'; 

/**
 * DTO para la asignación de roles.
 */
export class AsignarRolDto {
  @ApiProperty({ description: 'Rol que se asignará al usuario.' }) // Decorador de Swagger para documentar la propiedad
  @IsNotEmpty()
  @IsEnum(Rol, { message: 'Rol debe ser un valor válido' })
  rol: Rol;

  @ApiProperty({ description: 'ID del usuario autenticado.' }) // Decorador de Swagger para documentar la propiedad
  @IsNotEmpty()
  @IsNumber()
  usuarioAutenticadoId: number;
}
