/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * AuthGuard is a custom route guard that checks if a user is authorized to access a route.
 * It verifies the JWT token passed in the request header and checks for the presence of the `isPublic` metadata.
 *
 * Routes marked as public are exempt from authentication.
 *
 * @implements {CanActivate}
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  /**
   * Determines whether the request is authorized to access the route.
   *
   * If the route is marked as public, the request is allowed to proceed without authorization.
   * Otherwise, the JWT token is verified and the user is extracted from the token payload.
   *
   * @param {ExecutionContext} context - The execution context that holds information about the current request.
   * @returns {Promise<boolean>} - Returns `true` if the request is authorized, `false` otherwise.
   * @throws {UnauthorizedException} - Throws an exception if the token is missing or invalid.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  /**
   * Extracts the JWT token from the `Authorization` header in the request.
   *
   * The token must be in the format `Bearer <token>`.
   *
   * @param {Request} request - The HTTP request object.
   * @returns {string | undefined} - The extracted token or `undefined` if no valid token is found.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
