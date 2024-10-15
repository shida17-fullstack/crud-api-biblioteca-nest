//* src/v1/roles/roles.controller.ts */
import { Controller, Put, Param, Body, UseGuards } from '@nestjs/common';
import { RolesService } from '@roles/roles.service';
import { JwtAuthGuard } from '@auth/jwt-auth.guard'; 
import { RolesGuard } from '@roles/roles.guard'; // Guard para verificar roles específicos
import { AsignarRolDto } from '@roles/dto/AsignarRolDto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

/**
 * Controlador para la gestión de roles.
 * @controller
 * @group Roles - Operaciones relacionadas con la gestión de roles
 */
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Asigna un rol a un usuario.
   * @param id - ID del usuario al que se le asignará el rol.
   * @param asignarRolDto - DTO con el nuevo rol y el ID del usuario autenticado.
   * @returns El resultado de la operación de asignación de rol.
   * @throws {ForbiddenException} - Si el usuario no tiene permiso para asignar el rol.
   * @throws {NotFoundException} - Si el usuario no se encuentra.
   * @operationId AsignarRol
   * @summary Asigna un rol a un usuario.
   * @requestBody
   *   description: DTO para asignar un rol.
   *   content:
   *     application/json:
   *       schema:
   *         $ref: '#/components/schemas/AsignarRolDto'
   * @response 200
   *   description: Rol asignado exitosamente.
   * @response 403
   *   description: Acceso prohibido.
   * @response 404
   *   description: Usuario no encontrado.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Asignar un rol a un usuario' })
  @ApiResponse({ status: 200, description: 'Rol asignado exitosamente.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiBody({ type: AsignarRolDto })
  async asignarRol(
    @Param('id') id: number,
    @Body() asignarRolDto: AsignarRolDto,
  ) {
    const { rol, usuarioAutenticadoId } = asignarRolDto;
    return this.rolesService.asignarRol(id, rol, usuarioAutenticadoId);
  }
}
