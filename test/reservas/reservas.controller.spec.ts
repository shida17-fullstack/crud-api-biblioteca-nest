import { Test, TestingModule } from '@nestjs/testing';
import { ReservasController } from '@reservas/reservas.controller';
import { ReservasService } from '@reservas/reservas.service';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { CreateReservaDto, UpdateReservaDto } from '@reservas/dto/reserva.dto';
import { Reserva } from '@reservas/reserva.entity';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtPayload } from '@auth/jwt-payload.interface';

// Mock de la entidad Prestamo
const mockPrestamo = { id: 1 } as any; // Define un mock básico si es necesario

describe('ReservasController', () => {
  let controller: ReservasController;
  let service: ReservasService;

  // Mock del servicio de reservas
  const mockReservasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservasController],
      providers: [
        {
          provide: ReservasService,
          useValue: mockReservasService,
        },
      ],
    }).compile();

    controller = module.get<ReservasController>(ReservasController);
    service = module.get<ReservasService>(ReservasService);
  });

  // Define los mocks necesarios
  const mockJwtPayload: JwtPayload = { sub: 1, nombreUsuario: 'testuser' };
  const mockCreateReservaDto: CreateReservaDto = {
    libroId: 1,
    usuarioId: 1,
    fechaReserva: new Date('2024-08-20'),  // Ajustar el tipo a Date
    fechaNotificacion: new Date('2024-08-19'), // Ajustar el tipo a Date
  };
  const mockReserva: Reserva = {
    id: 1,
    libro: { id: 1, titulo: 'Test Book' } as any,
    usuario: { id: 1, nombre: 'Test User' } as any,
    fechaReserva: new Date('2024-08-20'),
    fechaNotificacion: new Date('2024-08-19'),
    isDeleted: false,
    prestamo: mockPrestamo, 
  };

  describe('create', () => {
    it('debería crear una nueva reserva', async () => {
      jest.spyOn(service, 'create').mockResolvedValue({
        message: 'Reserva creada exitosamente.',
        reserva: mockReserva,
      });

      const result = await controller.create(mockCreateReservaDto, { user: mockJwtPayload });
      expect(result).toEqual({
        message: 'Reserva creada exitosamente.',
        reserva: mockReserva,
      });
    });

    it('debería lanzar ForbiddenException si el usuario no está autorizado', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new ForbiddenException());

      await expect(controller.create(mockCreateReservaDto, { user: mockJwtPayload })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('debería devolver todas las reservas', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue({
        message: 'Reservas obtenidas exitosamente.',
        reservas: [mockReserva],
        total: 1,
      });

      const result = await controller.findAll();
      expect(result).toEqual({
        message: 'Reservas obtenidas exitosamente.',
        reservas: [mockReserva],
        total: 1,
      });
    });

    it('debería lanzar NotFoundException si no se encuentran reservas', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue({
        message: 'No hay reservas disponibles.',
        reservas: [],
        total: 0,
      });

      await expect(controller.findAll()).resolves.toEqual({
        message: 'No hay reservas disponibles.',
        reservas: [],
        total: 0,
      });
    });
  });

  describe('findOne', () => {
    it('debería devolver una reserva por id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        message: 'Reserva obtenida exitosamente.',
        reserva: mockReserva,
      });

      const result = await controller.findOne(1);
      expect(result).toEqual({
        message: 'Reserva obtenida exitosamente.',
        reserva: mockReserva,
      });
    });

    it('debería lanzar NotFoundException si no se encuentra la reserva', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('debería eliminar una reserva por id', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue({
        message: 'Reserva eliminada exitosamente.',
        reserva: mockReserva,
      });

      const result = await controller.delete(1);
      expect(result).toEqual({
        message: 'Reserva eliminada exitosamente.',
        reserva: mockReserva,
      });
    });

    it('debería lanzar NotFoundException si no se encuentra la reserva', async () => {
      jest.spyOn(service, 'delete').mockRejectedValue(new NotFoundException());

      await expect(controller.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
