<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>



## Documentación de Codigo de CRUD API Biblioteca

Este repositorio, ubicado en la rama `master` del proyecto **crud-api-biblioteca-nest**, está dedicado a documentar el codigo de algunos de los archivos clave de la aplicación CRUD API desarrollada con **Nest.js**. La aplicación fue originalmente conectada a **MySQL** y posteriormente desplegada en **Render** utilizando **PostgreSQL**.

El propósito principal de este repositorio es proporcionar una **documentación exhaustiva del código** de la aplicación, con un enfoque en:

- Detallar el proceso de desarrollo.
- Resaltar las mejores prácticas implementadas.
- Documentar el despliegue de la aplicación.

La **documentación** ha sido integrada con **Swagger**, permitiendo a los desarrolladores explorar y probar los endpoints de la API directamente desde un navegador. Esto facilita la comprensión de la estructura de la API y mejora la experiencia del usuario al interactuar con ella.

Además, se ha utilizado **JSDoc** para comentar y explicar cada componente del código, asegurando una **mejora continua** en la documentación y facilitando su comprensión y mantenimiento a largo plazo.




## Estructura del Proyecto

El repositorio está organizado en dos carpetas principales que documentan el codigo de archivos  tanto en la fase de desarrollo como en el despliegue con PostgreSQL. Cada archivo está documentado para proporcionar claridad sobre su función dentro del proyecto.

### Organizacion de carpetas Rama Master

```bash

crud-api-biblioteca-nest
├── nest-mysql-typeorm
│   ├── app.module.ts
│   └── app.module.updated.ts
├── swagger-test-deploy-postgres
│   ├── app.module.updated.ts
│   ├── app.module.ts
│   ├── libros.controller.spec.ts
│   ├── libros.controller.updated.spec.ts
│   ├── main.ts
│   └── main.updated.ts

```

### Carpeta de Desarrollo con MySQL

