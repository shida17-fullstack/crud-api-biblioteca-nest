import { Controller, Get, Post, Put, Body, Param, Delete, Query, NotFoundException, ConflictException } from '@nestjs/common';
import { LibrosService } from './libros.service';
import { Libro } from './libro.entity';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  /**
   * Crea un nuevo libro.
   * Verifica si el libro ya existe antes de crearlo.
   * @param libro - Los datos del libro a crear.
   * @returns Un mensaje de éxito y el libro creado.
   * @throws ConflictException si el libro ya existe.
   */
  @Post()
  async create(@Body() libro: Libro): Promise<{ message: string, libro: Libro }> {
    const existingLibro = await this.librosService.findByTituloAndAutor(libro.titulo, libro.autor);
    if (existingLibro) {
      throw new ConflictException('El libro ya existe');
    }
    const createdLibro = await this.librosService.create(libro);
    return { message: 'Libro creado exitosamente', libro: createdLibro };
  }

  /**
   * Busca libros por varios criterios.
   * @param titulo - El título del libro.
   * @param autor - El autor del libro.
   * @param nacionalidad - La nacionalidad del autor del libro.
   * @param tema - La temática del libro.
   * @param anio - El año de publicación del libro.
   * @returns Un mensaje de éxito, la lista de libros encontrados y el total de registros.
   * @throws NotFoundException si no se encuentran libros que coincidan con los criterios de búsqueda.
   */
  @Get('search')
  async search(
    @Query('titulo') titulo: string,
    @Query('autor') autor: string,
    @Query('nacionalidad') nacionalidad: string,
    @Query('tema') tema: string,
    @Query('anio') anio: number,
  ): Promise<{ message: string; libros: Libro[]; total: number }> {
    const { libros, total } = await this.librosService.search(titulo, autor, nacionalidad, tema, anio);
    if (libros.length === 0) {
      throw new NotFoundException('No se encontraron libros que coincidan con los criterios de búsqueda.');
    }
    return { message: 'Resultados de búsqueda obtenidos', libros, total };
  }

  /**
   * Busca un libro por su ID.
   * @param id - El ID del libro.
   * @returns Un mensaje de éxito y el libro encontrado.
   * @throws NotFoundException si el libro no se encuentra.
   */
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<{ message: string, libro: Libro }> {
    const libro = await this.librosService.findOne(id);
    if (!libro) {
      throw new NotFoundException('Libro no encontrado');
    }
    return { message: 'Libro encontrado', libro };
  }

  /**
   * Obtiene todos los libros.
   * @returns Un mensaje de éxito, la lista de libros y el total de libros.
   */
  @Get()
  async findAll(): Promise<{ message: string, libros: Libro[], total: number }> {
    const { libros, total } = await this.librosService.findAll();
    return { message: 'Listado de libros obtenido exitosamente', libros, total };
  }

  /**
   * Elimina un libro por su ID.
   * @param id - El ID del libro.
   * @returns Un mensaje de éxito.
   * @throws NotFoundException si el libro no se encuentra.
   * @throws ConflictException si el libro ya ha sido eliminado.
   */
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.librosService.remove(id);
    return { message: 'Libro eliminado exitosamente' };
  }

  /**
   * Actualiza un libro por su ID.
   * Verifica si los datos enviados son idénticos a los datos actuales.
   * @param id - El ID del libro.
   * @param libro - Los nuevos datos del libro.
   * @returns Un mensaje de éxito y el libro actualizado, o un mensaje indicando que los datos no cambiaron.
   * @throws NotFoundException si el libro no se encuentra.
   */
  @Put(':id')
  async update(@Param('id') id: number, @Body() libro: Partial<Libro>): Promise<{ message: string, libro?: Libro }> {
    try {
      const updatedLibro = await this.librosService.update(id, libro);
      return { message: 'Libro actualizado exitosamente', libro: updatedLibro };
    } catch (error) {
      if (error.message === 'Los datos enviados son idénticos a los datos actuales') {
        return { message: 'Los datos enviados son idénticos a los datos actuales' };
      }
      throw error;
    }
  }
}
