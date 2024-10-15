import { Test, TestingModule } from '@nestjs/testing';
import { LibrosService } from '@libros/libros.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Libro } from '@libros/libro.entity';
import { Repository } from 'typeorm';
import { CreateLibroDTO } from '@libros/dto/create-libro.dto';
import { Usuario, Rol } from '@usuarios/usuario.entity';
import { JwtPayload } from '@auth/jwt-payload.interface';
import { ForbiddenException, ConflictException } from '@nestjs/common';
import { Direccion } from '@usuarios/interfaces/direccion.interface';

const mockLibroRepository = () => ({
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  }),
});

const mockUsuarioRepository = () => ({
  findOne: jest.fn(),
});

describe('LibrosService', () => {
  let service: LibrosService;
  let libroRepository: jest.Mocked<Repository<Libro>>;
  let usuarioRepository: jest.Mocked<Repository<Usuario>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibrosService,
        {
          provide: getRepositoryToken(Libro),
          useFactory: mockLibroRepository,
        },
        {
          provide: getRepositoryToken(Usuario),
          useFactory: mockUsuarioRepository,
        },
      ],
    }).compile();

    service = module.get<LibrosService>(LibrosService);
    libroRepository = module.get<Repository<Libro>>(getRepositoryToken(Libro)) as jest.Mocked<Repository<Libro>>;
    usuarioRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario)) as jest.Mocked<Repository<Usuario>>;
  });

  describe('Método create', () => {
    const createLibroDto: CreateLibroDTO = {
      titulo: 'Test',
      autor: 'Autor',
      nacionalidadAutor: 'País',
      tematica: 'Temática',
      anioPublicacion: 2021,
      extracto: 'Un extracto del libro.',
      editorial: 'Editorial de Prueba',
      disponible: true,
    };

    const usuarioAutenticado: JwtPayload = {
      sub: 1,
      nombreUsuario: 'some-username',
    };

    it('debería crear un nuevo libro', async () => {
      const usuarioAutenticadoBD: Usuario = {
        id: 1,
        nombre: 'Usuario',
        email: 'usuario@example.com',
        nombreUsuario: 'some-username',
        password: 'password',
        edad: 30,
        carreraOProfesion: 'Profesión',
        direccion: {
          calle: 'Calle Principal',
          numero: '123',
          ciudad: 'Ciudad',
          provincia: 'Provincia',
          pais: 'País',
        },
        isDeleted: false,
        rol: Rol.DIRECTOR,
        reservas: [],
        prestamos: [],
      };

      const libro: Libro = {
        ...createLibroDto,
        id: 1,
        isDeleted: false,
        reservas: [],
        prestamos: [],
      };

      usuarioRepository.findOne.mockResolvedValue(usuarioAutenticadoBD);
      libroRepository.create.mockReturnValue(libro);
      libroRepository.save.mockResolvedValue(libro);
      libroRepository.findOne.mockResolvedValue(undefined); // Para el caso de libro no existente

      const result = await service.create(createLibroDto, usuarioAutenticado);
      expect(result).toEqual(libro);
      expect(libroRepository.create).toHaveBeenCalledWith(createLibroDto);
      expect(libroRepository.save).toHaveBeenCalledWith(libro);
    });

    it('debería fallar al crear un libro si el usuario no está en la base de datos', async () => {
      usuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createLibroDto, usuarioAutenticado)).rejects.toThrow(ForbiddenException);
    });

    it('debería fallar al crear un libro si el libro ya existe', async () => {
      const existingLibro: Libro = {
        id: 1,
        ...createLibroDto,
        isDeleted: false,
        reservas: [],
        prestamos: [],
      };

      usuarioRepository.findOne.mockResolvedValue({
        id: 1,
        nombre: 'Usuario',
        email: 'usuario@example.com',
        nombreUsuario: 'some-username',
        password: 'password',
        edad: 30,
        carreraOProfesion: 'Profesión',
        direccion: {
          calle: 'Calle Principal',
          numero: '123',
          ciudad: 'Ciudad',
          provincia: 'Provincia',
          pais: 'País',
        },
        isDeleted: false,
        rol: Rol.DIRECTOR,
        reservas: [],
        prestamos: [],
      });
      libroRepository.findOne.mockResolvedValue(existingLibro);

      await expect(service.create(createLibroDto, usuarioAutenticado)).rejects.toThrow(ConflictException);
    });

    it('debería fallar si el usuario no tiene permisos especiales', async () => {
      usuarioRepository.findOne.mockResolvedValue({
        id: 1,
        nombre: 'Usuario',
        email: 'usuario@example.com',
        nombreUsuario: 'some-username',
        password: 'password',
        edad: 30,
        carreraOProfesion: 'Profesión',
        direccion: {
          calle: 'Calle Principal',
          numero: '123',
          ciudad: 'Ciudad',
          provincia: 'Provincia',
          pais: 'País',
        },
        isDeleted: false,
        rol: Rol.USUARIO,
        reservas: [],
        prestamos: [],
      });

      await expect(service.create(createLibroDto, usuarioAutenticado)).rejects.toThrow(ForbiddenException);
    });
  });
});
