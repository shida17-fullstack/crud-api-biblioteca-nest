import { Controller, Post, Body, Get, Param, Delete, ParseIntPipe, Put, NotFoundException } from '@nestjs/common';
import { Reserva } from './reserva.entity';
import { ReservasService } from './reservas.service';

/**
 * Controlador para la gestión de reservas.
 * Define las rutas HTTP y maneja las peticiones para operaciones CRUD de reservas.
 */
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

   /**
   * Endpoint para crear una nueva reserva.
   * 
   * @param {Reserva} reserva - Los datos de la nueva reserva.
   * @returns {Promise<{ message: string; reserva: Reserva }>} - Un objeto que contiene un mensaje de éxito y la reserva creada.
   */
  @Post()
  async create(@Body() reserva: Reserva): Promise<{ message: string; reserva: Reserva }> {
    return this.reservasService.create(reserva);
  }

  /**
   * Obtiene todas las reservas.
   * @returns {Promise<{ message: string, reservas: Reserva[], total: number }>} - Objeto que contiene un mensaje de éxito, la lista de todas las reservas y el total de registros.
   * @throws {NotFoundException} - Si ocurre un problema durante la obtención de las reservas.
   */
  @Get()
  async findAll(): Promise<{ message: string, reservas: Reserva[], total: number }> {
    try {
      const result = await this.reservasService.findAll();
      return result;
    } catch (error) {
      throw new NotFoundException(`Error al obtener todas las reservas. Detalles: ${error.message}`);
    }
  }

  /**
   * Obtiene una reserva específica por su ID.
   * 
   * @param {number} id - El ID de la reserva a buscar.
   * @returns {Promise<{ message: string, reserva: Reserva }>} - La reserva encontrada.
   * @throws {NotFoundException} - Si no se encuentra la reserva con el ID proporcionado.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<{ message: string, reserva: Reserva }> {
    try {
      const result = await this.reservasService.findOne(id);
      if (!result.reserva) {
        throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
      }
      return result;
    } catch (error) {
      throw new NotFoundException(`Error al obtener la reserva con ID ${id}. Detalles: ${error.message}`);
    }
  }

  /**
   * Elimina lógicamente una reserva.
   * 
   * @param {number} id - El ID de la reserva a eliminar.
   * @returns {Promise<{ message: string, reserva: Reserva }>} - La reserva eliminada lógicamente.
   * @throws {NotFoundException} - Si no se encuentra la reserva con el ID proporcionado.
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string, reserva: Reserva }> {
    try {
      const result = await this.reservasService.delete(id);
      if (!result.reserva) {
        throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
      }
      return result;
    } catch (error) {
      throw new NotFoundException(`Error al eliminar la reserva con ID ${id}. Detalles: ${error.message}`);
    }
  }

  /**
   * Actualiza una reserva existente.
   * 
   * @param {number} id - El ID de la reserva a actualizar.
   * @param {Partial<Reserva>} reserva - Los nuevos datos para actualizar la reserva.
   * @returns {Promise<{ message: string, reserva: Reserva }>} - La reserva actualizada.
   * @throws {NotFoundException} - Si no se encuentra la reserva con el ID proporcionado.
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() reserva: Partial<Reserva>,
  ): Promise<{ message: string, reserva: Reserva }> {
    try {
      const result = await this.reservasService.update(id, reserva);
      if (!result.reserva) {
        throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
      }
      return result;
    } catch (error) {
      throw new NotFoundException(`Error al actualizar la reserva con ID ${id}. Detalles: ${error.message}`);
    }
  }
}
