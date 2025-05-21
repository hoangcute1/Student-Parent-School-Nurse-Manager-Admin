import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn(),
    updateRefreshToken: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object without password if validation succeeds', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        toObject: () => ({
          _id: 'userId',
          email: 'test@example.com',
          password: 'hashedPassword',
          role: 'user',
        }),
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(result).toEqual({
        _id: 'userId',
        email: 'test@example.com',
        role: 'user',
      });
    });

    it('should return null if user is not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password');

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        toObject: () => ({
          _id: 'userId',
          email: 'test@example.com',
          password: 'hashedPassword',
          role: 'user',
        }),
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedPassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return tokens and user info', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        role: 'user',
        roleId: {
          permissions: ['read_students'],
        },
      };

      mockJwtService.sign.mockReturnValueOnce('mockAccessToken');
      mockJwtService.sign.mockReturnValueOnce('mockRefreshToken');
      mockUserService.updateRefreshToken.mockResolvedValue(mockUser);

      const result = await service.login(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(1, {
        email: 'test@example.com',
        sub: 'userId',
        role: 'user',
        permissions: ['read_students'],
      });
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        2,
        {
          email: 'test@example.com',
          sub: 'userId',
          role: 'user',
          permissions: ['read_students'],
        },
        { expiresIn: '7d' },
      );
      expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
        'userId',
        'mockRefreshToken',
      );

      expect(result).toEqual({
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
        user: {
          id: 'userId',
          email: 'test@example.com',
          role: 'user',
          permissions: ['read_students'],
        },
      });
    });

    it('should handle user without roleId', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        role: 'user',
      };

      mockJwtService.sign.mockReturnValueOnce('mockAccessToken');
      mockJwtService.sign.mockReturnValueOnce('mockRefreshToken');
      mockUserService.updateRefreshToken.mockResolvedValue(mockUser);

      const result = await service.login(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(1, {
        email: 'test@example.com',
        sub: 'userId',
        role: 'user',
        permissions: [],
      });

      expect(result.user.permissions).toEqual([]);
    });
  });

  describe('logout', () => {
    it('should call updateRefreshToken with null and return success message', async () => {
      mockUserService.updateRefreshToken.mockResolvedValue({
        refreshToken: null,
      });

      const result = await service.logout('userId');

      expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
        'userId',
        null,
      );
      expect(result).toEqual({
        success: true,
        message: 'Đăng xuất thành công',
      });
    });
  });

  describe('refreshTokens', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(
        service.refreshTokens('userId', 'refreshToken'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const mockUser = {
        refreshToken: 'differentToken',
      };
      mockUserService.findById.mockResolvedValue(mockUser);

      await expect(
        service.refreshTokens('userId', 'refreshToken'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return new access token if refresh token is valid', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        role: 'user',
        refreshToken: 'validRefreshToken',
        roleId: {
          permissions: ['read_students'],
        },
      };

      mockUserService.findById.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('newAccessToken');

      const result = await service.refreshTokens('userId', 'validRefreshToken');

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 'userId',
        role: 'user',
        permissions: ['read_students'],
      });
      expect(result).toEqual({
        access_token: 'newAccessToken',
        user: {
          id: 'userId',
          email: 'test@example.com',
          role: 'user',
        },
      });
    });
  });
});
