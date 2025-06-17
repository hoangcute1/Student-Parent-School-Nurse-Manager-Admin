import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@/services/auth.service';
import { AuthController } from '@/controllers/auth.controller';
import { UserModule } from './user.module';
import { ProfileModule } from './profile.module';
import { TokenBlacklistModule } from './token-blacklist.module';
import { OtpModule } from './otp.module';
import { JwtStrategy } from '@/strategies/jwt.strategy';
import { LocalStrategy } from '@/strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ParentModule } from './parent.module';
import { StaffModule } from './staff.module';
import { AdminModule } from './admin.module';
import { TokenModule } from './token.module';
import configuration from '@/configuration';

@Module({
  imports: [
    UserModule,
    ProfileModule,
    TokenBlacklistModule,
    PassportModule,
    ConfigModule,
    ParentModule,
    StaffModule,
    AdminModule,
    OtpModule,
    TokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: configuration().JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
