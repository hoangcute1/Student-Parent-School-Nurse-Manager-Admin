import { Module } from '@nestjs/common';
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL', 60), // Time window in seconds
          limit: config.get('THROTTLE_LIMIT', 10), // Maximum number of requests within the time window
        },
      ],
    }),
  ],
  exports: [NestThrottlerModule],
})
export class ThrottlerModule {}
