import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from '@usuarios/usuarios.service';
import { Usuario, Rol } from '@usuarios/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RegisterDto } from '@usuarios/dto/register.dto';
import { LoginDto } from '@usuarios/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '@auth/jwt-payload.interface';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repository: Repository<Usuario>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useClass: Repository,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('findAll', () => {
    it('debería lanzar ForbiddenException si el usuario no tiene permiso', async () => {
      const usuarioAutenticado: JwtPayload = { sub: 1, nombreUsuario: 'testuser' };
      const usuarioAutenticadoBD = { id: 1, rol: Rol.USUARIO }; // Usuario simulado sin permisos

      jest.spyOn(repository, 'findOne').mockResolvedValue(usuarioAutenticadoBD as Usuario);

      await expect(service.findAll(usuarioAutenticado)).rejects.toThrow(ForbiddenException);
    });

    it('debería devolver todos los usuarios si el usuario tiene permiso', async () => {
      const usuarioAutenticado: JwtPayload = { sub: 1, nombreUsuario: 'testuser' };
      const usuarioAutenticadoBD = { id: 1, rol: Rol.DIRECTOR }; // Usuario simulado con permisos
      const usuarios = [{ id: 1, nombreUsuario: 'user1' }, { id: 2, nombreUsuario: 'user2' }];

      jest.spyOn(repository, 'findOne').mockResolvedValue(usuarioAutenticadoBD as Usuario);
      jest.spyOn(repository, 'find').mockResolvedValue(usuarios as Usuario[]);

      const result = await service.findAll(usuarioAutenticado);
      expect(result).toEqual({ usuarios, cantidad: usuarios.length, message: 'Usuarios listados con éxito' });
    });
  });

  describe('findUserById', () => {
    it('debería lanzar NotFoundException si el usuario no es encontrado', async () => {
      const usuarioAutenticado: JwtPayload = { sub: 1, nombreUsuario: 'testuser' };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findUserById(1, usuarioAutenticado)).rejects.toThrow(NotFoundException);
    });

    it('debería devolver el usuario si es encontrado y tiene permiso', async () => {
      const usuarioAutenticado: JwtPayload = { sub: 1, nombreUsuario: 'testuser' };
      const usuario = { id: 1, nombreUsuario: 'user1', rol: Rol.DIRECTOR }; // Usuario simulado con permisos

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(usuario as Usuario);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(usuario as Usuario);

      const result = await service.findUserById(1, usuarioAutenticado);
      expect(result).toEqual(usuario);
    });

    it('debería lanzar ForbiddenException si el usuario no tiene permiso para ver el usuario', async () => {
      const usuarioAutenticado: JwtPayload = { sub: 1, nombreUsuario: 'testuser' };
      const usuario = { id: 2, nombreUsuario: 'user2', rol: Rol.USUARIO }; // Usuario simulado sin permisos

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(usuario as Usuario);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({ id: 1, rol: Rol.USUARIO } as Usuario);

      await expect(service.findUserById(2, usuarioAutenticado)).rejects.toThrow(ForbiddenException);
    });
  });

  
});
