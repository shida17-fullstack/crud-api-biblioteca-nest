/* src/v1/roles/roles.service.ts */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, Rol } from '@usuarios/usuario.entity';

/**
 * Servicio para la gestión de roles.
 * @service
 * @description Servicio que maneja las operaciones relacionadas con la asignación de roles a los usuarios.
 */
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  /**
   * Asigna un nuevo rol a un usuario.
   * @param id - ID del usuario al que se le asignará el nuevo rol.
   * @param nuevoRol - Nuevo rol a asignar.
   * @param usuarioAutenticadoId - ID del usuario autenticado que realiza la asignación.
   * @returns Mensaje indicando el resultado de la operación.
   * @throws {NotFoundException} Si el usuario no se encuentra.
   * @throws {ForbiddenException} Si el usuario autenticado no tiene permisos para asignar roles.
   *
   */
  async asignarRol(
    id: number,
    nuevoRol: Rol,
    usuarioAutenticadoId: number,
  ): Promise<{ message: string }> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const usuarioAutenticado = await this.usuariosRepository.findOne({
      where: { id: usuarioAutenticadoId },
    });
    if (!usuarioAutenticado || usuarioAutenticado.rol !== Rol.DIRECTOR) {
      throw new ForbiddenException('No tiene permisos para asignar roles');
    }

    usuario.rol = nuevoRol;
    await this.usuariosRepository.save(usuario);

    return { message: `Rol asignado exitosamente a usuario con ID ${id}` };
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id - ID del usuario a buscar.
   * @returns El usuario encontrado o null si no se encuentra.
   * @example
   * const user = await rolesService.getUsuarioById(1);
   * console.log(user); // Usuario con ID 1
   */
  async getUsuarioById(id: number): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({ where: { id } });
  }
}
