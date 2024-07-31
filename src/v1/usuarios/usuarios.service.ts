import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

/**
 * Servicio de Usuarios que gestiona las operaciones CRUD para la entidad `Usuario`.
 */
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  /**
   * Crea un nuevo usuario.
   * Verifica si ya existe un usuario con los mismos datos antes de crear.
   * 
   * @param usuario - Los datos del usuario a crear.
   * @returns El usuario creado con un mensaje de éxito.
   * @throws ConflictException si ya existe un usuario con los mismos datos.
   */
  async create(usuario: Usuario): Promise<{ usuario: Usuario, message: string }> {
    const existingUsuario = await this.usuariosRepository.findOneBy({ email: usuario.email });
    if (existingUsuario) {
      throw new ConflictException('El usuario con este email ya existe');
    }
    const nuevoUsuario = await this.usuariosRepository.save(usuario);
    return {
      usuario: nuevoUsuario,
      message: 'Usuario creado exitosamente'
    };
  }

  /**
   * Obtiene todos los usuarios.
   * 
   * @returns Una lista de usuarios, la cantidad de usuarios encontrados y un mensaje.
   */
  async findAll(): Promise<{ usuarios: Usuario[], cantidad: number, message: string }> {
    const usuarios = await this.usuariosRepository.find();
    return {
      usuarios,
      cantidad: usuarios.length,
      message: `Se encontraron ${usuarios.length} usuarios`
    };
  }

  /**
   * Busca un usuario por ID.
   * 
   * @param id - El ID del usuario.
   * @returns El usuario encontrado, o lanza una excepción si no se encuentra.
   * @throws NotFoundException si el usuario no se encuentra.
   */
  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  /**
   * Marca un usuario como eliminado (soft delete) por su ID.
   * 
   * @param id - El ID del usuario.
   * @returns Un mensaje de éxito.
   * @throws NotFoundException si el usuario no se encuentra.
   * @throws ConflictException si el usuario ya ha sido eliminado.
   */
  async remove(id: number): Promise<{ message: string }> {
    const usuario = await this.usuariosRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    if (usuario.isDeleted) {
      throw new ConflictException(`El usuario con ID ${id} ya ha sido eliminado`);
    }
    usuario.isDeleted = true;
    await this.usuariosRepository.save(usuario);
    return { message: `Usuario con ID ${id} eliminado exitosamente` };
  }

  /**
   * Actualiza un usuario por su ID.
   * Verifica si los datos enviados son idénticos a los datos actuales.
   * 
   * @param id - El ID del usuario.
   * @param usuario - Los nuevos datos del usuario.
   * @returns El usuario actualizado con un mensaje de éxito.
   * @throws NotFoundException si el usuario no se encuentra.
   * @throws ConflictException si los datos enviados son idénticos a los datos actuales.
   */
  async update(id: number, usuario: Partial<Usuario>): Promise<{ usuario: Usuario, message: string }> {
    const existingUsuario = await this.usuariosRepository.findOneBy({ id });
    if (!existingUsuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const isIdentical = Object.keys(usuario).every(
      (key) => usuario[key] === existingUsuario[key]
    );

    if (isIdentical) {
      throw new ConflictException('Los datos enviados son idénticos a los datos actuales');
    }

    await this.usuariosRepository.update(id, usuario);
    const updatedUsuario = await this.usuariosRepository.findOneBy({ id });
    return {
      usuario: updatedUsuario,
      message: `Usuario con ID ${id} actualizado exitosamente`
    };
  }
}
