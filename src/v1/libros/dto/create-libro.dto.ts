import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ description: 'Título del libro', example: 'Cien años de soledad' })
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
  @ApiProperty({ description: 'Autor del libro', example: 'Gabriel García Márquez' })
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
  @ApiProperty({ description: 'Nacionalidad del autor', example: 'Colombiano' })
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
  @ApiProperty({ description: 'Temática del libro', example: 'Realismo mágico' })
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
  @ApiProperty({ description: 'Año de publicación del libro', example: 1967 })
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
  @ApiProperty({ description: 'Extracto o resumen del libro', maxLength: 1000, example: 'Un libro que narra la historia de la familia Buendía...' })
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
  @ApiProperty({ description: 'Editorial que publicó el libro', example: 'Editorial Sudamericana' })
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
  @ApiProperty({ description: 'Disponibilidad del libro', example: true })
  @IsBoolean()
  @IsNotEmpty()
  disponible: boolean;
}
