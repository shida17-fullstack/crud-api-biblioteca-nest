import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  NotFoundException,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { PrestamosService } from '@prestamos/prestamos.service';
import { CreatePrestamoDto, UpdatePrestamoDto } from '@prestamos/dto/prestamo.dto';
import { JwtPayload } from '@auth/jwt-payload.interface';
import { Prestamo } from '@prestamos/prestamo.entity';

@ApiTags('prestamos')
@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  /**
   * Crear un nuevo préstamo
   * 
   * @param {CreatePrestamoDto} createPrestamoDto - Datos del nuevo préstamo.
   * @param {any} req - El objeto de solicitud, que contiene la información del usuario autenticado.
   * @returns {Promise<{ message: string; prestamo: Prestamo }>} Un mensaje de éxito y los detalles del nuevo préstamo.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo préstamo' })
  @ApiResponse({ status: 201, description: 'Préstamo creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Información del libro o usuario requerida.' })
  @ApiResponse({ status: 404, description: 'Libro o usuario no encontrado o está eliminado.' })
  @ApiResponse({ status: 409, description: 'El libro ya está prestado o reservado.' })
  async create(
    @Body() createPrestamoDto: CreatePrestamoDto,
    @Req() req: any,
  ): Promise<{ message: string; prestamo: Prestamo }> {
    const usuarioAutenticado: JwtPayload = {
      sub: req.user.usuarioId,
      nombreUsuario: req.user.nombreUsuario,
    };
    return this.prestamosService.create(createPrestamoDto, usuarioAutenticado);
  }

  /**
   * Obtiene todos los préstamos.
   *
   * @returns {Promise<{ message: string; prestamos: Prestamo[]; total: number }>} La lista de todos los préstamos y el total.
   */
  @ApiOperation({ summary: 'Obtiene todos los préstamos.' })
  @ApiResponse({ status: 200, description: 'Préstamos recuperados exitosamente.' })
  @Get()
  async findAll(): Promise<{ message: string; prestamos: Prestamo[]; total: number }> {
    return this.prestamosService.findAll();
  }

  /**
   * Obtiene un préstamo por su ID.
   *
   * @param {number} id - El ID del préstamo.
   * @returns {Promise<any>} El préstamo encontrado.
   */
  @ApiOperation({ summary: 'Obtiene un préstamo por su ID.' })
  @ApiResponse({ status: 200, description: 'Préstamo encontrado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Préstamo no encontrado.' })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.prestamosService.findOne(id);
  }

  /**
   * Actualiza un préstamo existente.
   *
   * @param {number} id - El ID del préstamo.
   * @param {UpdatePrestamoDto} updatePrestamoDto - Los datos actualizados del préstamo.
   * @returns {Promise<any>} La respuesta de la actualización del préstamo.
   */
  @ApiOperation({ summary: 'Actualiza un préstamo existente.' })
  @ApiResponse({ status: 200, description: 'Préstamo actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Préstamo no encontrado.' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePrestamoDto: UpdatePrestamoDto): Promise<any> {
    const existingPrestamo = await this.prestamosService.findOne(id);
    if (!existingPrestamo) {
      throw new NotFoundException('El préstamo no existe.');
    }
    return this.prestamosService.update(id, updatePrestamoDto);
  }

  /**
   * Elimina un préstamo por su ID.
   *
   * @param {number} id - El ID del préstamo.
   * @returns {Promise<any>} La respuesta de la eliminación del préstamo.
   */
  @ApiOperation({ summary: 'Elimina un préstamo por su ID.' })
  @ApiResponse({ status: 200, description: 'Préstamo eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Préstamo no encontrado.' })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    return this.prestamosService.remove(id);
  }
}
