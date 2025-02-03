import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogFilterDto } from './dto/blog-filter.dto';

/**
 * Interface representing the possible conditions for querying blogs.
 *
 * Includes fields for filtering by blog category, active status, featured status, and
 * full-text search on title and content.
 */
interface BlogConditions {
  blogCategoryId?: Types.ObjectId;
  $or?: Array<{ [key: string]: any }>;
  isActive?: boolean;
  isFeatured?: boolean;
}

/**
 * Service for managing blogs.
 *
 * This service provides methods for creating, retrieving, updating, and deleting blog.
 * It also supports pagination for listing blogs.
 */
@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  /**
   * Creates a new blog post in the database.
   *
   * @param {CreateBlogDto} createDto - The DTO containing the data for the new blog post.
   * @returns {Promise<Blog>} - The created Blog document.
   */
  async create(createDto: CreateBlogDto): Promise<Blog> {
    return this.blogModel.create({
      ...createDto,
      blogCategoryId: new Types.ObjectId(createDto.blogCategoryId),
    });
  }

  /**
   * Finds all blog posts with optional filters for category, active status, featured status, and keyword search.
   *
   * @param {BlogFilterDto} filter - The DTO containing the filtering criteria.
   * @returns {Promise<{ data: Blog[]; count: number }>} - An object containing the filtered list of blogs and the total count of matching blogs.
   */
  async findAllWithFilters(
    filter: BlogFilterDto,
  ): Promise<{ data: Blog[]; count: number }> {
    const conditions: BlogConditions = {};

    if (filter.blogCategoryId) {
      conditions.blogCategoryId = new Types.ObjectId(filter.blogCategoryId);
    }

    if (filter.keyword) {
      conditions.$or = [
        { title: { $regex: filter.keyword, $options: 'i' } },
        { content: { $regex: filter.keyword, $options: 'i' } },
      ];
    }

    if (filter.isActive !== undefined) {
      conditions.isActive = filter.isActive === 'true';
    }

    if (filter.isFeatured !== undefined) {
      conditions.isFeatured = filter.isFeatured === 'true';
    }

    const [data, count] = await Promise.all([
      this.blogModel
        .find(conditions)
        .skip((filter.pageIndex - 1) * filter.pageSize)
        .limit(filter.pageSize)
        .exec(),
      this.blogModel.countDocuments(conditions).exec(),
    ]);

    return { data, count };
  }

  /**
   * Retrieves a single blog post by its ID.
   *
   * @param {string} id - The ID of the blog post to retrieve.
   * @returns {Promise<Blog | null>} - The Blog document, or null if not found.
   */
  async findOne(id: string): Promise<Blog | null> {
    return this.blogModel.findById(id).exec();
  }

  /**
   * Updates an existing blog post in the database.
   *
   * @param {string} id - The ID of the blog post to update.
   * @param {UpdateBlogDto} updateDto - The DTO containing the updated data for the blog post.
   * @returns {Promise<Blog | null>} - The updated Blog document.
   */
  async update(id: string, updateDto: UpdateBlogDto): Promise<Blog | null> {
    return this.blogModel
      .findByIdAndUpdate(
        id,
        {
          ...updateDto,
          ...(updateDto.blogCategoryId && {
            blogCategoryId: new Types.ObjectId(updateDto.blogCategoryId),
          }),
        },
        { new: true },
      )
      .exec();
  }

  /**
   * Deletes a blog post from the database.
   *
   * @param {string} id - The ID of the blog post to delete.
   * @returns {Promise<Blog | null>} - The deleted Blog document.
   */
  async remove(id: string): Promise<Blog | null> {
    return this.blogModel.findByIdAndDelete(id).exec();
  }
}
