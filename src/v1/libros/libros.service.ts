import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from '@libros/libro.entity';
import { CreateLibroDTO } from '@libros/dto/create-libro.dto';
import { UpdateLibroDTO } from '@libros/dto/update-libro.dto';
import { Usuario, Rol } from '@usuarios/usuario.entity';
import { JwtPayload } from '@auth/jwt-payload.interface';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly librosRepository: Repository<Libro>,
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

 /**
 * Crea un nuevo libro en la base de datos.
 * 
 * @param createLibroDto - Objeto Data Transfer Object (DTO) que contiene los datos necesarios para crear un nuevo libro.
 * @param usuarioAutenticado - Objeto que contiene la información del usuario autenticado, derivada del token JWT.
 * @returns Una promesa que resuelve con el objeto `Libro` recién creado.
 * 
 * @throws {ForbiddenException} Si el usuario autenticado no se encuentra en la base de datos.
 * @throws {ForbiddenException} Si el usuario autenticado no tiene los permisos necesarios para crear un libro.
 * @throws {ConflictException} Si el libro que se intenta crear ya existe.
 */
async create(createLibroDto: CreateLibroDTO, usuarioAutenticado: JwtPayload): Promise<Libro> {
  // Imprime en consola la información del usuario autenticado
  console.log('Usuario autenticado en create:', usuarioAutenticado);

  // Busca al usuario autenticado en la base de datos usando 'sub' como ID
  const usuarioAutenticadoBD = await this.usuariosRepository.findOne({ where: { id: usuarioAutenticado.sub } });
  console.log('Usuario encontrado en la base de datos:', usuarioAutenticadoBD);

  // Si el usuario autenticado no se encuentra en la base de datos, lanza una excepción ForbiddenException
  if (!usuarioAutenticadoBD) {
    throw new ForbiddenException('Usuario autenticado no encontrado.');
  }

  // Verifica si el usuario autenticado tiene uno de los roles especiales necesarios para crear un libro
  const tienePermisoEspecial = [
    Rol.DIRECTOR,
    Rol.AUXILIAR,
    Rol.BIBLIOTECARIO,
  ].includes(usuarioAutenticadoBD.rol);

  // Si el usuario tiene permiso especial, procede con la creación del libro
  if (tienePermisoEspecial) {
    // Verifica si el libro ya existe buscando por título y autor
    const existingLibro = await this.findByTituloAndAutor(createLibroDto.titulo, createLibroDto.autor);
    if (existingLibro) {
      // Si el libro ya existe, lanza una excepción ConflictException
      throw new ConflictException('El libro ya existe');
    }

    // Crea y guarda el nuevo libro en la base de datos
    const libro = this.librosRepository.create(createLibroDto);
    return this.librosRepository.save(libro);
  } else {
    // Si el usuario no tiene permiso especial, lanza una excepción ForbiddenException
    throw new ForbiddenException('No tiene permiso para crear un libro. Solo directores, auxiliares y bibliotecarios pueden realizar esta acción.');
  }
}



  /**
   * Busca un libro por título y autor.
   *
   * @param {string} titulo - El título del libro.
   * @param {string} autor - El autor del libro.
   * @returns {Promise<Libro | undefined>} - El libro encontrado, o `undefined` si no se encuentra.
   */
  async findByTituloAndAutor(
    titulo: string,
    autor: string,
  ): Promise<Libro | undefined> {
    return this.librosRepository.findOne({ where: { titulo, autor } });
  }

  /**
   * Busca libros según varios criterios.
   *
   * @param {string} titulo - El título del libro.
   * @param {string} autor - El autor del libro.
   * @param {string} nacionalidad - La nacionalidad del autor del libro.
   * @param {string} tema - La temática del libro.
   * @param {number} anio - El año de publicación del libro.
   * @returns {Promise<{ libros: Libro[], total: number }>} - Un objeto con la lista de libros y el total de libros que coinciden con los criterios de búsqueda.
   */
  async search(
    titulo: string,
    autor: string,
    nacionalidad: string,
    tema: string,
    anio: number,
  ): Promise<{ libros: Libro[]; total: number }> {
    const query = this.librosRepository.createQueryBuilder('libro');
    if (titulo)
      query.andWhere('libro.titulo LIKE :titulo', { titulo: `%${titulo}%` });
    if (autor)
      query.andWhere('libro.autor LIKE :autor', { autor: `%${autor}%` });
    if (nacionalidad)
      query.andWhere('libro.nacionalidadAutor LIKE :nacionalidad', {
        nacionalidad: `%${nacionalidad}%`,
      });
    if (tema)
      query.andWhere('libro.tematica LIKE :tema', { tema: `%${tema}%` });
    if (anio) query.andWhere('libro.anioPublicacion = :anio', { anio });

    const [libros, total] = await query.getManyAndCount();

    return { libros, total };
  }

  /**
   * Busca un libro por su ID.
   *
   * @param {number} id - El ID del libro.
   * @returns {Promise<Libro>} - El libro encontrado, o `undefined` si no se encuentra.
   */
  async findOne(id: number): Promise<Libro> {
    return this.librosRepository.findOne({ where: { id } });
  }

  /**
   * Obtiene todos los libros y el total de libros.
   *
   * @returns {Promise<{ libros: Libro[], total: number }>} - Un objeto con la lista de libros y el total de libros.
   */
  async findAll(): Promise<{ libros: Libro[]; total: number }> {
    const [libros, total] = await this.librosRepository.findAndCount();
    return { libros, total };
  }

  /**
   * Marca un libro como eliminado por su ID.
   *
   * @param {number} id - El ID del libro.
   * @throws {NotFoundException} - Si el libro no se encuentra.
   * @throws {ConflictException} - Si el libro ya ha sido eliminado.
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
   * Actualiza un libro existente.
   *
   * @param {number} id - El ID del libro.
   * @param {UpdateLibroDTO} updateLibroDto - Datos para actualizar el libro.
   * @returns {Promise<Libro>} - El libro actualizado.
   * @throws {NotFoundException} - Si el libro no se encuentra.
   * @throws {ConflictException} - Si los datos enviados son idénticos a los datos actuales.
   * @throws {ConflictException} - Si el libro está eliminado.
   */
  async update(id: number, updateLibroDto: UpdateLibroDTO): Promise<Libro> {
    const existingLibro = await this.librosRepository.findOne({
      where: { id },
    });

    if (!existingLibro) {
      throw new NotFoundException('Libro no encontrado');
    }

    // Verifica si el libro está marcado como eliminado
    if (existingLibro.isDeleted) {
      throw new ConflictException('El libro está eliminado y no puede ser actualizado');
    }

    // Guardar el estado antes de aplicar los cambios
    const originalLibro = { ...existingLibro };

    // Aplicar los cambios al libro existente
    Object.assign(existingLibro, updateLibroDto);

    // Comprobar si hubo cambios reales
    const hasChanges = Object.keys(updateLibroDto).some(
      (key) => updateLibroDto[key] !== originalLibro[key],
    );

    if (!hasChanges) {
      throw new ConflictException(
        'Los datos enviados son idénticos a los datos actuales',
      );
    }

    // Guardar el libro actualizado
    return this.librosRepository.save(existingLibro);
  }
}
