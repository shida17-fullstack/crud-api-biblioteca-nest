import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from '@usuarios/usuarios.controller';
import { UsuariosService } from '@usuarios/usuarios.service';
import { 
  ConflictException, 
  NotFoundException, 
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { RegisterDto } from '@usuarios/dto/register.dto';
import { LoginDto } from '@usuarios/dto/login.dto';
import { UpdateDto } from '@usuarios/dto/update.dto';
import { Usuario, Rol } from '@usuarios/usuario.entity'; 
import { Request } from 'express';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

  const mockUsuariosService = {
    register: jest.fn(),
    login: jest.fn(),
    findUserByUsername: jest.fn(),
    findUserById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get<UsuariosService>(UsuariosService);
  });

  describe('register', () => {
    it('debería registrar un usuario exitosamente', async () => {
      const registerDto: RegisterDto = {
        nombre: "Valeria Simon",
        nombreUsuario: "simon",
        email: "simon@gmail.com",
        password: "simon",
        edad: 55,
        carreraOProfesion: "Abogada",
        direccion: {
          calle: "Carlos Casares",
          numero: "456",
          ciudad: "Castelar",
          provincia: "Buenos Aires",
          pais: "Argentina"
        },
        rol: Rol.USUARIO 
      };
      
      const result = {
        usuario: {
          id: 27,
          nombre: "Valeria Simon",
          nombreUsuario: "simon",
          email: "simon@gmail.com",
          edad: 55,
          carreraOProfesion: "Abogada",
          direccion: {
            calle: "Carlos Casares",
            numero: "456",
            ciudad: "Castelar",
            provincia: "Buenos Aires",
            pais: "Argentina"
          },
          isDeleted: false,
          rol: Rol.USUARIO, 
          reservas: [], 
          prestamos: [],
          password: 'hashedPassword' 
        },
        message: "Usuario registrado exitosamente"
      };

      jest.spyOn(service, 'register').mockResolvedValue(result);

      expect(await controller.register(registerDto)).toEqual(result);
    });

    it('debería manejar conflictos y solicitudes incorrectas', async () => {
      const registerDto: RegisterDto = {
        nombre: 'test',
        email: 'test@example.com',
        edad: 25,
        carreraOProfesion: 'Engineer',
        nombreUsuario: 'testUser',
        password: 'test123',
        direccion: {
          calle: '123 Main St',
          numero: '1A',
          ciudad: 'Buenos Aires',
          provincia: 'CABA',
          pais: 'Argentina',
        },
        rol: Rol.USUARIO 
      };

      jest.spyOn(service, 'register').mockRejectedValue(new ForbiddenException('El usuario ya existe'));
      await expect(controller.register(registerDto)).rejects.toThrow(ConflictException);

      jest.spyOn(service, 'register').mockRejectedValue(new Error());
      await expect(controller.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('debería iniciar sesión de un usuario exitosamente', async () => {
      const loginDto: LoginDto = {
        nombreUsuario: 'testUser',
        password: 'test123',
      };
      const result = {
        usuario: {
          id: 1,
          nombre: 'test',
          email: 'test@example.com',
          edad: 25,
          carreraOProfesion: 'Engineer',
          nombreUsuario: 'testUser',
          direccion: {
            calle: '123 Main St',
            numero: '1A',
            ciudad: 'Buenos Aires',
            provincia: 'CABA',
            pais: 'Argentina',
          },
          rol: Rol.USUARIO, 
          isDeleted: false,
          reservas: [],
          prestamos: []
        },
        message: 'Inicio de sesión exitoso',
      };

      jest.spyOn(service, 'login').mockResolvedValue(result);

      expect(await controller.login(loginDto)).toEqual(result);
    });

    it('debería manejar errores de inicio de sesión', async () => {
      const loginDto: LoginDto = {
        nombreUsuario: 'testUser',
        password: 'test123',
      };

      jest.spyOn(service, 'login').mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.login(loginDto)).rejects.toThrow(NotFoundException);

      jest.spyOn(service, 'login').mockRejectedValue(new BadRequestException('Error en la solicitud'));
      await expect(controller.login(loginDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateUsuario', () => {
    it('debería actualizar un usuario exitosamente', async () => {
      const id = 1;
      const updateDto: UpdateDto = {
        nombre: 'updatedName',
        email: 'updated@example.com',
        edad: 30,
        carreraOProfesion: 'Updated Engineer',
        nombreUsuario: 'updatedUser',
        direccion: {
          calle: '456 Main St',
          numero: '2B',
          ciudad: 'Rosario',
          provincia: 'Santa Fe',
          pais: 'Argentina',
        },
      };
  
      const result = {
        usuario: {
          id: 1,
          nombre: 'updatedName',
          email: 'updated@example.com',
          edad: 30,
          carreraOProfesion: 'Updated Engineer',
          nombreUsuario: 'updatedUser',
          direccion: updateDto.direccion,
          rol: Rol.USUARIO, // Usa Rol.USUARIO aquí
          isDeleted: false,
          reservas: [],
          prestamos: [],
          password: 'hashedPassword' 
        },
        message: 'Usuario actualizado con éxito',
      };

      // Mock del método de servicio
      jest.spyOn(service, 'update').mockResolvedValue(result);

      // Aquí se llama al controlador con el método correcto
      expect(await controller.updateUsuario(id, updateDto, { user: { nombreUsuario: 'updatedUser' } as any } as Request)).toEqual(result);
    });
  
    it('debería manejar errores de actualización', async () => {
      const id = 1;
      const updateDto: UpdateDto = {
        nombre: 'updatedName',
        email: 'updated@example.com',
        edad: 30,
        carreraOProfesion: 'Updated Engineer',
        nombreUsuario: 'updatedUser',
        direccion: {
          calle: '456 Main St',
          numero: '2B',
          ciudad: 'Rosario',
          provincia: 'Santa Fe',
          pais: 'Argentina',
        },
      };

      // Mock del método de servicio
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException('Usuario no encontrado'));
      await expect(controller.updateUsuario(id, updateDto, { user: { nombreUsuario: 'updatedUser' } as any } as Request)).rejects.toThrow(NotFoundException);
  
      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException('Error en la solicitud'));
      await expect(controller.updateUsuario(id, updateDto, { user: { nombreUsuario: 'updatedUser' } as any } as Request)).rejects.toThrow(BadRequestException);
    });
  });
});
