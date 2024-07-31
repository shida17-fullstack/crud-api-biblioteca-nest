// src/v1/v1.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosModule } from './libros/libros.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { ReservasModule } from './reservas/reservas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { Libro } from './libros/libro.entity';
import { Prestamo } from './prestamos/prestamo.entity';
import { Reserva } from './reservas/reserva.entity';
import { Usuario } from './usuarios/usuario.entity';

/**
 * Módulo principal para la versión 1 de la API.
 * 
 * Este módulo agrupa e importa los diferentes módulos de la aplicación relacionados con
 * la gestión de libros, préstamos, reservas y usuarios, así como las entidades
 * correspondientes utilizadas por TypeORM para la interacción con la base de datos.
 */
@Module({
  imports: [
    /**
     * Importa el módulo de TypeORM y configura las entidades que se utilizarán en la aplicación.
     * Esto permite a TypeORM gestionar las entidades y sus repositorios para realizar operaciones CRUD.
     */
    TypeOrmModule.forFeature([Libro, Prestamo, Reserva, Usuario]),

    /**
     * Importa el módulo para la gestión de libros.
     * Contiene las funcionalidades y controladores relacionados con los libros en la aplicación.
     */
    LibrosModule,

    /**
     * Importa el módulo para la gestión de préstamos.
     * Contiene las funcionalidades y controladores relacionados con los préstamos de libros.
     */
    PrestamosModule,

    /**
     * Importa el módulo para la gestión de reservas.
     * Contiene las funcionalidades y controladores relacionados con las reservas de libros.
     */
    ReservasModule,

    /**
     * Importa el módulo para la gestión de usuarios.
     * Contiene las funcionalidades y controladores relacionados con la gestión de usuarios en la aplicación.
     */
    UsuariosModule,
  ],
})
export class V1Module {}