**Ubicación:** [`nest-mysql-typeorm`](https://github.com/shida17-fullstack/crud-api-biblioteca-nest/tree/master/nest-mysql-typeorm)

#### Archivos:

- **app.module.ts:** Archivo documentado que contiene la configuración inicial del módulo principal de Nest.js, conectando con MySQL.
  
- **app.module.updated.ts:** Versión actualizada del archivo app module con comentarios adicionales y más etiquetas JSDoc, mejorando la documentación del módulo y las entidades.

### Carpeta de Despliegue en Render con PostgreSQL

**Ubicación:** [swagger-test-deploy-postgres](https://github.com/shida17-fullstack/crud-api-biblioteca-nest/tree/master/swagger-test-deploy-postgres)


#### Archivos:

- **app.module.ts:** Documentacion del codigo de configuración adaptada para el despliegue en PostgreSQL, incluyendo la conexión a la base de datos y la definición de las entidades.
  
- **app.module.updated.ts:** Versión mejorada de app module con documentación ampliada y etiquetas JavaScript que reflejan las funcionalidades y el flujo de la aplicación.

- **libros.controller.spec.ts:** Documentacion del codigo del Test inicial del controlador de libros, diseñado para validar la correcta implementación de los endpoints.

- **libros.controller.updated.spec.ts:** Documentacion del codigo del Test actualizado con más cobertura y comentarios detallados, asegurando que todos los casos de uso relevantes estén cubiertos.

- **main.ts:** Documentacion del codigo del Archivo principal de inicio de la aplicación en PostgreSQL, donde se configuran aspectos clave de la API, incluyendo el uso de Swagger para la documentación.

- **main.updated.ts:** Versión actualizada de la documentacion del codigo de main con mejoras en la inicialización de la API y la configuración de Swagger, proporcionando una interfaz visual para interactuar con los endpoints de la API.

## Glosario de Códigos

### Módulo y Decoradores
- `@module`: Define un módulo en JavaScript o TypeScript.
- `@description`: Proporciona una descripción del módulo, clase o función.
- `@version`: Indica la versión del módulo o aplicación.
- `@since`: Especifica la fecha de creación o modificación.
- `@author`: Define el autor del módulo o código.
- `@license`: Especifica el tipo de licencia del código.

### Funciones y Tipos de Datos
- `@function`: Denota una función, su descripción y tipo de retorno.
- `@returns`: Indica el valor que devuelve una función.
- `@throws`: Describe las excepciones que una función puede lanzar.
- `@constant`: Define una constante y su descripción.
- `@type`: Especifica el tipo de una variable o propiedad.

### Controladores y Servicios
- `LibrosController`: Controlador que gestiona las operaciones relacionadas con libros.
- `LibrosService`: Servicio que proporciona la lógica de negocio para la gestión de libros.
- `CreateLibroDTO`: Data Transfer Object para la creación de un libro.
- `UpdateLibroDTO`: Data Transfer Object para la actualización de un libro.
- `Libro`: Entidad que representa un libro en la aplicación.
- `NotFoundException`: Excepción lanzada cuando un recurso no se encuentra.
- `JwtPayload`: Interfaz que define la estructura del payload de un JWT.

### Testing
- `@class`: Indica que el bloque de código representa una clase.
- `describe`: Método de Jest que agrupa pruebas relacionadas.
- `it`: Método de Jest que define una prueba específica.
- `beforeEach`: Función que se ejecuta antes de cada prueba en un bloque `describe`.
- `jest.fn()`: Método de Jest que crea una función simulada para pruebas.

### Otros
- `logger`: Instancia de Logger utilizada para registrar mensajes en la consola.
- `process.env`: Objeto que proporciona acceso a las variables de entorno.
- `async/await`: Sintaxis para trabajar con promesas de manera más sencilla.



## Comandos aplicables en la rama **swagger-test-deployment**

Estos comandos se pueden ejecutar dentro de la rama [`swagger-test-deployment`](https://github.com/shida17-fullstack/crud-api-biblioteca-nest/tree/swagger-test-deployment), donde la API para la gestión de una biblioteca, desarrollada en Nest.js y conectada inicialmente a **MySQL** en desarrollo y luego desplegada en **Render** con **PostgreSQL**, está completamente documentada y lista para pruebas y despliegue con **Swagger**.

Esta **API CRUD** automatiza los procesos clave de una biblioteca, como la autenticación de usuarios, la gestión del catálogo de libros, la creación y seguimiento de préstamos y reservas, y la asignación de roles. Gracias a este sistema, se garantiza una gestión más eficiente y segura de las operaciones diarias de la biblioteca.

El sistema de **roles** permite definir diferentes **niveles de acceso y permisos** para los usuarios, asegurando que cada uno pueda interactuar con el sistema de acuerdo con sus responsabilidades. Esto optimiza el flujo de trabajo, minimiza errores y facilita la interacción entre los usuarios y el sistema. Además, al estar completamente documentada con Swagger, la API está lista para ser probada y desplegada de manera eficiente.

# Organigrama del Proyecto CRUD API Biblioteca Nest Rama swagger-test-deployment


```bash

crud-api-biblioteca-nest
├── .env
├── .env.example
├── .eslintrc.js
├── .gitignore
├── .node-version
├── .nvmrc
├── .prettierrc
├── build.log
├── jest.config.js
├── nest-cli.json
├── package-lock.json
├── package.json
├── LICENSE.md
├── tsconfig.build.json
├── tsconfig.build.tsbuildinfo
└── tsconfig.json
├── src
│   ├── app.module.ts
│   ├── main.ts
│   ├── types
│   │   └── express.d.ts
│   └── v1
│       ├── auth
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── jwt-auth.guard.ts
│       │   ├── jwt-payload.interface.ts
│       │   ├── jwt.strategy.ts
│       │   ├── local-auth.guard.ts
│       │   └── local.strategy.ts
│       ├── health
│       │   ├── health.controller.ts
│       │   ├── health.module.ts
│       │   └── health.service.ts
│       ├── libros
│       │   ├── dto
│       │   │   ├── create-libro.dto.ts
│       │   │   └── update-libro.dto.ts
│       │   ├── libro.entity.ts
│       │   ├── libros.controller.ts
│       │   ├── libros.module.ts
│       │   └── libros.service.ts
│       ├── prestamos
│       │   ├── dto
│       │   │   └── prestamo.dto.ts
│       │   ├── prestamo.entity.ts
│       │   ├── prestamos.controller.ts
│       │   ├── prestamos.module.ts
│       │   └── prestamos.service.ts
│       ├── reservas
│       │   ├── dto
│       │   │   └── reserva.dto.ts
│       │   ├── reserva.entity.ts
│       │   ├── reservas.controller.ts
│       │   ├── reservas.module.ts
│       │   └── reservas.service.ts
│       ├── roles
│       │   ├── dto
│       │   │   └── AsignarRolDto.ts
│       │   ├── roles.controller.ts
│       │   ├── roles.guard.ts
│       │   ├── roles.module.ts
│       │   └── roles.service.ts
│       └── usuarios
│           ├── dto
│           │   ├── login.dto.ts
│           │   ├── register.dto.ts
│           │   └── update.dto.ts
│           ├── interfaces
│           ├── usuario.entity.ts
│           ├── usuarios.controller.ts
│           ├── usuarios.module.ts
│           └── usuarios.service.ts
│       └── v1.module.ts
└── test
    ├── auth
    │   ├── auth.controller.spec.ts
    │   └── auth.service.spec.ts
    ├── libros
    │   ├── libros.controller.spec.ts
    │   └── libros.service.spec.ts
    ├── prestamos
    │   ├── prestamos.controller.spec.ts
    │   └── prestamos.service.spec.ts
    ├── reservas
    │   ├── reservas.controller.spec.ts
    │   └── reservas.service.spec.ts
    ├── roles
    │   ├── roles.controller.spec.ts
    │   └── roles.service.spec.ts
    ├── usuarios
    │   ├── usuarios.controller.spec.ts
    │   └── usuarios.service.spec.ts
    ├── app.e2e-spec.ts
    └── jest-e2e.json



```

# Rutas de la API Rama swagger-test-deployment

## Salud
- **GET** `/api/v1/health` - Verifica el estado de salud de la API

## Roles
- **PUT** `/api/v1/roles/:id` - Actualiza un rol por ID

## Reservas
- **GET** `/api/v1/reservas` - Obtiene todas las reservas
- **POST** `/api/v1/reservas` - Crea una nueva reserva
- **GET** `/api/v1/reservas/:id` - Obtiene una reserva por ID
- **PUT** `/api/v1/reservas/:id` - Actualiza una reserva por ID
- **DELETE** `/api/v1/reservas/:id` - Elimina una reserva por ID

## Préstamos
- **GET** `/api/v1/prestamos` - Obtiene todos los préstamos
- **POST** `/api/v1/prestamos` - Crea un nuevo préstamo
- **GET** `/api/v1/prestamos/:id` - Obtiene un préstamo por ID
- **PUT** `/api/v1/prestamos/:id` - Actualiza un préstamo por ID
- **DELETE** `/api/v1/prestamos/:id` - Elimina un préstamo por ID

## Autenticación
- **POST** `/api/v1/auth/register` - Registra un nuevo usuario
- **POST** `/api/v1/auth/login` - Inicia sesión con las credenciales del usuario

## Usuarios
- **GET** `/api/v1/usuarios` - Obtiene todos los usuarios
- **POST** `/api/v1/usuarios/register` - Registra un nuevo usuario
- **POST** `/api/v1/usuarios/login` - Inicio de sesión del usuario
- **GET** `/api/v1/usuarios/id/:id` - Obtiene un usuario por ID
- **GET** `/api/v1/usuarios/nombre/:nombreUsuario` - Obtiene un usuario por nombre de usuario
- **PUT** `/api/v1/usuarios/:id` - Actualiza un usuario por ID
- **DELETE** `/api/v1/usuarios/:id` - Elimina un usuario por ID

## Libros
- **GET** `/api/v1/libros` - Obtiene todos los libros
- **POST** `/api/v1/libros` - Añade un nuevo libro
- **GET** `/api/v1/libros/:id` - Obtiene un libro por ID
- **PUT** `/api/v1/libros/:id` - Actualiza un libro por ID
- **DELETE** `/api/v1/libros/:id` - Elimina un libro por ID
- **GET** `/api/v1/libros/search` - Busca libros

## Instalación y Ejecución

### Instalación

```bash

$ npm install

```

### Ejecución

### 1.- Desarrollo:

```bash
    
    $ npm run start
    
 ```
   
### 2.- Modo de observación:

```bash
    
    $ npm run start:dev
    
    
```

### 3.- Modo producción:

```bash

$ npm run start:prod

```
### Pruebas

### 1.- Pruebas Unitarias:

```bash

$ npm run test

```
### 2.- Pruebas e2e:

```bash

$ npm run test:e2e

```
### 3.- Cobertura de Pruebas:

```bash

$ npm run test:cov

```
## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama: `git checkout -b feature/nueva-caracteristica` u otra..
3. Realiza tus cambios y haz un commit: `git commit -m 'Agrega nueva característica'`.
4. Envía un pull request.

## Licencia

Este proyecto está licenciado bajo la Licencia MD. Para más detalles, consulta el archivo [LICENSE.md](https://github.com/shida17-fullstack/crud-api-biblioteca-nest/blob/master/LICENSE.md).



## Soporte del Framework Nest.js

Nest.js es un proyecto de código abierto bajo la licencia MIT. Este framework puede seguir creciendo gracias a los patrocinadores y al apoyo de sus increíbles colaboradores. Si deseas unirte a ellos, por favor, lee más [aquí](https://docs.nestjs.com/support).

## Mantente en contacto
- **Autor:** Kamil Myśliwiec
- **Sitio web:** [https://nestjs.com](https://nestjs.com)
- **Twitter:** [@nestframework](https://twitter.com/nestframework)

## Licencia
Nest.js está bajo la licencia [MIT](LICENSE).


