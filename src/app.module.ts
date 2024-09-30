import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from '@v1/v1.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Asegura que las variables de entorno estén disponibles globalmente
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isProduction = process.env.NODE_ENV === 'production';

        if (isProduction) {
          console.log('Conectando a la base de datos en producción');
          return {
            type: 'postgres', // PostgreSQL para producción
            host: configService.get<string>('DATABASE_HOST') || 'dpg-crtgdd3v2p9s73ctjhq0-a',
            port: parseInt(configService.get<string>('DATABASE_PORT'), 10) || 5432,
            username: configService.get<string>('DATABASE_USER') || 'root',
            password: configService.get<string>('DATABASE_PASSWORD') || 'nWT4Aik6lxi3yEHb1RzG8zj2v6VtSWEL',
            database: configService.get<string>('DATABASE_NAME') || 'biblioteca_3kah',
            entities: [__dirname + '/**/*.entity{.ts,.js}'], // Archivos de entidades
            synchronize: false, // No sincronizar en producción
            logging: true,
          };
        } else {
          console.log('Conectando a la base de datos en desarrollo');
          return {
            type: 'mysql', // MySQL para desarrollo
            host: configService.get<string>('DATABASE_HOST') || 'localhost',
            port: parseInt(configService.get<string>('DATABASE_PORT'), 10) || 3306,
            username: configService.get<string>('DATABASE_USER') || 'root',
            password: configService.get<string>('DATABASE_PASSWORD') || 'shida17',
            database: configService.get<string>('DATABASE_NAME') || 'biblioteca',
            entities: [__dirname + '/**/*.entity{.ts,.js}'], // Archivos de entidades
            synchronize: true, // Sincronizar automáticamente en desarrollo
            logging: true,
          };
        }
      },
      inject: [ConfigService],
    }),
    V1Module, // Incluye otros módulos necesarios
  ],
})
export class AppModule {}
