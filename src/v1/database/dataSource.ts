import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

// Cargar el módulo de configuración
ConfigModule.forRoot();

const configService = new ConfigService();
const isProduction = process.env.NODE_ENV === 'production';

const dataSource = new DataSource({
  type: 'mysql',
  host: configService.get<string>('DATABASE_HOST') || '10.54.128.2',  // IP privada
  port: parseInt(configService.get<string>('DATABASE_PORT'), 10) || 3306,
  username: configService.get<string>('DATABASE_USER') || 'root',
  password: configService.get<string>('DATABASE_PASSWORD') || 'shida17',
  database: configService.get<string>('DATABASE_NAME') || 'biblioteca',
  entities: [
    join(__dirname, '/../**/*.entity{.ts,.js}'), // Ruta de entidades
  ],
  synchronize: !isProduction, // Sincroniza solo en desarrollo
  logging: true,  // Habilita logging en producción
  extra: {
    connectionLimit: 10,  // Límite de conexiones
  },
});

// Captura errores de conexión
dataSource.initialize()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

export default dataSource;
