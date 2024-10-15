import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Importar ApiProperty
import { Reserva } from '@reservas/reserva.entity'; // Ruta Absoluta
import { Prestamo } from '@prestamos/prestamo.entity'; // Ruta Absoluta

/**
 * La entidad Libro representa un libro en la biblioteca.
 * Incluye información detallada sobre el libro y sus relaciones con reservas y préstamos.
 */
@Entity()
export class Libro {
  /**
   * Identificador único del libro.
   * Este campo es la clave primaria y se genera automáticamente.
   */
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Identificador único del libro' }) // Swagger
  id: number;

  /**
   * Título del libro.
   * Este campo almacena el título del libro como una cadena de texto.
   */
  @Column()
  @ApiProperty({ description: 'Título del libro' }) // Swagger
  titulo: string;

  /**
   * Autor del libro.
   * Este campo almacena el nombre del autor del libro.
   */
  @Column()
  @ApiProperty({ description: 'Autor del libro' }) // Swagger
  autor: string;

  /**
   * Nacionalidad del autor del libro.
   * Este campo almacena la nacionalidad del autor.
   */
  @Column()
  @ApiProperty({ description: 'Nacionalidad del autor del libro' }) // Swagger
  nacionalidadAutor: string;

  /**
   * Temática del libro.
   * Este campo almacena la temática o el género del libro.
   */
  @Column()
  @ApiProperty({ description: 'Temática del libro' }) // Swagger
  tematica: string;

  /**
   * Año de publicación del libro.
   * Este campo almacena el año en que el libro fue publicado.
   */
  @Column()
  @ApiProperty({ description: 'Año de publicación del libro' }) // Swagger
  anioPublicacion: number;

  /**
   * Extracto del libro.
   * Este campo almacena un extracto o resumen del libro con una longitud máxima de 1000 caracteres.
   */
  @Column({ length: 1000 })
  @ApiProperty({ description: 'Extracto del libro', maxLength: 1000 }) // Swagger
  extracto: string;

  /**
   * Editorial del libro.
   * Este campo almacena el nombre de la editorial que publicó el libro.
   */
  @Column()
  @ApiProperty({ description: 'Editorial del libro' }) // Swagger
  editorial: string;

  /**
   * Indica si el libro está disponible para préstamo o reserva.
   * Este campo es un booleano que, por defecto, es verdadero (`true`), lo que significa que el libro está disponible.
   */
  @Column({ default: true })
  @ApiProperty({ description: 'Indica si el libro está disponible para préstamo o reserva', default: true }) // Swagger
  disponible: boolean;

  /**
   * Indica si el libro está eliminado.
   * Este campo es un booleano que indica si el libro ha sido eliminado. El valor predeterminado es `false` (no eliminado).
   */
  @Column({ default: false })
  @ApiProperty({ description: 'Indica si el libro está eliminado', default: false }) // Swagger
  isDeleted: boolean;

  /**
   * Reservas asociadas al libro.
   * Define una relación uno-a-muchos con la entidad Reserva.
   * Un libro puede tener múltiples reservas.
   */
  @OneToMany(() => Reserva, (reserva) => reserva.libro)
  @ApiProperty({ type: () => Reserva, isArray: true }) // Swagger
  reservas: Reserva[];

  /**
   * Préstamos asociados al libro.
   * Define una relación uno-a-muchos con la entidad Prestamo.
   * Un libro puede tener múltiples préstamos.
   */
  @OneToMany(() => Prestamo, (prestamo) => prestamo.libro)
  @ApiProperty({ type: () => Prestamo, isArray: true }) // Swagger
  prestamos: Prestamo[];
}
