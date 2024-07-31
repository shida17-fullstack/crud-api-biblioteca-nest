import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { Prestamo } from './prestamo.entity';

/**
 * Controlador que gestiona las rutas relacionadas con los préstamos de libros.
 */
@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  /**
   * Crea un nuevo préstamo.
   * @param prestamo El objeto préstamo a crear.
   * @returns Un mensaje indicando el éxito de la operación y el préstamo creado.
   */
  @Post()
  async create(@Body() prestamo: Prestamo) {
    return this.prestamosService.create(prestamo);
  }

  /**
   * Obtiene todos los préstamos.
   * @returns Un mensaje indicando el éxito de la operación, una lista de todos los préstamos y el conteo total.
   */
  @Get()
  async findAll() {
    return this.prestamosService.findAll();
  }

  /**
   * Obtiene un préstamo por su ID.
   * @param id El ID del préstamo a obtener.
   * @returns Un mensaje indicando el éxito de la operación y el préstamo encontrado.
   */
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.prestamosService.findOne(id);
  }

  /**
   * Actualiza un préstamo existente.
   * @param id El ID del préstamo a actualizar.
   * @param updateData Los datos de actualización del préstamo.
   * @returns Un mensaje indicando el éxito de la operación y el préstamo actualizado.
   */
  @Put(':id')
  async update(@Param('id') id: number, @Body() prestamo: Prestamo) {
    const existingPrestamo = await this.prestamosService.findOne(id);
    if (!existingPrestamo) {
      throw new NotFoundException('El préstamo no existe.');
    }
    return this.prestamosService.update(id, prestamo);
  }

  /**
   * Elimina un préstamo por su ID (soft delete).
   * @param id El ID del préstamo a eliminar.
   * @returns Un mensaje indicando el éxito de la operación.
   */
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.prestamosService.remove(id);
  }
}
