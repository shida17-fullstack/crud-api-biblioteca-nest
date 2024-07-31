import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.entity';

/**
 * Controlador para gestionar las rutas relacionadas con los usuarios.
 */
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  /**
   * Endpoint para crear un nuevo usuario.
   * 
   * @param {Usuario} usuario - Los datos del usuario a crear.
   * @returns {Promise<{ usuario: Usuario, message: string }>} - El usuario creado con un mensaje de éxito.
   */
  @Post()
  async create(
    @Body() usuario: Usuario
  ): Promise<{ usuario: Usuario, message: string }> {
    return this.usuariosService.create(usuario);
  }

  /**
   * Obtiene todos los usuarios.
   * 
   * @returns {Promise<{ usuarios: Usuario[], cantidad: number, message: string }>} - Una lista de usuarios, la cantidad de usuarios encontrados y un mensaje.
   */
  @Get()
  findAll(): Promise<{ usuarios: Usuario[], cantidad: number, message: string }> {
    return this.usuariosService.findAll();
  }

  /**
   * Busca un usuario por ID.
   * 
   * @param {number} id - El ID del usuario.
   * @returns {Promise<Usuario>} - El usuario encontrado, o lanza una excepción si no se encuentra.
   */
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Usuario> {
    return this.usuariosService.findOne(id);
  }

  /**
   * Marca un usuario como eliminado (soft delete) por su ID.
   * 
   * @param {number} id - El ID del usuario a eliminar.
   * @returns {Promise<{ message: string }>} - Un mensaje de éxito indicando que la operación fue realizada.
   * 
   * Este método recibe el ID de un usuario y llama al servicio para marcar al usuario como eliminado. 
   */
  @Delete(':id')
  remove(@Param('id') id: number): Promise<{ message: string }> {
    return this.usuariosService.remove(id);
  }

  /**
   * Actualiza un usuario existente por su ID.
   * 
   * Este método recibe el ID del usuario y los datos nuevos para actualizar al usuario correspondiente.
   * 
   * @param {number} id - El ID del usuario a actualizar.
   * @param {Partial<Usuario>} usuario - Los nuevos datos del usuario a actualizar. 
   * @returns {Promise<{ usuario: Usuario, message: string }>} - Un objeto que contiene el usuario actualizado y un mensaje de éxito.
   */
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() usuario: Partial<Usuario>
  ): Promise<{ usuario: Usuario, message: string }> {
    return this.usuariosService.update(id, usuario);
  }
}
