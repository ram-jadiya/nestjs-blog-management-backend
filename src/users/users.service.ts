import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

/**
 * Service for managing users in the authentication system.
 *
 * Provides methods to create, find, and update users in the database.
 */
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Creates a new user in the database.
   *
   * @param {Object} createUserDto - Data Transfer Object containing user details.
   * @param {string} createUserDto.email - The email of the new user.
   * @param {string} createUserDto.password - The hashed password of the new user.
   * @returns {Promise<User>} The created user document.
   */
  async create(createUserDto: {
    email: string;
    password: string;
  }): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  /**
   * Finds a user by email.
   *
   * @param {string} email - The email of the user to find.
   * @returns {Promise<User | null>} The found user or null if not found.
   */
  async findOne(email: string): Promise<User | undefined | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Updates a user's refresh token.
   *
   * @param {string} email - The email of the user.
   * @param {string} refreshToken - The new refresh token.
   * @returns {Promise<void>}
   */
  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.userModel.updateOne({ email }, { refreshToken }).exec();
  }

  /**
   * Removes a user's refresh token (used for logout).
   *
   * @param {string} email - The email of the user.
   * @returns {Promise<void>}
   */
  async removeRefreshToken(email: string): Promise<void> {
    await this.userModel.updateOne({ email }, { refreshToken: null }).exec();
  }
}
