/* src/v1/roles/roles.service.spec.ts */
import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '@roles/roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, Rol } from '@usuarios/usuario.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

/**
 * Pruebas para el servicio de roles.
 * @see RolesService
 */
describe('RolesService', () => {
  let service: RolesService;
  let repository: Repository<Usuario>;

  /**
   * Configura el entorno de pruebas antes de cada prueba.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Usuario),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  /**
   * Pruebas para el método `asignarRol`.
   */
  describe('asignarRol', () => {
    /**
     * Prueba para asignar un rol exitosamente.
     */
    it('debería asignar un rol a un usuario exitosamente', async () => {
      const id = 1;
      const nuevoRol = Rol.BIBLIOTECARIO;
      const usuarioAutenticadoId = 2;
      const usuario = new Usuario();
      const usuarioAutenticado = new Usuario();

      usuarioAutenticado.id = usuarioAutenticadoId;
      usuarioAutenticado.rol = Rol.DIRECTOR;
      usuario.id = id;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(usuario).mockResolvedValueOnce(usuarioAutenticado);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(usuario);

      const result = await service.asignarRol(id, nuevoRol, usuarioAutenticadoId);
      expect(result.message).toBe(`Rol asignado exitosamente a usuario con ID ${id}`);
      expect(usuario.rol).toBe(nuevoRol);
    });

    /**
     * Prueba para lanzar NotFoundException si el usuario no se encuentra.
     */
    it('debería lanzar NotFoundException si el usuario no se encuentra', async () => {
      const id = 1;
      const nuevoRol = Rol.BIBLIOTECARIO;
      const usuarioAutenticadoId = 2;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.asignarRol(id, nuevoRol, usuarioAutenticadoId)).rejects.toThrow(NotFoundException);
    });

    /**
     * Prueba para lanzar ForbiddenException si el usuario autenticado no tiene permisos.
     */
    it('debería lanzar ForbiddenException si el usuario autenticado no tiene permisos', async () => {
      const id = 1;
      const nuevoRol = Rol.BIBLIOTECARIO;
      const usuarioAutenticadoId = 2;
      const usuario = new Usuario();
      const usuarioAutenticado = new Usuario();

      usuarioAutenticado.id = usuarioAutenticadoId;
      usuarioAutenticado.rol = Rol.USUARIO; // No es director, por lo que no tiene permisos
      usuario.id = id;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(usuario).mockResolvedValueOnce(usuarioAutenticado);

      await expect(service.asignarRol(id, nuevoRol, usuarioAutenticadoId)).rejects.toThrow(ForbiddenException);
    });
  });

  /**
   * Pruebas para el método `getUsuarioById`.
   */
  describe('getUsuarioById', () => {
    /**
     * Prueba para obtener un usuario por ID.
     */
    it('debería retornar un usuario por ID', async () => {
      const id = 1;
      const usuario = new Usuario();
      usuario.id = id;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(usuario);

      const result = await service.getUsuarioById(id);
      expect(result).toBe(usuario);
    });
  });
});
