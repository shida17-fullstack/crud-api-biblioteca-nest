import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosService } from './libros.service';
import { LibrosController } from './libros.controller';
import { Libro } from './libro.entity';

/**
 * Módulo de Libros que gestiona la lógica de negocio y la interacción con la base de datos para la entidad `Libro`.
 * 
 * Este módulo importa el `TypeOrmModule` para la entidad `Libro`, y proporciona el `LibrosService` y el `LibrosController`.
 * 
 * @module LibrosModule
 */
@Module({
  /**
   * Importaciones necesarias para el módulo.
   * 
   * `TypeOrmModule.forFeature([Libro])`:
   * - Importa y configura el módulo TypeORM para la entidad `Libro`.
   * - Permite que el módulo gestione automáticamente las operaciones de base de datos relacionadas con la entidad `Libro`.
   */
  imports: [TypeOrmModule.forFeature([Libro])],

  /**
   * Proveedores del módulo.
   * 
   * `LibrosService`:
   * - Servicio que contiene la lógica de negocio para gestionar las operaciones relacionadas con los libros.
   * - Responsable de acciones como crear, buscar, actualizar, y eliminar libros en la base de datos.
   */
  providers: [LibrosService],

  /**
   * Controladores del módulo.
   * 
   * `LibrosController`:
   * - Controlador que maneja las solicitudes HTTP relacionadas con los libros.
   * - Define las rutas y acciones necesarias para interactuar con la entidad `Libro` a través de las operaciones proporcionadas por el `LibrosService`.
   */
  controllers: [LibrosController],
})
export class LibrosModule {}
