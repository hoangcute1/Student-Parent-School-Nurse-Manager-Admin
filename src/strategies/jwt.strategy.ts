import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { TokenBlacklistService } from '../services/token-blacklist.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import configuration from '@/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private tokenBlacklistService: TokenBlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().JWT_SECRET,
      passReqToCallback: true, // Pass the request to the validate method
    } as StrategyOptionsWithRequest);
  }

  async validate(req: Request, payload: any) {
    // Extract token from the authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // Check if token is blacklisted
    if (token && (await this.tokenBlacklistService.isBlacklisted(token))) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return {
      user: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
