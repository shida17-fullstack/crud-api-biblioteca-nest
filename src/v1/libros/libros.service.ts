import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';

/**
 * Servicio que proporciona métodos para gestionar los libros en la base de datos.
 */
@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly librosRepository: Repository<Libro>,
  ) {}

  /**
   * Crea un nuevo libro en la base de datos.
   * @param libro - Los datos del libro a crear.
   * @returns El libro creado.
   */
  async create(libro: Libro): Promise<Libro> {
    return this.librosRepository.save(libro);
  }

  /**
   * Busca un libro por título y autor.
   * @param titulo - El título del libro.
   * @param autor - El autor del libro.
   * @returns El libro encontrado, o `undefined` si no se encuentra.
   */
  async findByTituloAndAutor(titulo: string, autor: string): Promise<Libro | undefined> {
    return this.librosRepository.findOne({ where: { titulo, autor } });
  }

  /**
   * Busca libros según varios criterios.
   * @param titulo - El título del libro.
   * @param autor - El autor del libro.
   * @param nacionalidad - La nacionalidad del autor del libro.
   * @param tema - La temática del libro.
   * @param anio - El año de publicación del libro.
   * @returns Un objeto con la lista de libros y el total de libros que coinciden con los criterios de búsqueda.
   */
  async search(titulo: string, autor: string, nacionalidad: string, tema: string, anio: number): Promise<{ libros: Libro[], total: number }> {
    const query = this.librosRepository.createQueryBuilder('libro');
    if (titulo) query.andWhere('libro.titulo LIKE :titulo', { titulo: `%${titulo}%` });
    if (autor) query.andWhere('libro.autor LIKE :autor', { autor: `%${autor}%` });
    if (nacionalidad) query.andWhere('libro.nacionalidadAutor LIKE :nacionalidad', { nacionalidad: `%${nacionalidad}%` });
    if (tema) query.andWhere('libro.tematica LIKE :tema', { tema: `%${tema}%` });
    if (anio) query.andWhere('libro.anioPublicacion = :anio', { anio });

    const [libros, total] = await query.getManyAndCount();

    return { libros, total };
  }

  /**
   * Busca un libro por su ID.
   * @param id - El ID del libro.
   * @returns El libro encontrado, o `undefined` si no se encuentra.
   */
  async findOne(id: number): Promise<Libro> {
    return this.librosRepository.findOne({ where: { id } });
  }

  /**
   * Obtiene todos los libros y el total de libros.
   * @returns Un objeto con la lista de libros y el total de libros.
   */
  async findAll(): Promise<{ libros: Libro[], total: number }> {
    const [libros, total] = await this.librosRepository.findAndCount();
    return { libros, total };
  }

  /**
   * Marca un libro como eliminado por su ID.
   * @param id - El ID del libro.
   * @throws NotFoundException si el libro no se encuentra.
   * @throws ConflictException si el libro ya ha sido eliminado.
   */
  async remove(id: number): Promise<void> {
    const libro = await this.librosRepository.findOne({ where: { id } });
    if (!libro) {
      throw new NotFoundException('Libro no encontrado');
    }
    if (libro.isDeleted) {
      throw new ConflictException('El libro ya ha sido eliminado');
    }
    libro.isDeleted = true;
    await this.librosRepository.save(libro);
  }

  /**
   * Actualiza un libro por su ID.
   * Verifica si los datos enviados son idénticos a los datos actuales.
   * @param id - El ID del libro.
   * @param libro - Los nuevos datos del libro.
   * @returns El libro actualizado.
   * @throws NotFoundException si el libro no se encuentra.
   * @throws Error si los datos enviados son idénticos a los datos actuales.
   */
  async update(id: number, libro: Partial<Libro>): Promise<Libro> {
    const existingLibro = await this.librosRepository.findOne({ where: { id } });
    if (!existingLibro) {
      throw new NotFoundException('Libro no encontrado');
    }

    const isIdentical = Object.keys(libro).every(
      (key) => libro[key] === existingLibro[key]
    );

    if (isIdentical) {
      throw new Error('Los datos enviados son idénticos a los datos actuales');
    }

    await this.librosRepository.update({ id }, libro);
    return this.librosRepository.findOne({ where: { id } });
  }
}
