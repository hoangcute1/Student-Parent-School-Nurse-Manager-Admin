import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract user information from JWT payload
 * Usage: @GetUser() user: { user: string, email: string, role: string }
 * Or: @GetUser('role') role: string
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user && request.user[data];
    }
    return request.user;
  },
);
