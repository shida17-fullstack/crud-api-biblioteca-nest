import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestamosService } from './prestamos.service';
import { Prestamo } from './prestamo.entity';
import { Reserva } from '../reservas/reserva.entity';
import { Libro } from '../libros/libro.entity';
import { PrestamosController } from './prestamos.controller';

/**
 * Módulo que encapsula la funcionalidad relacionada con los préstamos de libros.
 */
@Module({
  /**
   * Importaciones de otros módulos que son necesarios para este módulo.
   * TypeOrmModule.forFeature([Prestamo, Reserva, Libro]) configura TypeORM 
   * para gestionar las entidades Prestamo, Reserva y Libro.
   */
  imports: [TypeOrmModule.forFeature([Prestamo, Reserva, Libro])],

  /**
   * Proveedores que crean y entregan servicios utilizados por el módulo.
   * PrestamosService es el servicio que contiene la lógica de negocio 
   * para manejar los préstamos de libros.
   */
  providers: [PrestamosService],

  /**
   * Controladores que manejan las rutas y peticiones HTTP.
   * PrestamosController maneja las rutas relacionadas con los préstamos de libros.
   */
  controllers: [PrestamosController],

  /**
   * Proveedores que pueden ser utilizados por otros módulos que importen este módulo.
   * Al exportar PrestamosService, se permite que otros módulos puedan utilizar este servicio.
   */
  exports: [PrestamosService],
})
export class PrestamosModule {}
