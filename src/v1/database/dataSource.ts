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
    ? `/cloudsql/${configService.get<string>('CLOUD_SQL_CONNECTION_NAME')}`
    : configService.get<string>('DATABASE_HOST') || 'localhost',
  port: parseInt(configService.get<string>('DATABASE_PORT'), 10) || 3306,
  username: configService.get<string>('DATABASE_USER') || 'root',
  password: configService.get<string>('DATABASE_PASSWORD') || 'shida17',
  database: configService.get<string>('DATABASE_NAME') || 'biblioteca',
  entities: [
    join(__dirname, '/../**/*.entity{.ts,.js}'), // Carga entidades de la ruta especificada
  ],
  synchronize: !isProduction, // Sincronizar solo en desarrollo
  migrationsRun: false, // No ejecutar migraciones automáticamente
  migrations: isProduction
    ? [join(__dirname, '/../../migrations/*{.js}')] // Ruta a las migraciones compiladas en producción
    : [join(__dirname, '/../../migrations/*{.ts,.js}')] // Ruta a las migraciones en desarrollo
  ,
  logging: true,
  extra: {
    connectionLimit: 10, // Configura el límite de conexiones en el pool
  },
});

export default dataSource;
