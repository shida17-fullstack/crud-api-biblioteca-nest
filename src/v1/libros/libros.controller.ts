import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Query,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LibrosService } from '@libros/libros.service';
import { Libro } from '@libros/libro.entity';
import { CreateLibroDTO } from '@libros/dto/create-libro.dto';
import { UpdateLibroDTO } from '@libros/dto/update-libro.dto';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { Request } from '@nestjs/common';
import { JwtPayload } from '@auth/jwt-payload.interface';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('libros')
@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  /**
   * Crear un nuevo libro.
   *
   * @param {CreateLibroDTO} createLibroDto - Los datos del nuevo libro.
   * @param {Request} req - La solicitud HTTP.
   * @returns {Promise<{ message: string; libro: Libro }>} - Un mensaje de éxito y el libro creado.
   */
  @ApiOperation({ summary: 'Crear un nuevo libro' })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createLibroDto: CreateLibroDTO,
    @Req() req: any,
  ): Promise<{ message: string; libro: Libro }> {
    const usuarioAutenticado: JwtPayload = {
      sub: req.user.usuarioId,
      nombreUsuario: req.user.nombreUsuario,
    };
    console.log('Usuario autenticado recibido en el controlador:', usuarioAutenticado);

    const createdLibro = await this.librosService.create(createLibroDto, usuarioAutenticado);
    return { message: 'Libro creado exitosamente', libro: createdLibro };
  }

  /**
   * Busca libros por varios criterios.
   *
   * @param {string} [titulo] - El título del libro.
   * @param {string} [autor] - El autor del libro.
   * @param {string} [nacionalidad] - La nacionalidad del autor del libro.
   * @param {string} [tema] - La temática del libro.
   * @param {number} [anio] - El año de publicación del libro.
   * @returns {Promise<{ message: string; libros: Libro[]; total: number }>} - Un mensaje de éxito, la lista de libros encontrados y el total de registros.
   * @throws {NotFoundException} - Si no se encuentran libros que coincidan con los criterios de búsqueda.
   */
  @ApiOperation({ summary: 'Buscar libros por varios criterios' })
  @Get('search')
  async search(
    @Query('titulo') titulo: string,
    @Query('autor') autor: string,
    @Query('nacionalidad') nacionalidad: string,
    @Query('tema') tema: string,
    @Query('anio') anio: number,
  ): Promise<{ message: string; libros: Libro[]; total: number }> {
    const { libros, total } = await this.librosService.search(
      titulo,
      autor,
      nacionalidad,
      tema,
      anio,
    );
    if (libros.length === 0) {
      throw new NotFoundException(
        'No se encontraron libros que coincidan con los criterios de búsqueda.',
      );
    }
    return { message: 'Resultados de búsqueda obtenidos', libros, total };
  }

  /**
   * Busca un libro por su ID.
   *
   * @param {number} id - El ID del libro.
   * @returns {Promise<{ message: string, libro: Libro }>} - Un mensaje de éxito y el libro encontrado.
   * @throws {NotFoundException} - Si el libro no se encuentra.
   */
  @ApiOperation({ summary: 'Buscar un libro por su ID' })
  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<{ message: string; libro: Libro }> {
    const libro = await this.librosService.findOne(id);
    if (!libro) {
      throw new NotFoundException('Libro no encontrado');
    }
    return { message: 'Libro encontrado', libro };
  }

  /**
   * Obtiene todos los libros.
   *
   * @returns {Promise<{ message: string, libros: Libro[], total: number }>} - Un mensaje de éxito, la lista de libros y el total de libros.
   */
  @ApiOperation({ summary: 'Obtener todos los libros' })
  @Get()
  async findAll(): Promise<{
    message: string;
    libros: Libro[];
    total: number;
  }> {
    const { libros, total } = await this.librosService.findAll();
    return {
      message: 'Listado de libros obtenido exitosamente',
      libros,
      total,
    };
  }

  /**
   * Elimina un libro por su ID.
   *
   * @param {number} id - El ID del libro.
   * @returns {Promise<{ message: string }>} - Un mensaje de éxito.
   * @throws {NotFoundException} - Si el libro no se encuentra.
   * @throws {ConflictException} - Si el libro ya ha sido eliminado.
   */
  @ApiOperation({ summary: 'Eliminar un libro por su ID' })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.librosService.remove(id);
    return { message: 'Libro eliminado exitosamente' };
  }

  /**
   * Actualiza un libro existente.
   *
   * @param {number} id - El ID del libro.
   * @param {UpdateLibroDTO} updateLibroDto - Datos para actualizar el libro.
   * @returns {Promise<{ message: string, libro?: Libro }>} - Un mensaje de éxito y el libro actualizado, si se proporciona.
   * @throws {ConflictException} - Si los datos enviados son idénticos a los datos actuales.
   */
  @ApiOperation({ summary: 'Actualizar un libro existente' })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLibroDto: UpdateLibroDTO,
  ): Promise<{ message: string; libro?: Libro }> {
    try {
      const updatedLibro = await this.librosService.update(id, updateLibroDto);
      return { message: 'Libro actualizado exitosamente', libro: updatedLibro };
    } catch (error) {
      if (
        error.message ===
        'Los datos enviados son idénticos a los datos actuales'
      ) {
        return {
          message: 'Los datos enviados son idénticos a los datos actuales',
        };
      }
      throw error;
    }
  }
}
