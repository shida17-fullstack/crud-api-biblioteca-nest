import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from '@v1/v1.module'; // Importamos el módulo principal de la versión 1

/**
 * @module AppModule
 * @description Módulo principal de la aplicación. Configura la conexión a la base de datos
 * y las importaciones necesarias para la ejecución de la aplicación.
 * 
 * @version 1.0
 * @since 2024
 * 
 * @author shida17
 * @license MD
 */
const logger = new Logger('AppModule'); // Inicializamos el logger para registrar mensajes importantes durante la ejecución del módulo

@Module({
  imports: [
    /**
     * Configuración de TypeORM para conexión a la base de datos de forma asíncrona.
     * Esto permite utilizar diferentes configuraciones dependiendo del entorno (producción/desarrollo).
     * @function TypeOrmModule.forRootAsync
     * @returns {Promise<TypeOrmModule>} Configuración dinámica basada en el entorno de ejecución.
     */
    TypeOrmModule.forRootAsync({
      /**
       * @function useFactory
       * @description Configura la conexión a la base de datos dependiendo del entorno de ejecución.
       * Determina si se está ejecutando en modo de desarrollo o producción y ajusta los parámetros.
       * 
       * @returns {Promise<TypeOrmModule>} Las opciones de configuración de TypeORM.
       * @throws {Error} Si la conexión con la base de datos falla.
       */
      useFactory: async () => {
        try {
          // Determina si el entorno es de producción.
          const isProduction = process.env.NODE_ENV === 'production';
          // Verifica si SSL está habilitado mediante las variables de entorno.
          const sslEnabled = process.env.SSL === 'true';

          // Registra el entorno de ejecución y la configuración de SSL.
          logger.log('Entorno de ejecución: ' + process.env.NODE_ENV);
          logger.log('SSL Enabled: ' + sslEnabled);

          if (isProduction) {
            /**
             * @description Configuración para producción utilizando PostgreSQL.
             * Incluye detalles como el uso de SSL y la conexión al servidor de base de datos remoto.
             */
            logger.log('Conectando a la base de datos en producción');
            return {
              type: 'postgres', // Tipo de base de datos (PostgreSQL en producción)
              host: process.env.DATABASE_HOST, // Dirección del host de la base de datos
              port: parseInt(process.env.DATABASE_PORT, 10), // Convertimos el puerto a número
              username: process.env.DATABASE_USERNAME, // Usuario de la base de datos
              password: process.env.DATABASE_PASSWORD, // Contraseña de la base de datos
              database: process.env.DATABASE_NAME, // Nombre de la base de datos
              entities: [__dirname + '/**/*.entity{.ts,.js}'], // Ruta de las entidades de TypeORM
              synchronize: false, // Sincronización desactivada en producción
              logging: true, // Registro de consultas activado
              ssl: sslEnabled
                ? { rejectUnauthorized: false } // Configuración de SSL si está habilitado
                : false, // No usar SSL si no está habilitado
              connectTimeoutMS: 60000, // Tiempo de espera de conexión (60 segundos)
              extra: {
                application_name: 'crud-api-biblioteca-nest', // Nombre de la aplicación
              },
            };
          } else {
            /**
             * @description Configuración para desarrollo utilizando MySQL.
             * Permite conexiones locales y habilita la sincronización automática de entidades.
             */
            logger.log('Conectando a la base de datos en desarrollo');
            return {
              type: 'mysql', // Tipo de base de datos (MySQL en desarrollo)
              host: process.env.DATABASE_HOST || 'localhost', // Host o localhost por defecto
              port: parseInt(process.env.DATABASE_PORT, 10) || 3306, // Puerto 3306 por defecto para MySQL
              username: process.env.DATABASE_USER || 'root', // Usuario de la base de datos o 'root'
              password: process.env.DATABASE_PASSWORD || 'shida17', // Contraseña de la base de datos o por defecto
              database: process.env.DATABASE_NAME || 'biblioteca', // Nombre de la base de datos
              entities: [__dirname + '/**/*.entity{.ts,.js}'], // Ruta de las entidades
              synchronize: true, // Sincronización activada en desarrollo
              logging: true, // Registro de consultas activado
            };
          }
        } catch (error) {
          // Captura y manejo de errores durante la configuración de la base de datos.
          logger.error('Error al configurar la conexión a la base de datos:', error.stack);
          throw new Error('No se pudo establecer la conexión con la base de datos.'); // Lanzar un error si la conexión falla.
        }
      },
      inject: [], // No se inyectan dependencias adicionales
    }),
    
    /**
     * Importa el módulo principal de la versión 1 de la API.
     * 
     * V1Module agrupa todos los módulos relacionados con la versión 1 de la API, incluyendo
     * la gestión de libros, préstamos, reservas y usuarios. Este módulo centraliza las
     * operaciones principales de la biblioteca.
     */
    V1Module, // Importamos el módulo principal de la aplicación
  ],
})
export class AppModule {}
