import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from '@roles/roles.controller';
import { RolesService } from '@roles/roles.service';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { RolesGuard } from '@roles/roles.guard';
import { AsignarRolDto } from '@roles/dto/AsignarRolDto';
import { Rol, Usuario } from '@usuarios/usuario.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  // Mock del servicio de Roles para usar en las pruebas
  const mockRolesService = {
    asignarRol: jest.fn(), // Mock de la función para asignar roles
    getUsuarioById: jest.fn(), // Mock de la función para obtener un usuario por ID
  };

  // Configuración antes de cada prueba
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController], // Controlador que estamos probando
      providers: [
        {
          provide: RolesService, // Servicio que se mockea
          useValue: mockRolesService, // Usamos el mock en lugar del servicio real
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController); // Obtenemos una instancia del controlador
    service = module.get<RolesService>(RolesService); // Obtenemos una instancia del servicio
  });

  // Verifica que el controlador esté definido
  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  // Descripción de las pruebas para el método asignarRol
  describe('asignarRol', () => {
    // Prueba para asignar un rol a un usuario
    it('debería asignar un rol al usuario', async () => {
      const asignarRolDto: AsignarRolDto = {
        rol: Rol.DIRECTOR, // Rol que se va a asignar
        usuarioAutenticadoId: 1, // ID del usuario autenticado que está asignando el rol
      };
      const result = { message: 'Rol asignado exitosamente a usuario con ID 1' }; // Resultado esperado

      // Mockeamos la respuesta del servicio para devolver el resultado esperado
      mockRolesService.asignarRol.mockResolvedValue(result);

      // Verificamos que el controlador devuelva el resultado esperado
      expect(await controller.asignarRol(1, asignarRolDto)).toEqual(result);
      // Verificamos que la función asignarRol del servicio haya sido llamada con los parámetros correctos
      expect(mockRolesService.asignarRol).toHaveBeenCalledWith(1, Rol.DIRECTOR, 1);
    });

    // Prueba para lanzar una excepción NotFoundException cuando no se encuentra el usuario
    it('debería lanzar NotFoundException si no se encuentra al usuario', async () => {
      const asignarRolDto: AsignarRolDto = {
        rol: Rol.DIRECTOR,
        usuarioAutenticadoId: 1,
      };

      // Mockeamos la respuesta del servicio para simular que el usuario no fue encontrado
      mockRolesService.asignarRol.mockRejectedValue(new NotFoundException('Usuario con ID 1 no encontrado'));

      // Verificamos que el controlador lance la excepción NotFoundException
      await expect(controller.asignarRol(1, asignarRolDto)).rejects.toThrow(NotFoundException);
    });

    // Prueba para lanzar una excepción ForbiddenException si el usuario no tiene permisos
    it('debería lanzar ForbiddenException si el usuario no tiene permiso', async () => {
      const asignarRolDto: AsignarRolDto = {
        rol: Rol.DIRECTOR,
        usuarioAutenticadoId: 1,
      };

      // Mockeamos la respuesta del servicio para simular que el usuario no tiene permisos
      mockRolesService.asignarRol.mockRejectedValue(new ForbiddenException('No tiene permisos para asignar roles'));

      // Verificamos que el controlador lance la excepción ForbiddenException
      await expect(controller.asignarRol(1, asignarRolDto)).rejects.toThrow(ForbiddenException);
    });
  });
});
