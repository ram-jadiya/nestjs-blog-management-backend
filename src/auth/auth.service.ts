import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    public jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Validates a user's credentials.
   * @param {string} email - The email of the user.
   * @param {string} pass - The plaintext password of the user.
   * @returns {Promise<User | null>} - Returns the user object if credentials are valid, otherwise null.
   */
  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * Generates an access token for an authenticated user.
   * @param {User} user - The authenticated user.
   * @returns {Promise<{ access_token: string }>} - Returns an object containing the JWT access token.
   */
  async login(user: User) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Generates a refresh token for a user.
   * @param {User} user - The authenticated user.
   * @returns {Promise<string>} - Returns a JWT refresh token.
   */
  async getRefreshToken(user: User) {
    const payload = { sub: user._id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.secret'),
      expiresIn: this.configService.get<string>('auth.refreshExpiration'),
    });
  }

  /**
   * Stores the refresh token for a user.
   * @param {string} userId - The ID of the user.
   * @param {string} refreshToken - The refresh token to be stored.
   * @returns {Promise<void>} - Returns a promise that resolves when the operation is complete.
   */
  async setRefreshToken(userId: string, refreshToken: string) {
    await this.usersService.updateRefreshToken(userId, refreshToken);
  }
}
