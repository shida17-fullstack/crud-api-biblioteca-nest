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
import { Reserva } from '@reservas/reserva.entity'; // Ruta Absoluta

/**
 * Entidad que representa un préstamo de libro en la base de datos.
 */
@Entity()
export class Prestamo {
  /**
   * Identificador único del préstamo.
   */
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Identificador único del préstamo' }) // Swagger
  id: number;

  /**
   * Usuario asociado al préstamo.
   * Relación muchos a uno con la entidad Usuario.
   */
  @ManyToOne(() => Usuario, (usuario) => usuario.prestamos)
  @JoinColumn({ name: 'usuarioId' })
  @ApiProperty({ type: () => Usuario, description: 'Usuario asociado al préstamo' }) // Swagger
  usuario: Usuario;

  /**
   * Libro asociado al préstamo.
   * Relación muchos a uno con la entidad Libro.
   */
  @ManyToOne(() => Libro, (libro) => libro.prestamos)
  @JoinColumn({ name: 'libroId' })
  @ApiProperty({ type: () => Libro, description: 'Libro asociado al préstamo' }) // Swagger
  libro: Libro;

  /**
   * Reserva asociada al préstamo (opcional).
   * Relación muchos a uno con la entidad Reserva.
   */
  @ManyToOne(() => Reserva, { nullable: true })
  @JoinColumn({ name: 'reservaId' })
  @ApiProperty({ type: () => Reserva, description: 'Reserva asociada al préstamo (opcional)', nullable: true }) // Swagger
  reserva: Reserva;

  /**
   * Fecha en la que se realizó el préstamo.
   * Se establece por defecto como la fecha y hora actuales.
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'Fecha en la que se realizó el préstamo', type: 'string', format: 'date-time' }) // Swagger
  fechaPrestamo: Date;

  /**
   * Fecha en la que se devolvió el libro (opcional).
   */
  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'Fecha en la que se devolvió el libro (opcional)', type: 'string', format: 'date-time', nullable: true }) // Swagger
  fechaDevolucion: Date;

  /**
   * Indica si el préstamo ha sido marcado como eliminado.
   */
  @Column({ default: false })
  @ApiProperty({ description: 'Indica si el préstamo ha sido marcado como eliminado', default: false }) // Swagger
  isDeleted: boolean;
}
