import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestamosService } from '@prestamos/prestamos.service'; // Ruta Absoluta
import { Prestamo } from '@prestamos/prestamo.entity'; // Ruta Absoluta
import { Reserva } from '@reservas/reserva.entity'; // Ruta Absoluta
import { Libro } from '@libros/libro.entity'; // Ruta Absoluta
import { PrestamosController } from '@prestamos/prestamos.controller'; // Ruta Absoluta
import { UsuariosModule } from '@usuarios/usuarios.module'; // Importa UsuariosModule 

/**
 * Módulo que encapsula la funcionalidad relacionada con los préstamos de libros.
 */
@Module({
  /**
   * Importaciones de otros módulos que son necesarios para este módulo.
   * TypeOrmModule.forFeature([Prestamo, Reserva, Libro]) configura TypeORM
   * para gestionar las entidades Prestamo, Reserva y Libro.
   */
  imports: [
    TypeOrmModule.forFeature([Prestamo, Reserva, Libro]),
    UsuariosModule, // Importa UsuariosModule para que UsuarioRepository esté disponible
  ],

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
