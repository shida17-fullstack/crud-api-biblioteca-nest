import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

// Cargar el módulo de configuración para obtener las variables de entorno
ConfigModule.forRoot();

const configService = new ConfigService();
const isProduction = process.env.NODE_ENV === 'production';

const dataSource = new DataSource({
  type: 'mysql',
  host: isProduction
    ? configService.get<string>('DATABASE_HOST') || '10.54.128.2'  // IP privada de tu instancia Cloud SQL en producción
    : configService.get<string>('DATABASE_HOST') || 'localhost', // Host local para desarrollo
  port: parseInt(configService.get<string>('DATABASE_PORT'), 10) || 3306,
  username: configService.get<string>('DATABASE_USER') || 'root',
  password: configService.get<string>('DATABASE_PASSWORD') || 'shida17',
  database: configService.get<string>('DATABASE_NAME') || 'biblioteca',
  entities: [
    join(__dirname, '/../**/*.entity{.ts,.js}'), // Carga entidades de la ruta especificada
  ],
  synchronize: !isProduction, // Sincronizar solo en desarrollo
 
  logging: true,
  extra: {
    connectionLimit: 10, // Configura el límite de conexiones en el pool
  },
});

export default dataSource;
