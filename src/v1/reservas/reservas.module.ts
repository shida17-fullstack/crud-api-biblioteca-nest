import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Usa alias configurados en tsconfig.json para rutas absolutas
import { ReservasService } from '@reservas/reservas.service'; // Ruta Absoluta
import { Reserva } from '@reservas/reserva.entity'; // Ruta Absoluta
import { Prestamo } from '@prestamos/prestamo.entity'; // Ruta Absoluta
import { Libro } from '@libros/libro.entity'; // Ruta Absoluta
import { ReservasController } from '@reservas/reservas.controller'; // Ruta Absoluta
import { UsuariosModule } from '@usuarios/usuarios.module'; // Importa UsuariosModule 
/**
 * Módulo de Reservas.
 * Este módulo maneja la gestión de reservas, incluyendo la creación, actualización, eliminación y consulta de reservas.
 * Utiliza TypeORM para interactuar con la base de datos.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, Prestamo, Libro]),
    UsuariosModule,  // Importa el módulo de usuarios
  ],
  providers: [ReservasService],
  controllers: [ReservasController],
  exports: [ReservasService],
})
export class ReservasModule {}
