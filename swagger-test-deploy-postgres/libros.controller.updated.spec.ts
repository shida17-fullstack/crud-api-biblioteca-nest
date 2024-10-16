/**
 * Importaciones necesarias para realizar las pruebas unitarias.
 * @module Pruebas
 */
import { Test, TestingModule } from '@nestjs/testing';
import { LibrosController } from '@libros/libros.controller';
import { LibrosService } from '@libros/libros.service';
import { CreateLibroDTO } from '@libros/dto/create-libro.dto';
import { UpdateLibroDTO } from '@libros/dto/update-libro.dto';
import { Libro } from '@libros/libro.entity';
import { NotFoundException } from '@nestjs/common';
import { JwtPayload } from '@auth/jwt-payload.interface';

/**
 * Pruebas unitarias para el controlador de Libros.
 * @class LibrosController
 */
describe('LibrosController', () => {
  let controller: LibrosController;
  let service: LibrosService;

  /**
   * Ejemplo de un objeto Libro para usar en las pruebas.
   * @type {Libro}
   */
  const mockLibro: Libro = {
    id: 1,
    titulo: 'Test',
    autor: 'Autor',
    nacionalidadAutor: 'País',
    tematica: 'Temática',
    anioPublicacion: 2021,
    extracto: 'Un extracto del libro.',
    editorial: 'Editorial de Prueba',
    disponible: true,
    isDeleted: false,
    reservas: [],
    prestamos: [],
  };

  /**
   * Simulación del servicio de libros, que simula el comportamiento real para las pruebas.
   * Utiliza `jest.fn()` para simular métodos que resuelven valores específicos.
   */
  const mockLibrosService = {
    create: jest.fn().mockResolvedValue(mockLibro),
    findByTituloAndAutor: jest.fn().mockResolvedValue(null),
    search: jest.fn().mockResolvedValue({ libros: [mockLibro], total: 1 }),
    findOne: jest.fn().mockResolvedValue(mockLibro),
    findAll: jest.fn().mockResolvedValue({ libros: [mockLibro], total: 1 }),
    remove: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(mockLibro),
  };

  /**
   * Antes de cada prueba, se crea un módulo de pruebas que provee las dependencias necesarias.
   * Se utiliza `useValue` para inyectar el mock del servicio en lugar del servicio real.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrosController],
      providers: [{ provide: LibrosService, useValue: mockLibrosService }],
    }).compile();

    controller = module.get<LibrosController>(LibrosController);
    service = module.get<LibrosService>(LibrosService);
  });

  /**
   * Pruebas para el método `create` del controlador de libros.
   * Simula la creación de un libro utilizando un DTO de creación y un objeto de solicitud.
   */
  describe('create', () => {
    it('debería crear un nuevo libro', async () => {
      const dto: CreateLibroDTO = {
        titulo: 'Test',
        autor: 'Autor',
        nacionalidadAutor: 'País',
        tematica: 'Temática',
        anioPublicacion: 2021,
        extracto: 'Un extracto del libro.',
        editorial: 'Editorial de Prueba',
        disponible: true,
      };

      const req = {
        user: {
          usuarioId: 1,
          nombreUsuario: 'usuario1',
        },
      };

      const usuarioAutenticado: JwtPayload = {
        sub: req.user.usuarioId,
        nombreUsuario: req.user.nombreUsuario,
      };

      // Validar que el libro se crea correctamente utilizando los datos de prueba.
      expect(await controller.create(dto, req)).toEqual({
        message: 'Libro creado exitosamente',
        libro: mockLibro,
      });
    });
  });

  /**
   * Pruebas para el método `search` del controlador.
   * Simula la búsqueda de libros por criterios específicos.
   */
  describe('search', () => {
    it('debería encontrar libros por criterios de búsqueda', async () => {
      // Validar que se encuentren libros que coincidan con los criterios de búsqueda.
      expect(await controller.search('Test', 'Autor', 'País', 'Temática', 2021)).toEqual({
        message: 'Resultados de búsqueda obtenidos',
        libros: [mockLibro],
        total: 1,
      });
    });

    it('debería lanzar NotFoundException si no se encuentran libros', async () => {
      // Simular que no se encuentran libros para los criterios dados.
      mockLibrosService.search = jest.fn().mockResolvedValue({ libros: [], total: 0 });

      // Validar que se lanza una excepción cuando no se encuentran resultados.
      await expect(controller.search('NoExiste', 'Autor', 'País', 'Temática', 2021))
        .rejects
        .toThrow(new NotFoundException('No se encontraron libros que coincidan con los criterios de búsqueda.'));
    });
  });

  /**
   * Pruebas para el método `findAll` del controlador.
   * Simula la obtención de todos los libros registrados.
   */
  describe('findAll', () => {
    it('debería obtener todos los libros', async () => {
      // Validar que se obtienen todos los libros correctamente.
      expect(await controller.findAll()).toEqual({
        message: 'Listado de libros obtenido exitosamente',
        libros: [mockLibro],
        total: 1,
      });
    });
  });

  /**
   * Pruebas para el método `remove` del controlador.
   * Simula la eliminación de un libro por su ID.
   */
  describe('remove', () => {
    it('debería eliminar un libro por ID', async () => {
      // Validar que el libro se elimina correctamente.
      expect(await controller.remove(1)).toEqual({
        message: 'Libro eliminado exitosamente',
      });
    });

    it('debería lanzar NotFoundException si el libro no se encuentra al eliminar', async () => {
      // Simular que el libro no se encuentra para ser eliminado.
      mockLibrosService.remove = jest.fn().mockRejectedValue(new NotFoundException('Libro no encontrado'));

      // Validar que se lanza una excepción cuando no se encuentra el libro.
      await expect(controller.remove(999)).rejects.toThrow(new NotFoundException('Libro no encontrado'));
    });
  });

  /**
   * Pruebas para el método `update` del controlador.
   * Simula la actualización de los datos de un libro existente.
   */
  describe('update', () => {
    it('debería actualizar un libro existente', async () => {
      const dto: UpdateLibroDTO = {
        titulo: 'Nuevo Título',
      };

      // Validar que el libro se actualiza correctamente con los nuevos datos.
      expect(await controller.update(1, dto)).toEqual({
        message: 'Libro actualizado exitosamente',
        libro: mockLibro,
      });
    });

    it('debería lanzar un error si los datos enviados son idénticos a los actuales', async () => {
      // Simular que los datos enviados son idénticos a los actuales.
      mockLibrosService.update = jest.fn().mockRejectedValue(new Error('Los datos enviados son idénticos a los datos actuales'));

      // Validar que se retorna un mensaje indicando que los datos no fueron modificados.
      await expect(controller.update(1, {})).resolves.toEqual({
        message: 'Los datos enviados son idénticos a los datos actuales',
      });
    });
  });
});
