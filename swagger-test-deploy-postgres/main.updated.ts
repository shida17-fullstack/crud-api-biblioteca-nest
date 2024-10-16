import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

/**
 * @description Carga las variables de entorno desde el archivo `.env`.
 * Esto permite acceder a las configuraciones de ambiente, como el puerto o
 * claves de API, evitando que estén hardcodeadas en el código fuente.
 */
dotenv.config();

/**
 * @function bootstrap
 * Función principal que inicia la aplicación Nest.js.
 * 
 * - Carga las variables de entorno.
 * - Configura el prefijo global para las rutas.
 * - Configura la documentación Swagger para la API.
 * 
 * @returns {Promise<void>} Una promesa que resuelve cuando la aplicación comienza a escuchar.
 */
async function bootstrap() {
  // Imprime el entorno de ejecución (desarrollo, producción, etc.).
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Imprime todas las variables de entorno cargadas para depuración.
  console.log('Environment Variables:', process.env);

  /**
   * @description Crea una instancia de la aplicación utilizando el módulo raíz `AppModule`.
   * Esta aplicación es el núcleo del sistema y gestiona el ciclo de vida de los módulos.
   */
  const app = await NestFactory.create(AppModule);

  /**
   * @description Establece un prefijo global para todas las rutas de la API.
   * En este caso, todas las rutas estarán precedidas por `/api/v1`.
   * Esto ayuda a versionar la API fácilmente.
   */
  app.setGlobalPrefix('api/v1');

  /**
   * @description Configura la documentación Swagger para la API.
   * Swagger genera automáticamente una interfaz gráfica que permite a los
   * desarrolladores probar los endpoints de la API directamente desde el navegador.
   */
  const config = new DocumentBuilder()
    .setTitle('Biblioteca API') // Título de la API en la interfaz Swagger.
    .setDescription('API CRUD para la gestión de una biblioteca') // Descripción del propósito de la API.
    .setVersion('1.0') // Versión de la API.
    .addTag('biblioteca') // Agrega una etiqueta para categorizar los endpoints en Swagger.
    .build();

  /**
   * @description Crea un documento Swagger basado en la configuración anterior y los
   * controladores de la aplicación. Este documento se usará para la visualización en Swagger UI.
   */
  const document = SwaggerModule.createDocument(app, config);

  /**
   * @description Configura el acceso a la documentación Swagger en `/api/v1/api-docs`.
   * Los desarrolladores podrán acceder a esta URL para visualizar y probar la API.
   */
  SwaggerModule.setup('api/v1/api-docs', app, document);

  /**
   * @description Establece el puerto en el que la aplicación escuchará las solicitudes.
   * Si no se define el puerto en las variables de entorno, se utiliza el puerto 3000 por defecto.
   */
  const port = parseInt(process.env.PORT, 10) || 3000;
  
  // Inicia la aplicación y la hace escuchar en el puerto especificado.
  await app.listen(port);

  // Confirma en la consola que la aplicación está corriendo y en qué puerto.
  console.log(`Aplicación escuchando en el puerto ${port}`);
}

// Arranca la aplicación llamando a la función `bootstrap`.
bootstrap();
