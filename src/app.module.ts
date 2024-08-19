import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from '@v1/v1.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Módulo principal de la aplicación.
 *
 * Este módulo configura la conexión con la base de datos y organiza los módulos de la aplicación.
 *
 * @module AppModule
 */
@Module({
  imports: [
    // Configura ConfigModule para que cargue las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la aplicación sin necesidad de importarlo nuevamente
    }),
    
    // Configura el módulo de TypeORM para la conexión a la base de datos usando ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get<string>('DATABASE_URL'), // Usa la variable de entorno DATABASE_URL
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') === 'development', // Solo sincronizar en desarrollo
      }),
      inject: [ConfigService],
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
