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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // Sincronización automática solo en entorno de desarrollo
        synchronize: configService.get<string>('NODE_ENV') === 'development' ? true : false,
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
