import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}
  /**
   * Generate access and refresh tokens with payload containing userId, email, and role
   * @param userId User ID
   * @param email User's email
   * @param role User's role (parent, staff, admin, etc)
   * @returns Object containing access and refresh tokens
   */
  generateTokens(
    userId: string,
    email: string,
    role: string,
  ): { accessToken: string; refreshToken: string } {
    const payload = { sub: userId, email, role };

    // Create access token (default expiration from JWT module config)
    const accessToken = this.jwtService.sign(payload);

    // Create refresh token with longer expiration
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate only an access token
   * @param userId User ID
   * @param email User's email
   * @param role User's role
   * @returns Access token string
   */
  generateAccessToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }

  /**
   * Generate only a refresh token
   * @param userId User ID
   * @param email User's email
   * @param role User's role
   * @returns Refresh token string
   */
  generateRefreshToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  /**
   * Verify and decode a JWT token
   * @param token JWT token to verify
   * @returns Decoded token payload or null if invalid
   */
  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate a reset password token (valid for 10 minutes)
   * @param email User's email
   * @returns Reset token string
   */
  generateResetToken(email: string): string {
    const payload = { email };
    return this.jwtService.sign(payload, { expiresIn: '10m' });
  }

  /**
   * Verify a reset password token
   * @param token Reset token
   * @returns Decoded payload if valid, throws error if invalid/expired
   */
  verifyResetToken(token: string): any {
    return this.jwtService.verify(token);
  }
}
