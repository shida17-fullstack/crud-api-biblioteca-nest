import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

/**
 * @description Carga variables de entorno y arranca la aplicación Nest.js.
 * @function bootstrap
 */
dotenv.config();

/**
 * @function bootstrap
 * Función principal para iniciar la aplicación.
 * Carga las variables de entorno y configura Swagger para la documentación.
 */
async function bootstrap() {
  // Imprime el entorno de ejecución y variables cargadas.
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Environment Variables:', process.env);

  // Crea la aplicación Nest.js.
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas.
  app.setGlobalPrefix('api/v1');

  /**
   * Configura Swagger.
   * @swagger
   */
  const config = new DocumentBuilder()
    .setTitle('Biblioteca API')
    .setDescription('API CRUD para la gestión de una biblioteca')
    .setVersion('1.0')
    .addTag('biblioteca')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Punto de acceso a la documentación Swagger.
  SwaggerModule.setup('api/v1/api-docs', app, document);

  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port);

  console.log(`Aplicación escuchando en el puerto ${port}`);
}

// Arranca la aplicación.
bootstrap();
