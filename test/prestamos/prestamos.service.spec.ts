import { Test, TestingModule } from '@nestjs/testing';
import { PrestamosService } from '@prestamos/prestamos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Prestamo } from '@prestamos/prestamo.entity';
import { Reserva } from '@reservas/reserva.entity';
import { Libro } from '@libros/libro.entity';
import { Usuario } from '@usuarios/usuario.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '@auth/jwt-payload.interface';

describe('PrestamosService', () => {
  let service: PrestamosService;
  let prestamosRepository: Repository<Prestamo>;
  let reservasRepository: Repository<Reserva>;
  let librosRepository: Repository<Libro>;
  let usuariosRepository: Repository<Usuario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestamosService,
        {
          provide: getRepositoryToken(Prestamo),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Reserva),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
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
          provide: getRepositoryToken(Usuario),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PrestamosService>(PrestamosService);
    prestamosRepository = module.get<Repository<Prestamo>>(getRepositoryToken(Prestamo));
    reservasRepository = module.get<Repository<Reserva>>(getRepositoryToken(Reserva));
    librosRepository = module.get<Repository<Libro>>(getRepositoryToken(Libro));
    usuariosRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  it('should create a new loan', async () => {
    const createPrestamoDto = {
      libroId: 1,
      fechaPrestamo: new Date('2024-08-01T10:00:00Z'),
      fechaDevolucion: new Date('2024-08-15T10:00:00Z'),
      usuarioId: 1,
    };

    const usuarioAutenticado = { sub: 1 } as JwtPayload;

    // Mock de los métodos de repositorio
    const libro = { id: 1, disponible: true, isDeleted: false } as Libro;
    const usuario = { id: 1, isDeleted: false } as Usuario;
    const reserva = null;
    const overlappingPrestamos = [];
    const overlappingReservas = [];

    jest.spyOn(librosRepository, 'findOne').mockResolvedValue(libro);
    jest.spyOn(usuariosRepository, 'findOne').mockResolvedValue(usuario);
    jest.spyOn(prestamosRepository, 'find').mockResolvedValue(overlappingPrestamos);
    jest.spyOn(reservasRepository, 'findOne').mockResolvedValue(reserva);
    jest.spyOn(reservasRepository, 'find').mockResolvedValue(overlappingReservas);
    
   
    jest.spyOn(prestamosRepository, 'save').mockResolvedValue({
      id: 1,
      libro: libro,
      usuario: usuario,
      reserva: reserva,
      fechaPrestamo: createPrestamoDto.fechaPrestamo,
      fechaDevolucion: createPrestamoDto.fechaDevolucion,
      isDeleted: false,
    } as Prestamo);

    jest.spyOn(librosRepository, 'save').mockResolvedValue(libro);

    const result = await service.create(createPrestamoDto, usuarioAutenticado);

    expect(result).toBeDefined();
    expect(result.message).toBe('Préstamo creado exitosamente.');
  });
});
