import { Test, TestingModule } from '@nestjs/testing';
import { LibrosController } from '@libros/libros.controller';
import { LibrosService } from '@libros/libros.service';
import { CreateLibroDTO } from '@libros/dto/create-libro.dto';
import { UpdateLibroDTO } from '@libros/dto/update-libro.dto';
import { Libro } from '@libros/libro.entity';
import { NotFoundException } from '@nestjs/common';
import { JwtPayload } from '@auth/jwt-payload.interface'; 

describe('LibrosController', () => {
  let controller: LibrosController;
  let service: LibrosService;

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

  const mockLibrosService = {
    create: jest.fn().mockResolvedValue(mockLibro),
    findByTituloAndAutor: jest.fn().mockResolvedValue(null),
    search: jest.fn().mockResolvedValue({ libros: [mockLibro], total: 1 }),
    findOne: jest.fn().mockResolvedValue(mockLibro),
    findAll: jest.fn().mockResolvedValue({ libros: [mockLibro], total: 1 }),
    remove: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(mockLibro),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrosController],
      providers: [{ provide: LibrosService, useValue: mockLibrosService }],
    }).compile();

    controller = module.get<LibrosController>(LibrosController);
    service = module.get<LibrosService>(LibrosService);
  });

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

      expect(await controller.create(dto, req)).toEqual({
        message: 'Libro creado exitosamente',
        libro: mockLibro,
      });
    });
  });

  describe('search', () => {
    it('debería encontrar libros por criterios de búsqueda', async () => {
      expect(await controller.search('Test', 'Autor', 'País', 'Temática', 2021)).toEqual({
        message: 'Resultados de búsqueda obtenidos',
        libros: [mockLibro],
        total: 1,
      });
    });

    it('debería lanzar NotFoundException si no se encuentran libros', async () => {
      mockLibrosService.search = jest.fn().mockResolvedValue({ libros: [], total: 0 });

      await expect(controller.search('NoExiste', 'Autor', 'País', 'Temática', 2021))
        .rejects
        .toThrow(new NotFoundException('No se encontraron libros que coincidan con los criterios de búsqueda.'));
    });
  });

  describe('findAll', () => {
    it('debería obtener todos los libros', async () => {
      expect(await controller.findAll()).toEqual({
        message: 'Listado de libros obtenido exitosamente',
        libros: [mockLibro],
        total: 1,
      });
    });
  });

  describe('remove', () => {
    it('debería eliminar un libro por ID', async () => {
      expect(await controller.remove(1)).toEqual({
        message: 'Libro eliminado exitosamente',
      });
    });

    it('debería lanzar NotFoundException si el libro no se encuentra al eliminar', async () => {
      mockLibrosService.remove = jest.fn().mockRejectedValue(new NotFoundException('Libro no encontrado'));

      await expect(controller.remove(999)).rejects.toThrow(new NotFoundException('Libro no encontrado'));
    });
  });

  describe('update', () => {
    it('debería actualizar un libro existente', async () => {
      const dto: UpdateLibroDTO = {
        titulo: 'Nuevo Título',
      };

      expect(await controller.update(1, dto)).toEqual({
        message: 'Libro actualizado exitosamente',
        libro: mockLibro,
      });
    });

    it('debería lanzar un error si los datos enviados son idénticos a los actuales', async () => {
      mockLibrosService.update = jest.fn().mockRejectedValue(new Error('Los datos enviados son idénticos a los datos actuales'));

      await expect(controller.update(1, {})).resolves.toEqual({
        message: 'Los datos enviados son idénticos a los datos actuales',
      });
    });
  });
});
