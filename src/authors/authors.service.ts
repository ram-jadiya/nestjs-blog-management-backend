import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from './schemas/author.schema';
import { PaginationDto } from '../shared/interfaces/pagination.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

/**
 * Service for managing authors.
 *
 * This service provides methods for creating, retrieving, updating, and deleting authors.
 * It also supports pagination for listing authors.
 */
@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name)
    private authorModel: Model<Author>,
  ) {}

  /**
   * Creates a new author.
   *
   * @param {CreateAuthorDto} createDto - The DTO containing the data for the new author.
   * @returns {Promise<Author>} - The created author.
   */
  async create(createDto: CreateAuthorDto): Promise<Author> {
    return this.authorModel.create(createDto);
  }

  /**
   * Retrieves all authors with pagination.
   *
   * @param {PaginationDto} pagination - The pagination parameters to control the results.
   * @returns {Promise<{ data: Author[]; count: number }>} - An object containing the list of authors and the total count.
   */
  async findAll(
    pagination: PaginationDto,
  ): Promise<{ data: Author[]; count: number }> {
    const [data, count] = await Promise.all([
      this.authorModel
        .find()
        .skip((pagination.pageIndex - 1) * pagination.pageSize)
        .limit(pagination.pageSize)
        .exec(),
      this.authorModel.countDocuments().exec(),
    ]);

    return { data, count };
  }

  /**
   * Retrieves a single author by its ID.
   *
   * @param {string} id - The ID of the author to retrieve.
   * @returns {Promise<Author | null>} - The requested author or `null` if not found.
   */
  async findOne(id: string): Promise<Author | null> {
    return this.authorModel.findById(id).exec();
  }

  /**
   * Updates an existing author by its ID.
   *
   * @param {string} id - The ID of the author to update.
   * @param {UpdateAuthorDto} updateDto - The DTO containing the updated data for the author.
   * @returns {Promise<Author | null>} - The updated author.
   */
  async update(id: string, updateDto: UpdateAuthorDto): Promise<Author | null> {
    return this.authorModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  /**
   * Deletes a author by its ID.
   *
   * @param {string} id - The ID of the author to delete.
   * @returns {Promise<Author | null>} - The deleted author or `null` if not found.
   */
  async remove(id: string): Promise<Author | null> {
    return this.authorModel.findByIdAndDelete(id).exec();
  }
}
