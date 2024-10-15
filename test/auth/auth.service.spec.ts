import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@auth/auth.service';
import { UsuariosService } from '@usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '@usuarios/dto/login.dto';
import { RegisterDto } from '@usuarios/dto/register.dto';
import { Usuario, Rol } from '@usuarios/usuario.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usuariosService: UsuariosService;
  let jwtService: JwtService;

  const mockUsuariosService = {
    findUserByUsername: jest.fn(),
    register: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuariosService, useValue: mockUsuariosService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usuariosService = module.get<UsuariosService>(UsuariosService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('debería iniciar sesión correctamente', async () => {
      const loginDto: LoginDto = {
        nombreUsuario: 'testuser',
        password: 'testpass',
      };
  
      const hashedPassword = await bcrypt.hash('testpass', 10);
  
      const usuario: Usuario = {
        id: 1,
        nombre: 'Test User',
        nombreUsuario: 'testuser',
        email: 'testuser@example.com',
        password: hashedPassword,
        edad: 30,
        carreraOProfesion: 'Developer',
        direccion: {
          calle: 'Test Street',
          numero: '123',
          ciudad: 'Test City',
          provincia: 'Test Province',
          pais: 'Test Country',
        },
        isDeleted: false,
        rol: Rol.USUARIO,
        reservas: [],
        prestamos: [],
      };
  
      mockUsuariosService.findUserByUsername.mockResolvedValue(usuario);
      mockJwtService.sign.mockReturnValue('testtoken');
  
      const result = await authService.login(loginDto);
  
      expect(result).toEqual({
        message: 'Usuario logueado exitosamente',
        access_token: 'testtoken',
      });
    });
  });
  
  describe('register', () => {
    it('debería registrar a un nuevo usuario correctamente', async () => {
      const registerDto: RegisterDto = {
        nombre: 'Valeria Simon',
        nombreUsuario: 'simon',
        email: 'simon@gmail.com',
        password: 'simon',
        edad: 55,
        carreraOProfesion: 'Abogada',
        direccion: {
          calle: 'Carlos Casares',
          numero: '456',
          ciudad: 'Castelar',
          provincia: 'Buenos Aires',
          pais: 'Argentina',
        },
        rol: Rol.USUARIO,
      };

      const registeredUser = {
        id: 27,
        nombre: registerDto.nombre,
        nombreUsuario: registerDto.nombreUsuario,
        email: registerDto.email,
        edad: registerDto.edad,
        carreraOProfesion: registerDto.carreraOProfesion,
        direccion: registerDto.direccion,
        isDeleted: false,
        rol: registerDto.rol,
      };

      mockUsuariosService.register.mockResolvedValue({
        usuario: registeredUser,
        message: 'Usuario registrado exitosamente',
      });

      const result = await authService.register(registerDto);

      // Imprime los datos para depuración
      console.log('Datos de usuario registrados:', registeredUser);
      console.log('Resultado de la llamada a register:', result);

      // Agrega un console.log para ver el resultado de la comparación
      console.log('Resultado esperado:', {
        message: 'Usuario registrado exitosamente',
        usuario: registeredUser,
      });

      expect(result).toEqual({
        message: 'Usuario registrado exitosamente',
        usuario: registeredUser,
      });
    });
  });
});

