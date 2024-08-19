// src/v1/roles/roles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from '@roles/roles.service';
import { RolesController } from '@roles/roles.controller';
import { UsuariosModule } from '@usuarios/usuarios.module';
import { Usuario } from '@usuarios/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), UsuariosModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService], // Exporta el servicio si se necesita en otros módulos
})
export class RolesModule {}
