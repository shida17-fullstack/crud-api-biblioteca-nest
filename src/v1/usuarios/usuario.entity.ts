import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reserva } from '@reservas/reserva.entity';
import { Prestamo } from '@prestamos/prestamo.entity';
import { Direccion } from '@usuarios/interfaces/direccion.interface';

/**
 * Enum para representar los roles de los usuarios en el sistema.
 */
export enum Rol {
  BIBLIOTECARIO = 'BIBLIOTECARIO', // Personal biblioteca
  DIRECTOR = 'DIRECTOR', // Personal biblioteca
  AUXILIAR = 'AUXILIAR', // Personal biblioteca
  USUARIO = 'USUARIO',
}

@Entity()
export class Usuario {
  /**
   * Identificador único del usuario.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nombre del usuario.
   */
  @Column()
  nombre: string;

  /**
   * Nombre de usuario, opcional y único.
   */
  @Column({ unique: true, nullable: true })
  nombreUsuario?: string;

  /**
   * Correo electrónico del usuario, único.
   */
  @Column({ unique: true })
  email: string;

  /**
   * Contraseña del usuario.
   */
  @Column()
  password: string;

  /**
   * Edad del usuario.
   */
  @Column()
  edad: number;

  /**
   * Carrera o profesión del usuario.
   */
  @Column()
  carreraOProfesion: string;

  /**
   * Dirección del usuario, almacenada como JSON.
   */
  @Column('json')
  direccion: Direccion;

  /**
   * Indica si el usuario ha sido marcado como eliminado.
   */
  @Column({ default: false })
  isDeleted: boolean;

  /**
   * Rol del usuario en el sistema.
   * Valores posibles definidos en el enum Rol.
   */
  @Column({
    type: 'enum',
    enum: Rol,
    default: Rol.USUARIO,
  })
  rol: Rol;

  /**
   * Reservas asociadas al usuario.
   */
  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  reservas: Reserva[];

  /**
   * Préstamos asociados al usuario.
   */
  @OneToMany(() => Prestamo, (prestamo) => prestamo.usuario)
  prestamos: Prestamo[];
}
