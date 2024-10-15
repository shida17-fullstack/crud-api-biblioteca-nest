import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ description: 'Título del libro', example: 'Cien años de soledad', required: false })
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
  @ApiProperty({ description: 'Autor del libro', example: 'Gabriel García Márquez', required: false })
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
  @ApiProperty({ description: 'Nacionalidad del autor', example: 'Colombiano', required: false })
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
  @ApiProperty({ description: 'Temática del libro', example: 'Realismo mágico', required: false })
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
  @ApiProperty({ description: 'Año de publicación del libro', example: 1967, required: false })
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
  @ApiProperty({ description: 'Extracto o resumen del libro', maxLength: 1000, required: false, example: 'Un libro que narra la historia de la familia Buendía...' })
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
  @ApiProperty({ description: 'Editorial que publicó el libro', example: 'Editorial Sudamericana', required: false })
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
  @ApiProperty({ description: 'Disponibilidad del libro', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}
