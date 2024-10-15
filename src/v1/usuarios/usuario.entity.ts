import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty
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
  @ApiProperty({ description: 'Identificador único del usuario.' }) // Decorador Swagger
  id: number;

  /**
   * Nombre del usuario.
   */
  @Column()
  @ApiProperty({ description: 'Nombre del usuario.' }) // Decorador Swagger
  nombre: string;

  /**
   * Nombre de usuario, opcional y único.
   */
  @Column({ unique: true, nullable: true })
  @ApiProperty({ description: 'Nombre de usuario, opcional y único.' }) // Decorador Swagger
  nombreUsuario?: string;

  /**
   * Correo electrónico del usuario, único.
   */
  @Column({ unique: true })
  @ApiProperty({ description: 'Correo electrónico del usuario, único.' }) // Decorador Swagger
  email: string;

  /**
   * Contraseña del usuario.
   */
  @Column()
  @ApiProperty({ description: 'Contraseña del usuario.' }) // Decorador Swagger
  password: string;

  /**
   * Edad del usuario.
   */
  @Column()
  @ApiProperty({ description: 'Edad del usuario.' }) // Decorador Swagger
  edad: number;

  /**
   * Carrera o profesión del usuario.
   */
  @Column()
  @ApiProperty({ description: 'Carrera o profesión del usuario.' }) // Decorador Swagger
  carreraOProfesion: string;

  /**
   * Dirección del usuario, almacenada como JSON.
   */
  @Column('json')
  @ApiProperty({ description: 'Dirección del usuario, almacenada como JSON.' }) // Decorador Swagger
  direccion: Direccion;

  /**
   * Indica si el usuario ha sido marcado como eliminado.
   */
  @Column({ default: false })
  @ApiProperty({ description: 'Indica si el usuario ha sido marcado como eliminado.' }) // Decorador Swagger
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
  @ApiProperty({
    description: 'Rol del usuario en el sistema.',
    enum: Rol,
    default: Rol.USUARIO,
  }) // Decorador Swagger
  rol: Rol;

  /**
   * Reservas asociadas al usuario.
   */
  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  @ApiProperty({ type: () => Reserva, isArray: true, description: 'Reservas asociadas al usuario.' }) // Decorador Swagger
  reservas: Reserva[];

  /**
   * Préstamos asociados al usuario.
   */
  @OneToMany(() => Prestamo, (prestamo) => prestamo.usuario)
  @ApiProperty({ type: () => Prestamo, isArray: true, description: 'Préstamos asociados al usuario.' }) // Decorador Swagger
  prestamos: Prestamo[];
}
