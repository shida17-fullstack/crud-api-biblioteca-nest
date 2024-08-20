// src/main.ts

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module'; // Importa el módulo principal de la aplicación
import * as dotenv from 'dotenv';

// Carga las variables de entorno desde un archivo .env
dotenv.config();

/**
 * Función principal para iniciar la aplicación Nest.js.
 *
 * Esta función configura y arranca la aplicación Nest.js, incluyendo la configuración
 * de Swagger para la documentación de la API.
 */
async function bootstrap() {
  // Imprime el valor de NODE_ENV para verificar su configuración
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Environment Variables:', process.env);


  // Crea una instancia de la aplicación Nest.js utilizando el módulo raíz AppModule
  const app = await NestFactory.create(AppModule);

  // Establece un prefijo global para todas las rutas en la aplicación
  // Esto significa que todas las rutas se verán precedidas por 'api/v1'
  app.setGlobalPrefix('api/v1');

  // Configura Swagger para la documentación de la API
  const config = new DocumentBuilder()
    .setTitle('Biblioteca API') // Título de la documentación
    .setDescription('API CRUD para la gestión de una biblioteca') // Descripción de la API
    .setVersion('1.0') // Versión de la API
    .addTag('biblioteca') // Etiqueta para agrupar endpoints relacionados
    .build();

  // Crea el documento Swagger a partir de la configuración
  const document = SwaggerModule.createDocument(app, config);

  // Configura el endpoint donde estará disponible la documentación Swagger
  SwaggerModule.setup('api/v1/api-docs', app, document); 

  // Configura el puerto en el que la aplicación escuchará las peticiones
  await app.listen(process.env.PORT || 3000);
}

// Llama a la función bootstrap para iniciar la aplicación
bootstrap();
