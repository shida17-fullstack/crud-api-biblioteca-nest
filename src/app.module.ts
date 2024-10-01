import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from '@v1/v1.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isProduction = process.env.NODE_ENV === 'production';
        const sslEnabled = process.env.SSL === 'true';

        if (isProduction) {
          console.log('Conectando a la base de datos en producción');
          return {
            type: 'postgres',
            host: process.env.DATABASE_HOST || 'dpg-crtgdd3v2p9s73ctjhq0-a.oregon-postgres.render.com',
            port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
            username: process.env.DATABASE_USERNAME || 'root',
            password: process.env.DATABASE_PASSWORD || 'nWT4Aik6lxi3yEHb1RzG8zj2v6VtSWEL',
            database: process.env.DATABASE_NAME || 'biblioteca_3kah',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false, // No sincronizar en producción
            logging: true,
            ssl: sslEnabled
              ? { rejectUnauthorized: false } // SSL activado con verificación deshabilitada
              : false, // No usar SSL si no está habilitado
          };
        } else {
          console.log('Conectando a la base de datos en desarrollo');
          return {
            type: 'mysql',
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
            username: process.env.DATABASE_USER || 'root',
            password: process.env.DATABASE_PASSWORD || 'shida17',
            database: process.env.DATABASE_NAME || 'biblioteca',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // Sincronización automática en desarrollo
            logging: true,
          };
        }
      },
      inject: [ConfigService],
    }),
    V1Module,
  ],
})
export class AppModule {}
