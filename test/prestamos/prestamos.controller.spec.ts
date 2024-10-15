import { Test, TestingModule } from '@nestjs/testing';
import { PrestamosController } from '@prestamos/prestamos.controller';
import { PrestamosService } from '@prestamos/prestamos.service';
import { CreatePrestamoDto, UpdatePrestamoDto } from '@prestamos/dto/prestamo.dto';
import { NotFoundException } from '@nestjs/common';

describe('PrestamosController', () => {
  let prestamosController: PrestamosController;
  let prestamosService: PrestamosService;
  const fechaActual = new Date(); // Usa una sola instancia de fecha para consistencia

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestamosController],
      providers: [
        {
          provide: PrestamosService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              libroId: 1,
              usuarioId: 1,
              fechaPrestamo: fechaActual,
              fechaDevolucion: null,
            }),
            findAll: jest.fn().mockResolvedValue([
              {
                id: 1,
                libroId: 1,
                usuarioId: 1,
                fechaPrestamo: fechaActual,
                fechaDevolucion: null,
              },
            ]),
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              libroId: 1,
              usuarioId: 1,
              fechaPrestamo: fechaActual,
              fechaDevolucion: null,
            }),
            update: jest.fn().mockResolvedValue({
              id: 1,
              libroId: 1,
              usuarioId: 1,
              fechaPrestamo: fechaActual,
              fechaDevolucion: null,
            }),
            remove: jest.fn().mockResolvedValue({ success: true }),
          },
        },
      ],
    }).compile();

    prestamosController = module.get<PrestamosController>(PrestamosController);
    prestamosService = module.get<PrestamosService>(PrestamosService);
  });

  describe('create', () => {
    it('debería crear un nuevo préstamo', async () => {
      const createPrestamoDto: CreatePrestamoDto = {
        libroId: 1,
        usuarioId: 1,
        fechaPrestamo: fechaActual,
        fechaDevolucion: null,
      };
      const req = { user: { usuarioId: 1, nombreUsuario: 'testuser' } };
      const result = await prestamosController.create(createPrestamoDto, req);
      expect(result).toEqual({
        id: 1,
        ...createPrestamoDto,
      });
      expect(prestamosService.create).toHaveBeenCalledWith(createPrestamoDto, {
        sub: 1,
        nombreUsuario: 'testuser',
      });
    });
  });

  describe('findAll', () => {
    it('debería devolver una lista de préstamos', async () => {
      const result = await prestamosController.findAll();
      expect(result).toEqual([
        {
          id: 1,
          libroId: 1,
          usuarioId: 1,
          fechaPrestamo: fechaActual,
          fechaDevolucion: null,
        },
      ]);
      expect(prestamosService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería devolver un préstamo', async () => {
      const id = 1;
      const result = await prestamosController.findOne(id);
      expect(result).toEqual({
        id,
        libroId: 1,
        usuarioId: 1,
        fechaPrestamo: fechaActual,
        fechaDevolucion: null,
      });
      expect(prestamosService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('debería actualizar un préstamo existente', async () => {
      const id = 1;
      const updatePrestamoDto: UpdatePrestamoDto = {
        libroId: 1,
        usuarioId: 1,
        fechaPrestamo: fechaActual,
        fechaDevolucion: null,
      };
      const result = await prestamosController.update(id, updatePrestamoDto);
      expect(result).toEqual({
        id,
        ...updatePrestamoDto,
      });
      expect(prestamosService.update).toHaveBeenCalledWith(id, updatePrestamoDto);
    });

    it('debería lanzar una excepción NotFoundException si el préstamo no se encuentra', async () => {
      const id = 1;
      const updatePrestamoDto: UpdatePrestamoDto = {
        libroId: 1,
        usuarioId: 1,
        fechaPrestamo: fechaActual,
        fechaDevolucion: null,
      };
      jest.spyOn(prestamosService, 'findOne').mockResolvedValueOnce(null);
      await expect(prestamosController.update(id, updatePrestamoDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un préstamo', async () => {
      const id = 1;
      const result = await prestamosController.remove(id);
      expect(result).toEqual({ success: true });
      expect(prestamosService.remove).toHaveBeenCalledWith(id);
    });
  });
});
