import { Test, TestingModule } from '@nestjs/testing';
import { ReservasService } from '@reservas/reservas.service';
import { Reserva } from '@reservas/reserva.entity';
import { Prestamo } from '@prestamos/prestamo.entity';
import { Libro } from '@libros/libro.entity';
import { Usuario } from '@usuarios/usuario.entity';
import { UsuariosService } from '@usuarios/usuarios.service';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtPayload } from '@auth/jwt-payload.interface';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';

describe('ReservasService', () => {
  let service: ReservasService;
  let reservasRepository: Repository<Reserva>;
  let prestamosRepository: Repository<Prestamo>;
  let librosRepository: Repository<Libro>;
  let usuariosService: UsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservasService,
        UsuariosService,
        {
          provide: getRepositoryToken(Reserva),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Prestamo),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Libro),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: UsuariosService,
          useValue: {
            findUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReservasService>(ReservasService);
    reservasRepository = module.get<Repository<Reserva>>(getRepositoryToken(Reserva));
    prestamosRepository = module.get<Repository<Prestamo>>(getRepositoryToken(Prestamo));
    librosRepository = module.get<Repository<Libro>>(getRepositoryToken(Libro));
    usuariosService = module.get<UsuariosService>(UsuariosService);
  });

  it('debería lanzar ConflictException si hay reservas que se solapan', async () => {
    const createReservaDto = { libroId: 1, usuarioId: 2, fechaReserva: new Date(), fechaNotificacion: null };
    const usuarioAutenticado: JwtPayload = { sub: 2, nombreUsuario: 'testuser' };

    const libro = { id: 1, disponible: true, isDeleted: false } as Libro;
    const overlappingReservas = [
      {
        usuario: { id: 3 } as Usuario,
        libro: { id: 1 } as Libro,
        fechaReserva: moment(createReservaDto.fechaReserva).startOf('day').toDate(),
        fechaNotificacion: null,
        isDeleted: false,
        prestamo: null as Prestamo | null,
      } as Reserva,
    ];

    jest.spyOn(librosRepository, 'findOne').mockResolvedValue(libro);
    jest.spyOn(reservasRepository, 'find').mockResolvedValue(overlappingReservas);

    await expect(service.create(createReservaDto, usuarioAutenticado)).rejects.toThrow(ConflictException);
  });

   

  it('debería crear una reserva exitosamente', async () => {
    const createReservaDto = { libroId: 1, usuarioId: 2, fechaReserva: new Date(), fechaNotificacion: null };
    const usuarioAutenticado: JwtPayload = { sub: 2, nombreUsuario: 'testuser' };
  
    const libro = { id: 1, disponible: true, isDeleted: false } as Libro;
    const usuario = { id: 2 } as Usuario;
    const reservaCreada = {
      id: 1,
      libro,
      usuario,
      ...createReservaDto,
      isDeleted: false,
      prestamo: null as Prestamo | null,
    } as Reserva;
  
    jest.spyOn(librosRepository, 'findOne').mockResolvedValue(libro);
    jest.spyOn(reservasRepository, 'find').mockResolvedValue([]);
    jest.spyOn(usuariosService, 'findUserById').mockResolvedValue(usuario);
    jest.spyOn(reservasRepository, 'save').mockResolvedValue(reservaCreada);
    jest.spyOn(librosRepository, 'save').mockResolvedValue({ ...libro, disponible: false });
  
    const result = await service.create(createReservaDto, usuarioAutenticado);
    expect(result).toEqual({ message: 'Reserva creada exitosamente.', reserva: reservaCreada });
  });
});