import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Importar ApiProperty
import { Usuario } from '@usuarios/usuario.entity'; // Ruta Absoluta
import { Libro } from '@libros/libro.entity'; // Ruta Absoluta
import { Prestamo } from '@prestamos/prestamo.entity'; // Ruta Absoluta

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
  @ApiProperty({ description: 'Identificador único de la reserva' }) // Swagger
  id: number;

  /**
   * Usuario que realizó la reserva.
   * Relación de muchos a uno con la entidad Usuario.
   * Cada reserva pertenece a un único usuario, pero un usuario puede tener múltiples reservas.
   */
  @ManyToOne(() => Usuario, (usuario) => usuario.reservas)
  @JoinColumn({ name: 'usuarioId' })
  @ApiProperty({ description: 'Usuario que realizó la reserva', type: () => Usuario }) // Swagger
  usuario: Usuario;

  /**
   * Libro que ha sido reservado.
   * Relación de muchos a uno con la entidad Libro.
   * Cada reserva está asociada a un único libro, pero un libro puede tener múltiples reservas.
   */
  @ManyToOne(() => Libro, (libro) => libro.reservas)
  @JoinColumn({ name: 'libroId' })
  @ApiProperty({ description: 'Libro que ha sido reservado', type: () => Libro }) // Swagger
  libro: Libro;

  /**
   * Fecha en que se realizó la reserva.
   * Este campo almacena la fecha y hora en que se creó la reserva.
   */
  @Column()
  @ApiProperty({ description: 'Fecha en que se realizó la reserva', type: 'string', format: 'date-time' }) // Swagger
  fechaReserva: Date;

  /**
   * Fecha en que se notificó al usuario sobre la reserva.
   * Este campo es opcional y puede ser nulo.
   * Indica cuándo se informó al usuario de que su reserva está lista o confirmada.
   */
  @Column({ nullable: true })
  @ApiProperty({ description: 'Fecha en que se notificó al usuario sobre la reserva', type: 'string', format: 'date-time', nullable: true }) // Swagger
  fechaNotificacion: Date;

  /**
   * Indica si la reserva ha sido marcada como eliminada.
   * Este campo es un booleano que, por defecto, es falso (`false`), indicando que la reserva está activa.
   */
  @Column({ default: false })
  @ApiProperty({ description: 'Indica si la reserva ha sido marcada como eliminada', default: false }) // Swagger
  isDeleted: boolean;

  /**
   * Préstamo asociado a la reserva.
   * Relación de muchos a uno con la entidad Prestamo.
   * Este campo es opcional y puede ser nulo.
   * Vincula una reserva con un préstamo específico cuando la reserva se convierte en un préstamo.
   */
  @ManyToOne(() => Prestamo, (prestamo) => prestamo.reserva, { nullable: true })
  @JoinColumn({ name: 'prestamoId' })
  @ApiProperty({ description: 'Préstamo asociado a la reserva (opcional)', type: () => Prestamo, nullable: true }) // Swagger
  prestamo: Prestamo;
}
