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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PaginationDto } from '../shared/interfaces/pagination.dto';
import { Public } from 'src/auth/decorators/public.decorator';

/**
 * Controller handling blog-related routes.
 *
 * Provides endpoints for creating, reading, updating, and deleting blog posts.
 * Additionally supports querying blogs with various filters.
 */
@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly service: BlogsService) {}

  /**
   * Creates a new blog post.
   *
   * Requires authentication to create a blog post.
   *
   * @param createDto The DTO containing the data for the new blog post.
   * @returns The created blog post.
   */
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new blog post' })
  create(@Body() createDto: CreateBlogDto) {
    return this.service.create(createDto);
  }

  /**
   * Retrieves a list of blog posts with optional filters for category, keyword,
   * active status, and featured status.
   *
   * This endpoint is public and does not require authentication.
   *
   * @param pagination The pagination parameters (pageIndex, pageSize).
   * @param blogCategoryId (Optional) The category ID to filter the blogs.
   * @param keyword (Optional) The keyword to search for in the blog title or content.
   * @param isActive (Optional) The active status of the blogs.
   * @param isFeatured (Optional) The featured status of the blogs.
   * @returns A list of blog posts matching the filters and pagination details.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all blog posts with filters' })
  @ApiQuery({ name: 'blogCategoryId', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'isFeatured', required: false })
  findAll(
    @Query() pagination: PaginationDto,
    @Query('blogCategoryId') blogCategoryId?: string,
    @Query('keyword') keyword?: string,
    @Query('isActive') isActive?: string,
    @Query('isFeatured') isFeatured?: string,
  ) {
    return this.service.findAllWithFilters({
      blogCategoryId,
      keyword,
      isActive,
      isFeatured,
      ...pagination,
    });
  }

  /**
   * Retrieves a lightweight list of blog posts for lookup purposes.
   * Excludes content and tags fields for better performance.
   *
   * This endpoint is public and does not require authentication.
   *
   * @param pagination The pagination parameters (pageIndex, pageSize).
   * @param blogCategoryId (Optional) The category ID to filter the blogs.
   * @param keyword (Optional) The keyword to search for in the blog title.
   * @param isActive (Optional) The active status of the blogs.
   * @param isFeatured (Optional) The featured status of the blogs.
   * @returns A list of blog posts with limited fields matching the filters and pagination details.
   */
  @Public()
  @Get('lookups')
  @ApiOperation({ summary: 'Get blog lookups with limited fields' })
  @ApiQuery({ name: 'blogCategoryId', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'isFeatured', required: false })
  getLookups(
    @Query() pagination: PaginationDto,
    @Query('blogCategoryId') blogCategoryId?: string,
    @Query('keyword') keyword?: string,
    @Query('isActive') isActive?: string,
    @Query('isFeatured') isFeatured?: string,
  ) {
    return this.service.findLookupsWithFilters({
      blogCategoryId,
      keyword,
      isActive,
      isFeatured,
      ...pagination,
    });
  }

  /**
   * Retrieves a single blog post by its ID.
   *
   * This endpoint is public and does not require authentication.
   *
   * @param id The ID of the blog post to retrieve.
   * @returns The requested blog post.
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get single blog post' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Updates an existing blog post.
   *
   * Requires authentication to update a blog post.
   *
   * @param id The ID of the blog post to update.
   * @param updateDto The DTO containing the updated data for the blog post.
   * @returns The updated blog post.
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update blog post' })
  update(@Param('id') id: string, @Body() updateDto: UpdateBlogDto) {
    return this.service.update(id, updateDto);
  }

  /**
   * Deletes a blog post by its ID.
   *
   * Requires authentication to delete a blog post.
   *
   * @param id The ID of the blog post to delete.
   * @returns The deleted blog post.
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete blog post' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
