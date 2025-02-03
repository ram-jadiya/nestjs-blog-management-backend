import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogCategory } from './schemas/blog-category.schema';
import { PaginationDto } from '../shared/interfaces/pagination.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';

/**
 * Service for managing blog categories.
 *
 * This service provides methods for creating, retrieving, updating, and deleting blog categories.
 * It also supports pagination for listing blog categories.
 */
@Injectable()
export class BlogCategoriesService {
  constructor(
    @InjectModel(BlogCategory.name)
    private blogCategoryModel: Model<BlogCategory>,
  ) {}

  /**
   * Creates a new blog category.
   *
   * @param {CreateBlogCategoryDto} createDto - The DTO containing the data for the new blog category.
   * @returns {Promise<BlogCategory>} - The created blog category.
   */
  async create(createDto: CreateBlogCategoryDto): Promise<BlogCategory> {
    return this.blogCategoryModel.create(createDto);
  }

  /**
   * Retrieves all blog categories with pagination.
   *
   * @param {PaginationDto} pagination - The pagination parameters to control the results.
   * @returns {Promise<{ data: BlogCategory[]; count: number }>} - An object containing the list of blog categories and the total count.
   */
  async findAll(
    pagination: PaginationDto,
  ): Promise<{ data: BlogCategory[]; count: number }> {
    const [data, count] = await Promise.all([
      this.blogCategoryModel
        .find()
        .skip((pagination.pageIndex - 1) * pagination.pageSize)
        .limit(pagination.pageSize)
        .exec(),
      this.blogCategoryModel.countDocuments().exec(),
    ]);

    return { data, count };
  }

  /**
   * Retrieves a single blog category by its ID.
   *
   * @param {string} id - The ID of the blog category to retrieve.
   * @returns {Promise<BlogCategory | null>} - The requested blog category or `null` if not found.
   */
  async findOne(id: string): Promise<BlogCategory | null> {
    return this.blogCategoryModel.findById(id).exec();
  }

  /**
   * Updates an existing blog category by its ID.
   *
   * @param {string} id - The ID of the blog category to update.
   * @param {UpdateBlogCategoryDto} updateDto - The DTO containing the updated data for the blog category.
   * @returns {Promise<BlogCategory | null>} - The updated blog category.
   */
  async update(
    id: string,
    updateDto: UpdateBlogCategoryDto,
  ): Promise<BlogCategory | null> {
    return this.blogCategoryModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  /**
   * Deletes a blog category by its ID.
   *
   * @param {string} id - The ID of the blog category to delete.
   * @returns {Promise<BlogCategory | null>} - The deleted blog category or `null` if not found.
   */
  async remove(id: string): Promise<BlogCategory | null> {
    return this.blogCategoryModel.findByIdAndDelete(id).exec();
  }
}
