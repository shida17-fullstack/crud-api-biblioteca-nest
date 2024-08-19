import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from '@usuarios/usuarios.service';
import { UsuariosController } from '@usuarios/usuarios.controller';
import { Usuario } from '@usuarios/usuario.entity';
import { AuthModule } from '@auth/auth.module';

/**
 * Módulo de Usuarios que encapsula todos los componentes relacionados con la entidad Usuario.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    forwardRef(() => AuthModule), // Usa forwardRef para evitar dependencia circular
  ],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [UsuariosService, TypeOrmModule], // Exporta UsuariosService y TypeOrmModule
})
export class UsuariosModule {}
