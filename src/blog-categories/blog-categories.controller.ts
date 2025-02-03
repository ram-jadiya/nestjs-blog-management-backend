import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BlogCategoriesService } from './blog-categories.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { PaginationDto } from '../shared/interfaces/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { BlogCategory } from './schemas/blog-category.schema';

/**
 * Controller for managing blog categories.
 *
 * This controller defines the routes for CRUD operations on blog categories.
 * It includes routes for creating, reading, updating, and deleting blog categories,
 * as well as retrieving a paginated list of categories. Some routes are protected
 * by the `AuthGuard` to ensure authentication, while others are publicly accessible.
 *
 * @ApiTags('Blog Categories') - This is the Swagger tag for grouping these endpoints under "Blog Categories".
 * @ApiBearerAuth('JWT-auth') - Specifies that these routes are protected by JWT authentication.
 */
@ApiTags('Blog Categories')
@Controller('blog-categories')
export class BlogCategoriesController {
  constructor(private readonly service: BlogCategoriesService) {}

  /**
   * Creates a new blog category.
   * This route is protected by the `AuthGuard`, requiring JWT authentication.
   *
   * @param {CreateBlogCategoryDto} createDto - The DTO containing data for the new blog category.
   * @returns {Promise<BlogCategory>} - The result of creating the blog category.
   */
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new blog category' })
  create(@Body() createDto: CreateBlogCategoryDto): Promise<BlogCategory> {
    return this.service.create(createDto);
  }

  /**
   * Retrieves all blog categories with optional pagination.
   * This route is publicly accessible.
   *
   * @param {PaginationDto} pagination - The pagination parameters to control the results.
   * @returns {Promise<{data: BlogCategory[]; count: number}>} - A paginated list of blog categories.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all blog categories' })
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<{ data: BlogCategory[]; count: number }> {
    return this.service.findAll(pagination);
  }

  /**
   * Retrieves a single blog category by its ID.
   * This route is publicly accessible.
   *
   * @param {string} id - The ID of the blog category to retrieve.
   * @returns {Promise<BlogCategory | null>} - The requested blog category.
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get single blog category' })
  findOne(@Param('id') id: string): Promise<BlogCategory | null> {
    return this.service.findOne(id);
  }

  /**
   * Updates an existing blog category by its ID.
   * This route is protected by the `AuthGuard`, requiring JWT authentication.
   *
   * @param {string} id - The ID of the blog category to update.
   * @param {UpdateBlogCategoryDto} updateDto - The DTO containing updated data for the category.
   * @returns {Promise<BlogCategory | null>} - The result of updating the blog category.
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update blog category' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateBlogCategoryDto,
  ): Promise<BlogCategory | null> {
    return this.service.update(id, updateDto);
  }

  /**
   * Deletes a blog category by its ID.
   * This route is protected by the `AuthGuard`, requiring JWT authentication.
   *
   * @param {string} id - The ID of the blog category to delete.
   * @returns {Promise<BlogCategory | null>} - The result of deleting the blog category.
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete blog category' })
  remove(@Param('id') id: string): Promise<BlogCategory | null> {
    return this.service.remove(id);
  }
}
