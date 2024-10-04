import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from '@v1/v1.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const isProduction = process.env.NODE_ENV === 'production';
        const sslEnabled = process.env.SSL === 'true';

        console.log('Entorno de ejecución:', process.env.NODE_ENV);
        console.log('SSL Enabled:', sslEnabled);

        if (isProduction) {
          console.log('Conectando a la base de datos en producción');
          return {
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
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
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER || 'root',
            password: process.env.DATABASE_PASSWORD || 'shida17',
            database: process.env.DATABASE_NAME || 'biblioteca',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: true,
          };
        }
      },
      inject: [],
    }),
    V1Module,
  ],
})
export class AppModule {}
