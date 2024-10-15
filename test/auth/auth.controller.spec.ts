import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { RegisterDto } from '@usuarios/dto/register.dto';
import { Rol } from '@usuarios/usuario.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ token: 'test-token' }),
            register: jest.fn().mockResolvedValue({ success: true }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('Debería retornar un token', async () => {
      const req = { body: { nombreUsuario: 'test', password: 'test' } };
      const result = await authController.login(req);
      expect(result).toEqual({ token: 'test-token' });
      expect(authService.login).toHaveBeenCalledWith(req.body);
    });
  });

  describe('register', () => {
    it('Debería registrar un nuevo usuario', async () => {
      const registerDto: RegisterDto = {
        nombre: 'Test User',
        nombreUsuario: 'testUser',
        email: 'test@example.com',
        password: 'testPassword',
        edad: 30,
        carreraOProfesion: 'Developer',
        direccion: {
          calle: '123 Main St',
          numero: '456',
          ciudad: 'Metropolis',
          provincia: 'Central',
          pais: 'CountryName'
        },
        rol: Rol.USUARIO, 
      };
      const result = await authController.register(registerDto);
      expect(result).toEqual({ success: true });
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});
