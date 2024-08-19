import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  MaxLength,
} from 'class-validator';

/**
 * Data Transfer Object (DTO) para crear un nuevo libro.
 *
 * Este DTO define la estructura y las validaciones necesarias para los datos
 * que se requieren al crear un libro en el sistema.
 *
 * @export
 * @class CreateLibroDTO
 */
export class CreateLibroDTO {
  /**
   * Título del libro.
   *
   * Debe ser una cadena de texto no vacía.
   *
   * @type {string}
   * @memberof CreateLibroDTO
   */
  @IsString()
  @IsNotEmpty()
  titulo: string;

  /**
   * Autor del libro.
   *
   * Debe ser una cadena de texto no vacía.
   *
   * @type {string}
   * @memberof CreateLibroDTO
   */
  @IsString()
  @IsNotEmpty()
  autor: string;

  /**
   * Nacionalidad del autor.
   *
   * Debe ser una cadena de texto no vacía.
   *
   * @type {string}
   * @memberof CreateLibroDTO
   */
  @IsString()
  @IsNotEmpty()
  nacionalidadAutor: string;

  /**
   * Temática del libro.
   *
   * Debe ser una cadena de texto no vacía.
   *
   * @type {string}
   * @memberof CreateLibroDTO
   */
  @IsString()
  @IsNotEmpty()
  tematica: string;

  /**
   * Año de publicación del libro.
   *
   * Debe ser un número no vacío.
   *
   * @type {number}
   * @memberof CreateLibroDTO
   */
  @IsNumber()
  @IsNotEmpty()
  anioPublicacion: number;

  /**
   * Extracto o resumen del libro.
   *
   * Debe ser una cadena de texto con un máximo de 1000 caracteres y no vacía.
   *
   * @type {string}
   * @memberof CreateLibroDTO
   */
  @IsString()
  @MaxLength(1000)
  @IsNotEmpty()
  extracto: string;

  /**
   * Editorial que publicó el libro.
   *
   * Debe ser una cadena de texto no vacía.
   *
   * @type {string}
   * @memberof CreateLibroDTO
   */
  @IsString()
  @IsNotEmpty()
  editorial: string;

  /**
   * Disponibilidad del libro.
   *
   * Debe ser un valor booleano no vacío.
   *
   * @type {boolean}
   * @memberof CreateLibroDTO
   */
  @IsBoolean()
  @IsNotEmpty()
  disponible: boolean;
}
