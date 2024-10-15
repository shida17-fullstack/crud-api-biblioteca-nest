import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Reserva } from '@reservas/reserva.entity'; // Ruta Absoluta
import { ReservasService } from '@reservas/reservas.service'; // Ruta Absoluta
import { CreateReservaDto, UpdateReservaDto } from '@reservas/dto/reserva.dto'; // Ruta Absoluta
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard'; // Ruta Absoluta
import { JwtPayload } from '@auth/jwt-payload.interface'; // Importa JwtPayload 

@ApiTags('reservas')
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
@UseGuards(JwtAuthGuard) // Aplica el guardia de autenticación
@ApiOperation({ summary: 'Crear una nueva reserva' })
@ApiResponse({ status: 201, description: 'Reserva creada exitosamente.' })
@ApiResponse({ status: 404, description: 'Libro o usuario no encontrado.' })
@ApiResponse({ status: 409, description: 'Conflicto con la reserva.' })
@ApiResponse({ status: 403, description: 'Permiso denegado.' })
async create(
  @Body() createReservaDto: CreateReservaDto,
  @Req() req: any, // Accede a la solicitud para obtener el usuario autenticado
): Promise<{ message: string; reserva: Reserva }> {
  const usuarioAutenticado: JwtPayload = {
    sub: req.user.usuarioId, 
    nombreUsuario: req.user.nombreUsuario,
  };

  return this.reservasService.create(createReservaDto, usuarioAutenticado);
}


 /**
 * Obtiene todas las reservas.
 * 
 * @returns {Promise<{ message: string; reservas: any[]; total: number }>} 
 * Un objeto con un mensaje, la lista de reservas (con mensajes si faltan datos) y el total de reservas.
 * @throws {NotFoundException} - Si ocurre un error al recuperar las reservas.
 */
@Get()
@ApiOperation({ summary: 'Obtiene todas las reservas.' })
@ApiResponse({ status: 200, description: 'Reservas obtenidas exitosamente.' })
@ApiResponse({ status: 404, description: 'Error al obtener las reservas.' })
async findAll(): Promise<{
  message: string;
  reservas: any[];  // Lista de reservas con mensajes si usuario o libro están ausentes.
  total: number;
}> {
  try {
    const result = await this.reservasService.findAll();
    return result;
  } catch (error) {
    throw new NotFoundException(
      `Error al obtener todas las reservas. Detalles: ${error.message}`,
    );
  }
}



  /**
   * Obtiene una reserva por su ID.
   * 
   * @param {number} id - ID de la reserva.
   * @returns {Promise<{ message: string; reserva: Reserva }>} - Datos de la reserva.
   * @throws {NotFoundException} - Si la reserva no se encuentra.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una reserva por su ID.' })
  @ApiResponse({ status: 200, description: 'Reserva recuperada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; reserva: Reserva }> {
    try {
      const result = await this.reservasService.findOne(id);
      if (!result.reserva) {
        throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
      }
      return result;
    } catch (error) {
      throw new NotFoundException(
        `Error al obtener la reserva con ID ${id}. Detalles: ${error.message}`,
      );
    }
  }

  /**
   * Elimina una reserva por su ID.
   * 
   * @param {number} id - ID de la reserva.
   * @returns {Promise<{ message: string; reserva: Reserva }>} - Mensaje y datos de la reserva eliminada.
   * @throws {NotFoundException} - Si la reserva no se encuentra.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una reserva por su ID.' })
  @ApiResponse({ status: 200, description: 'Reserva eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; reserva: Reserva }> {
    try {
      const result = await this.reservasService.delete(id);
      if (!result.reserva) {
        throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
      }
      return result;
    } catch (error) {
      throw new NotFoundException(
        `Error al eliminar la reserva con ID ${id}. Detalles: ${error.message}`,
      );
    }
  }

  /**
   * Actualiza una reserva existente.
   * 
   * @param {number} id - ID de la reserva.
   * @param {UpdateReservaDto} updateReservaDto - Datos actualizados de la reserva.
   * @returns {Promise<{ message: string; reserva: Reserva }>} - Mensaje y datos de la reserva actualizada.
   * @throws {NotFoundException} - Si la reserva no se encuentra.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Actualiza una reserva existente.' })
  @ApiResponse({ status: 200, description: 'Reserva actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservaDto: UpdateReservaDto,
  ): Promise<{ message: string; reserva: Reserva }> {
    try {
      const result = await this.reservasService.update(id, updateReservaDto);
      if (!result.reserva) {
        throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
      }
      return result;
    } catch (error) {
      throw new NotFoundException(
        `Error al actualizar la reserva con ID ${id}. Detalles: ${error.message}`,
      );
    }
  }
}
