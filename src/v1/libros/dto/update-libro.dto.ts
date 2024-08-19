import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
} from 'class-validator';

/**
 * Data Transfer Object (DTO) para actualizar un libro.
 *
 * Este DTO define la estructura y las validaciones necesarias para los datos
 * que se pueden actualizar de un libro en el sistema. Todos los campos son opcionales,
 * lo que significa que solo los campos que se proporcionan serán actualizados.
 *
 * @export
 * @class UpdateLibroDTO
 */
export class UpdateLibroDTO {
  /**
   * Título del libro.
   *
   * Debe ser una cadena de texto si se proporciona. Es opcional.
   *
   * @type {string}
   * @memberof UpdateLibroDTO
   */
  @IsString()
  @IsOptional()
  titulo?: string;

  /**
   * Autor del libro.
   *
   * Debe ser una cadena de texto si se proporciona. Es opcional.
   *
   * @type {string}
   * @memberof UpdateLibroDTO
   */
  @IsString()
  @IsOptional()
  autor?: string;

  /**
   * Nacionalidad del autor.
   *
   * Debe ser una cadena de texto si se proporciona. Es opcional.
   *
   * @type {string}
   * @memberof UpdateLibroDTO
   */
  @IsString()
  @IsOptional()
  nacionalidadAutor?: string;

  /**
   * Temática del libro.
   *
   * Debe ser una cadena de texto si se proporciona. Es opcional.
   *
   * @type {string}
   * @memberof UpdateLibroDTO
   */
  @IsString()
  @IsOptional()
  tematica?: string;

  /**
   * Año de publicación del libro.
   *
   * Debe ser un número si se proporciona. Es opcional.
   *
   * @type {number}
   * @memberof UpdateLibroDTO
   */
  @IsNumber()
  @IsOptional()
  anioPublicacion?: number;

  /**
   * Extracto o resumen del libro.
   *
   * Debe ser una cadena de texto con un máximo de 1000 caracteres si se proporciona. Es opcional.
   *
   * @type {string}
   * @memberof UpdateLibroDTO
   */
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  extracto?: string;

  /**
   * Editorial que publicó el libro.
   *
   * Debe ser una cadena de texto si se proporciona. Es opcional.
   *
   * @type {string}
   * @memberof UpdateLibroDTO
   */
  @IsString()
  @IsOptional()
  editorial?: string;

  /**
   * Disponibilidad del libro.
   *
   * Debe ser un valor booleano si se proporciona. Es opcional.
   *
   * @type {boolean}
   * @memberof UpdateLibroDTO
   */
  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}
