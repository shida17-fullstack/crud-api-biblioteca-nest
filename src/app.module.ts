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
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        const sslEnabled = configService.get<string>('SSL') === 'true';

        console.log('Entorno de ejecución:', configService.get<string>('NODE_ENV'));
        console.log('SSL Enabled:', sslEnabled);

        if (isProduction) {
          console.log('Conectando a la base de datos en producción');
          return {
            type: 'postgres',
            host: configService.get<string>('DATABASE_HOST'),
            port: configService.get<number>('DATABASE_PORT'), // Usar get<number> para el puerto
            username: configService.get<string>('DATABASE_USERNAME'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
            logging: true,
            ssl: sslEnabled
              ? { rejectUnauthorized: false }
              : false,
          };
        } else {
          console.log('Conectando a la base de datos en desarrollo');
          return {
            type: 'mysql',
            host: configService.get<string>('DATABASE_HOST', 'localhost'),
            port: configService.get<number>('DATABASE_PORT'), // Usar get<number> para el puerto
            username: configService.get<string>('DATABASE_USER', 'root'),
            password: configService.get<string>('DATABASE_PASSWORD', 'shida17'),
            database: configService.get<string>('DATABASE_NAME', 'biblioteca'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: true,
          };
        }
      },
    }),
    V1Module,
  ],
})
export class AppModule {}
