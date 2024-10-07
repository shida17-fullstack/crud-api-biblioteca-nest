import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from '@v1/v1.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        try {
          const isProduction = process.env.NODE_ENV === 'production';
          const sslEnabled = process.env.SSL === 'true';

          console.log('Entorno de ejecución:', process.env.NODE_ENV);
          console.log('SSL Enabled:', sslEnabled);

          if (isProduction) {
            console.log('Conectando a la base de datos en producción');
            return {
              type: 'postgres',
              host: process.env.DATABASE_HOST,
              port: parseInt(process.env.DATABASE_PORT, 10), // Convertir puerto a número
              username: process.env.DATABASE_USERNAME,
              password: process.env.DATABASE_PASSWORD,
              database: process.env.DATABASE_NAME,
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: false,
              logging: true,
              ssl: sslEnabled
                ? { rejectUnauthorized: false }
                : false,
                connectTimeoutMS: 60000,  // 60 segundos para el timeout de conexión
                
              extra: {
                application_name: 'crud-api-biblioteca-nest', // Nombre de la aplicación
              },
            };
          } else {
            console.log('Conectando a la base de datos en desarrollo');
            return {
              type: 'mysql',
              host: process.env.DATABASE_HOST || 'localhost',
              port: parseInt(process.env.DATABASE_PORT, 10) || 3306, // Convertir puerto a número
              username: process.env.DATABASE_USER || 'root',
              password: process.env.DATABASE_PASSWORD || 'shida17',
              database: process.env.DATABASE_NAME || 'biblioteca',
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: true,
              logging: true,
            };
          }
        } catch (error) {
          // Captura y muestra el error
          console.error('Error al configurar la conexión a la base de datos:', error.message);
          console.error('Detalles completos del error:', error);
          throw new Error('No se pudo establecer la conexión con la base de datos.');
        }
      },
      inject: [],
    }),
    V1Module,
  ],
})
export class AppModule {}
