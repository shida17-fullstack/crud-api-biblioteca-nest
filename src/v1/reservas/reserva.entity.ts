import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Libro } from '../libros/libro.entity';
import { Prestamo } from '../prestamos/prestamo.entity';

/**
 * Representa una reserva en la base de datos.
 */
@Entity()
export class Reserva {

  /**
   * Identificador único de la reserva.
   * Este campo es la clave primaria y se genera automáticamente.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Usuario que realizó la reserva.
   * Relación de muchos a uno con la entidad Usuario.
   * Cada reserva pertenece a un único usuario, pero un usuario puede tener múltiples reservas.
   */
  @ManyToOne(() => Usuario, (usuario) => usuario.reservas)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  /**
   * Libro que ha sido reservado.
   * Relación de muchos a uno con la entidad Libro.
   * Cada reserva está asociada a un único libro, pero un libro puede tener múltiples reservas.
   */
  @ManyToOne(() => Libro, (libro) => libro.reservas)
  @JoinColumn({ name: 'libroId' })
  libro: Libro;

  /**
   * Fecha en que se realizó la reserva.
   * Este campo almacena la fecha y hora en que se creó la reserva.
   */
  @Column()
  fechaReserva: Date;

  /**
   * Fecha en que se notificó al usuario sobre la reserva.
   * Este campo es opcional y puede ser nulo.
   * Indica cuándo se informó al usuario de que su reserva está lista o confirmada.
   */
  @Column({ nullable: true })
  fechaNotificacion: Date;

  /**
   * Indica si la reserva está eliminada.
   * Este campo es un marcador lógico que permite el borrado suave (soft delete) de la reserva sin eliminarla físicamente de la base de datos.
   */
  @Column({ default: false })
  isDeleted: boolean;

  /**
   * Préstamo asociado a la reserva.
   * Relación de muchos a uno con la entidad Prestamo.
   * Este campo es opcional y puede ser nulo.
   * Vincula una reserva con un préstamo específico cuando la reserva se convierte en un préstamo.
   */
  @ManyToOne(() => Prestamo, prestamo => prestamo.reserva, { nullable: true })
  @JoinColumn({ name: 'prestamoId' })
  prestamo: Prestamo;
}
