import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@/services/auth.service';
import { AuthController } from '@/controllers/auth.controller';
import { UserModule } from './user.module';
import { ProfileModule } from './profile.module';
import { TokenBlacklistModule } from './token-blacklist.module';
import { JwtStrategy } from '@/strategies/jwt.strategy';
import { LocalStrategy } from '@/strategies/local.strategy';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ParentModule } from './parent.module';
import { StaffModule } from './staff.module';

@Module({  imports: [
    UserModule,
    ProfileModule,
    TokenBlacklistModule,
    PassportModule,
    ConfigModule,
    ParentModule,
    StaffModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
