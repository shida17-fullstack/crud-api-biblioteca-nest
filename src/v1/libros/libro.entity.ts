import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reserva } from '../reservas/reserva.entity';
import { Prestamo } from '../prestamos/prestamo.entity';

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
  id: number;

  /**
   * Título del libro.
   * Este campo almacena el título del libro como una cadena de texto.
   */
  @Column()
  titulo: string;

  /**
   * Autor del libro.
   * Este campo almacena el nombre del autor del libro.
   */
  @Column()
  autor: string;

  /**
   * Nacionalidad del autor del libro.
   * Este campo almacena la nacionalidad del autor.
   */
  @Column()
  nacionalidadAutor: string;

  /**
   * Temática del libro.
   * Este campo almacena la temática o el género del libro.
   */
  @Column()
  tematica: string;

  /**
   * Año de publicación del libro.
   * Este campo almacena el año en que el libro fue publicado.
   */
  @Column()
  anioPublicacion: number;

  /**
   * Extracto del libro.
   * Este campo almacena un extracto o resumen del libro con una longitud máxima de 1000 caracteres.
   */
  @Column({ length: 1000 })
  extracto: string;

  /**
   * Editorial del libro.
   * Este campo almacena el nombre de la editorial que publicó el libro.
   */
  @Column()
  editorial: string;

  /**
   * Indica si el libro está disponible para préstamo o reserva.
   * Este campo es un booleano que, por defecto, es verdadero (`true`), lo que significa que el libro está disponible.
   */
  @Column({ default: true })
  disponible: boolean;

  /**
   * Indica si el libro está eliminado.
   * Este campo es un booleano que indica si el libro ha sido eliminado. El valor predeterminado es `false` (no eliminado).
   */
  @Column({ default: false })
  isDeleted: boolean;

  /**
   * Reservas asociadas al libro.
   * Define una relación uno-a-muchos con la entidad Reserva.
   * Un libro puede tener múltiples reservas.
   */
  @OneToMany(() => Reserva, (reserva) => reserva.libro)
  reservas: Reserva[];

  /**
   * Préstamos asociados al libro.
   * Define una relación uno-a-muchos con la entidad Prestamo.
   * Un libro puede tener múltiples préstamos.
   */
  @OneToMany(() => Prestamo, (prestamo) => prestamo.libro)
  prestamos: Prestamo[];
}
