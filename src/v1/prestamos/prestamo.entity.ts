import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Libro } from '../libros/libro.entity';
import { Reserva } from '../reservas/reserva.entity';

/**
 * Entidad que representa un préstamo de libro en la base de datos.
 */
@Entity()
export class Prestamo {
  /**
   * Identificador único del préstamo.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Usuario asociado al préstamo.
   * Relación muchos a uno con la entidad Usuario.
   */
  @ManyToOne(() => Usuario, usuario => usuario.prestamos)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  /**
   * Libro asociado al préstamo.
   * Relación muchos a uno con la entidad Libro.
   */
  @ManyToOne(() => Libro, libro => libro.prestamos)
  @JoinColumn({ name: 'libroId' })
  libro: Libro;

  /**
   * Reserva asociada al préstamo (opcional).
   * Relación muchos a uno con la entidad Reserva.
   */
  @ManyToOne(() => Reserva, { nullable: true })
  @JoinColumn({ name: 'reservaId' })
  reserva: Reserva;

  /**
   * Fecha en la que se realizó el préstamo.
   * Se establece por defecto como la fecha y hora actuales.
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaPrestamo: Date;

  /**
   * Fecha en la que se devolvió el libro (opcional).
   */
  @Column({ type: 'timestamp', nullable: true })
  fechaDevolucion: Date;

  /**
   * Indica si el préstamo ha sido marcado como eliminado.
   */
  @Column({ default: false })
  isDeleted: boolean;
}
