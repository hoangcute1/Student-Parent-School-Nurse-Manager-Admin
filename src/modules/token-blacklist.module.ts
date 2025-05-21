import { Module, Global } from '@nestjs/common';
import { TokenBlacklistService } from '../services/token-blacklist.service';

@Global() // Make this service globally available
@Module({
  providers: [TokenBlacklistService],
  exports: [TokenBlacklistService],
})
export class TokenBlacklistModule {}
