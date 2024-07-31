// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from './v1/v1.module';

/**
 * Módulo principal de la aplicación.
 * 
 * Este módulo configura la conexión con la base de datos y organiza los módulos de la aplicación.
 * 
 * @module AppModule
 */
@Module({
  imports: [
    /**
     * Configura el módulo de TypeORM para la conexión a la base de datos.
     * 
     * @param {Object} options - Opciones de configuración para la conexión con la base de datos.
     * @param {string} options.type - El tipo de base de datos (en este caso, 'mysql').
     * @param {string} options.host - El host de la base de datos (en este caso, 'localhost').
     * @param {number} options.port - El puerto de la base de datos (en este caso, 3306).
     * @param {string} options.username - El nombre de usuario para la conexión a la base de datos.
     * @param {string} options.password - La contraseña para la conexión a la base de datos.
     * @param {string} options.database - El nombre de la base de datos.
     * @param {string[]} options.entities - Patrón para encontrar las entidades de TypeORM.
     * @param {boolean} options.synchronize - Si se debe sincronizar automáticamente la base de datos con las entidades (true para desarrollo).
     */
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'shida17',
      database: 'biblioteca',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    /**
     * Importa el módulo principal de la versión 1 de la API.
     * 
     * V1Module agrupa todos los módulos relacionados con la versión 1 de la API, incluyendo la gestión
     * de libros, préstamos, reservas y usuarios.
     */
    V1Module, // Agrega V1Module a la lista de imports
  ],
})
export class AppModule {}
