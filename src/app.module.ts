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

        console.log('Entorno de ejecución:', process.env.NODE_ENV);
        console.log('SSL Enabled:', sslEnabled);

        if (isProduction) {
          console.log('Conectando a la base de datos en producción');
          return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST'),
            port: parseInt(configService.get('DATABASE_PORT', 10)),
            username: configService.get('DATABASE_USERNAME'),
            password: configService.get('DATABASE_PASSWORD'),
            database: configService.get('DATABASE_NAME'),
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
            host: configService.get('DATABASE_HOST', 'localhost'),
            port: parseInt(configService.get('DATABASE_PORT', 10)) || 3306,
            username: configService.get('DATABASE_USER', 'root'),
            password: configService.get('DATABASE_PASSWORD', 'shida17'),
            database: configService.get('DATABASE_NAME', 'biblioteca'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
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

