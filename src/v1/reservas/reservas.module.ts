import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasService } from './reservas.service';
import { Reserva } from './reserva.entity';
import { Prestamo } from '../prestamos/prestamo.entity';
import { Libro } from '../libros/libro.entity';
import { ReservasController } from './reservas.controller';

/**
 * Módulo de Reservas.
 * Este módulo maneja la gestión de reservas, incluyendo la creación, actualización, eliminación y consulta de reservas.
 * Utiliza TypeORM para interactuar con la base de datos.
 */
@Module({
  // Importa el módulo TypeOrmModule y registra las entidades Reserva, Prestamo y Libro
  imports: [TypeOrmModule.forFeature([Reserva, Prestamo, Libro])],
  // Proveedores disponibles en el módulo, incluyendo el servicio de reservas
  providers: [ReservasService],
  // Controladores disponibles en el módulo, incluyendo el controlador de reservas
  controllers: [ReservasController],
  // Exporta el servicio de reservas para que pueda ser utilizado en otros módulos
  exports: [ReservasService],
})
export class ReservasModule {}
