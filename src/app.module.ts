import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from '@v1/v1.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => {
        const isProduction = process.env.NODE_ENV === 'production';

        if (isProduction) {
          console.log('Conectando a la base de datos en producción');
          return {
            type: 'mysql',
            host: `/cloudsql/${configService.get<string>('CLOUD_SQL_CONNECTION_NAME')}`, // Conexión mediante socket Unix
            port: parseInt(configService.get<string>('DATABASE_PORT'), 10) || 3306,
            username: configService.get<string>('DATABASE_USER'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME'),
            entities: [__dirname + '/**/*.entity{.js}'], // Solo archivos .js en producción
            synchronize: false, // No sincronizar automáticamente en producción
            migrationsRun: false, // No ejecutar migraciones automáticamente en producción
            logging: true,
            migrations: [__dirname + '/../dist/src/v1/migrations/*{.js}'], // Ruta a las migraciones compiladas en dist
            extra: {
              connectionLimit: 10, // Configura el límite de conexiones en el pool
            },
          };
        } else {
          console.log('Conectando a la base de datos en desarrollo');
          return {
            type: 'mysql',
            host: configService.get<string>('DATABASE_HOST') || 'localhost',
            port: parseInt(configService.get<string>('DATABASE_PORT'), 10) || 3306,
            username: configService.get<string>('DATABASE_USER') || 'root',
            password: configService.get<string>('DATABASE_PASSWORD') || 'shida17',
            database: configService.get<string>('DATABASE_NAME') || 'biblioteca',
            entities: [__dirname + '/**/*.entity{.ts,.js}'], // Archivos .ts y .js en desarrollo
            synchronize: true, // Sincronizar automáticamente en desarrollo
            migrations: [__dirname + '/../src/v1/migrations/*{.ts,.js}'], // Ruta a las migraciones en src
            extra: {
              connectionLimit: 10, // Configura el límite de conexiones en el pool también para desarrollo
            },
          };
        }
      },
      inject: [ConfigService],
    }),
    V1Module, // Incluye tus módulos adicionales
  ],
})
export class AppModule {}
