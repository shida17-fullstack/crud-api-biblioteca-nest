// src/v1/v1.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Use alias configurados en tsconfig.json para rutas absolutas
import { LibrosModule } from '@libros/libros.module'; // Ruta Absoluta
import { PrestamosModule } from '@prestamos/prestamos.module'; // Ruta Absoluta
import { ReservasModule } from '@reservas/reservas.module'; // Ruta Absoluta
import { UsuariosModule } from '@usuarios/usuarios.module'; // Ruta Absoluta
import { Libro } from '@libros/libro.entity'; // Ruta Absoluta
import { Prestamo } from '@prestamos/prestamo.entity'; // Ruta Absoluta
import { Reserva } from '@reservas/reserva.entity'; // Ruta Absoluta
import { Usuario } from '@usuarios/usuario.entity'; // Ruta Absoluta
import { RolesService } from '@roles/roles.service';
import { RolesController } from '@roles/roles.controller';
import { RolesModule } from '@roles/roles.module';
import { HealthModule } from '@health/health.module';

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

    /**
     * Importa el módulo para la gestión de roles.
     */
    RolesModule,

    /**
     * Importa el módulo para la ruta de salud.
     */
    HealthModule,
  ],
  providers: [RolesService],
  controllers: [RolesController],
})
export class V1Module {}
