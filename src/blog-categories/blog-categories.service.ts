import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BlogCategory } from './schemas/blog-category.schema';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { BlogCategoryFilterDto } from './dto/blog-category-filter.dto';

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
    return this.blogCategoryModel.create({
      ...createDto,
      domain: new Types.ObjectId(createDto.domainId),
    });
  }

  /**
   * Retrieves all blog categories with optional filters for domain url search.
   *
   * @param {BlogFilterDto} filter - The DTO containing the filtering criteria.
   * @returns {Promise<{ data: BlogCategory[]; count: number }>} - An object containing the list of blog categories and the total count.
   */
  async findAll(
    filter: BlogCategoryFilterDto,
  ): Promise<{ data: BlogCategory[]; count: number }> {
    const conditions = {};

    // Fetch domain ID based on domainUrl if provided
    if (filter.domainUrl) {
      const domain = await this.blogCategoryModel.db
        .collection('domains')
        .findOne({ url: filter.domainUrl });

      if (domain) {
        conditions['domain'] = new Types.ObjectId(domain._id);
      } else {
        return { data: [], count: 0 }; // No blog categories found for the given domain
      }
    }
    const [data, count] = await Promise.all([
      this.blogCategoryModel
        .find(conditions)
        .populate('domain', '-__v -createdAt -updatedAt -isActive')
        .skip((filter.pageIndex - 1) * filter.pageSize)
        .limit(filter.pageSize)
        .exec(),
      this.blogCategoryModel.countDocuments(conditions).exec(),
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
