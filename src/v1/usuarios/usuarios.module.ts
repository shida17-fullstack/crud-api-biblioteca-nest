import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './usuario.entity';

/**
 * Módulo de Usuarios.
 * 
 * Este módulo encapsula la lógica relacionada con la entidad `Usuario`, incluyendo la definición del servicio y el controlador, y la integración con TypeORM.
 */
@Module({
  imports: [
    /**
     * Importa el módulo TypeOrmModule y configura la entidad `Usuario`.
     * 
     * El método `forFeature` registra la entidad `Usuario` para su uso dentro de este módulo, permitiendo que el repositorio de la entidad sea inyectado en el servicio `UsuariosService`.
     */
    TypeOrmModule.forFeature([Usuario])
  ],
  providers: [
    /**
     * Proveedor del servicio `UsuariosService`.
     * 
     * El servicio `UsuariosService` contiene la lógica de negocio relacionada con la entidad `Usuario`.
     */
    UsuariosService
  ],
  controllers: [
    /**
     * Controlador de `UsuariosController`.
     * 
     * El controlador `UsuariosController` maneja las solicitudes HTTP entrantes relacionadas con la entidad `Usuario`.
     */
    UsuariosController
  ],
})
export class UsuariosModule {}
