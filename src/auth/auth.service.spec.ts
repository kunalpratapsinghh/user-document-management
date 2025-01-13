import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUserModel = {
    findOne: jest.fn(),
    updateOne: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockAccessToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken('User'), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should validate the user and return tokens', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const user = { email: 'test@example.com', password: 'hashedPassword', role: 'viewer' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      const result = await authService.login(dto);
      expect(authService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: user.email, role: user.role });
      expect(result).toEqual({
        access_token: 'mockAccessToken',
        refresh_token: expect.any(String)
      });
    });
  });
});
