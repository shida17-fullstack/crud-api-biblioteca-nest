import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reserva } from '../reservas/reserva.entity';
import { Prestamo } from '../prestamos/prestamo.entity';

/**
 * Interfaz que define la estructura de la dirección.
 */
interface Direccion {
  calle: string;
  numero: string;
  ciudad: string;
  provincia: string;
  pais: string;
}

/**
 * Entidad que representa un usuario en la base de datos.
 */
@Entity()
export class Usuario {
  /**
   * Identificador único del usuario.
   * 
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nombre del usuario.
   * 
   * @type {string}
   */
  @Column()
  nombre: string;

  /**
   * Nombre de usuario (username) del usuario.
   * 
   * @type {string}
   * @optional
   */
  @Column({ unique: true, nullable: true })
  nombreUsuario?: string;

  /**
   * Correo electrónico del usuario.
   * 
   * @type {string}
   */
  @Column({ unique: true })
  email: string;

  /**
   * Contraseña del usuario.
   * 
   * @type {string}
   * @optional
   */
  @Column({ nullable: true })
  password?: string;

  /**
   * Edad del usuario.
   * 
   * @type {number}
   */
  @Column()
  edad: number;

  /**
   * Carrera o profesión del usuario.
   * 
   * @type {string}
   */
  @Column()
  carreraOProfesion: string;

  /**
   * Dirección del usuario, almacenada como objeto JSON.
   * 
   * @type {Direccion}
   */
  @Column('json')
  direccion: Direccion;

  /**
   * Indica si el usuario ha sido eliminado (soft delete).
   * 
   * @type {boolean}
   * @default false
   */
  @Column({ default: false })
  isDeleted: boolean;

  /**
   * Rol o roles del usuario (para control de acceso).
   * 
   * @type {string[]}
   * @optional
   */
  @Column('simple-array', { nullable: true })
  roles?: string[];

  /**
   * Lista de reservas asociadas al usuario.
   * 
   * @type {Reserva[]}
   */
  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  reservas: Reserva[];

  /**
   * Lista de préstamos asociados al usuario.
   * 
   * @type {Prestamo[]}
   */
  @OneToMany(() => Prestamo, (prestamo) => prestamo.usuario)
  prestamos: Prestamo[];
}
