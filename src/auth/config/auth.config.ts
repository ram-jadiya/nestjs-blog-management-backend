import { registerAs } from '@nestjs/config';

/**
 * Authentication configuration module.
 *
 * This module provides environment-based configuration for JWT authentication,
 * including secret keys and token expiration times.
 */
export default registerAs('auth', () => ({
  secret: process.env.JWT_SECRET,
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '1d',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
