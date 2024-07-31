// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Función principal para iniciar la aplicación Nest.js.
 * 
 * Esta función configura y arranca la aplicación Nest.js. Establece el prefijo global para todas las rutas
 * y configura el puerto en el que la aplicación escuchará las peticiones entrantes.
 */
async function bootstrap() {
  // Crea una instancia de la aplicación Nest.js utilizando el módulo raíz AppModule
  const app = await NestFactory.create(AppModule);

  // Establece un prefijo global para todas las rutas en la aplicación
  // Esto significa que todas las rutas se verán precedidas por 'api/v1'
  app.setGlobalPrefix('api/v1'); // Establece el prefijo global

  // Configura el puerto en el que la aplicación escuchará las peticiones
  // En este caso, la aplicación escuchará en el puerto 3000
  await app.listen(3000);
}

// Llama a la función bootstrap para iniciar la aplicación
bootstrap();
