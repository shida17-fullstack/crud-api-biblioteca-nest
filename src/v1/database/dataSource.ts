import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

// Cargar el módulo de configuración
ConfigModule.forRoot();

const configService = new ConfigService();
const isProduction = process.env.NODE_ENV === 'production';

const dataSource = new DataSource({
  type: 'mysql',
  // Cambiar a socket en lugar de IP
  socketPath: `/cloudsql/${configService.get<string>('CLOUD_SQL_CONNECTION_NAME')}`, // Nombre de conexión de la instancia
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
