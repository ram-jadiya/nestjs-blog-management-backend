/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { TokenResponseDto } from './dto/token-response.dto';
import { Public } from './decorators/public.decorator';

/**
 * Authentication Controller.
 *
 * Manages user authentication, including sign-up, sign-in,
 * token refresh, and logout operations.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  /**
   * Registers a new user.
   *
   * @param {SignUpDto} signUpDto - User registration data.
   * @returns {Promise<any>} Newly created user object.
   */
  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or email already exists',
  })
  @ApiBody({ type: SignUpDto })
  async signUp(@Body() signUpDto: SignUpDto) {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    return this.usersService.create({
      email: signUpDto.email,
      password: hashedPassword,
    });
  }

  /**
   * Authenticates a user and issues an access and refresh token.
   *
   * @param {SignInDto} signInDto - User login credentials.
   * @param {Response} res - Express response object.
   * @returns {Promise<TokenResponseDto>} Access and refresh tokens.
   */
  @Public()
  @Post('signin')
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully logged in (sets refresh_token cookie)',
    headers: {
      'Set-Cookie': {
        description: 'Refresh token stored in HTTP-only cookie',
        schema: {
          type: 'string',
          example: 'refresh_token=abcde12345; Path=/; HttpOnly',
        },
      },
    },
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @ApiBody({ type: SignInDto })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      signInDto.email,
      signInDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.authService.login(user);
    const refreshToken = await this.authService.getRefreshToken(user);

    await this.usersService.updateRefreshToken(user.email, refreshToken);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      access_token: accessToken.access_token,
      refresh_token: refreshToken,
    };
  }

  /**
   * Refreshes the access token using a valid refresh token.
   *
   * @param {Response} res - Express response object.
   * @param {string} token - Refresh token from request body.
   * @returns {Promise<string>} New access token.
   * @throws {UnauthorizedException} If the refresh token is invalid or expired.
   */
  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns new access token and updates refresh token cookie',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired refresh token',
  })
  @ApiCookieAuth('refresh_token')
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Body('refresh_token') token: string,
  ) {
    try {
      const payload = this.authService.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);

      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.authService.login(user);
      const newRefreshToken = await this.authService.getRefreshToken(user);

      await this.usersService.updateRefreshToken(user.email, newRefreshToken);

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return newAccessToken;
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logs out a user by clearing the refresh token.
   *
   * @param {Response} res - Express response object.
   * @param {string} email - User email to invalidate refresh token.
   * @returns {Promise<{ message: string }>} Success message.
   */
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully logged out (clears refresh_token cookie)',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email provided',
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.usersService.removeRefreshToken(email);
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }
}
