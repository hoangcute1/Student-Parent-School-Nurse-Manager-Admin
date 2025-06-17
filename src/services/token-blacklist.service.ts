import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private readonly blacklist: Set<string> = new Set();
  private readonly expirationTimes: Map<string, number> = new Map();

  // Add a token to the blacklist
  blacklistToken(token: string, expiresIn: number) {
    const expirationTime = Date.now() + expiresIn * 1000;
    this.blacklist.add(token);
    this.expirationTimes.set(token, expirationTime);

    // Schedule cleanup for this token
    setTimeout(() => {
      this.blacklist.delete(token);
      this.expirationTimes.delete(token);
    }, expiresIn * 1000);
  }

  // Check if a token is blacklisted
  isBlacklisted(token: string): Promise<boolean> {
    return Promise.resolve(this.blacklist.has(token));
  }

  // Clean up expired tokens
  cleanupExpiredTokens() {
    const now = Date.now();
    for (const [token, expirationTime] of this.expirationTimes.entries()) {
      if (expirationTime <= now) {
        this.blacklist.delete(token);
        this.expirationTimes.delete(token);
      }
    }
  }
}
