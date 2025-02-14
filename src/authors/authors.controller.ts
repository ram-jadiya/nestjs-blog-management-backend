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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PaginationDto } from '../shared/interfaces/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Author } from './schemas/author.schema';

/**
 * Controller for managing authors.
 *
 * This controller defines the routes for CRUD operations on authors.
 * It includes routes for creating, reading, updating, and deleting authors,
 * as well as retrieving a paginated list of authors. Some routes are protected
 * by the `AuthGuard` to ensure authentication, while others are publicly accessible.
 *
 * @ApiTags('Authors') - This is the Swagger tag for grouping these endpoints under "Authors".
 * @ApiBearerAuth('JWT-auth') - Specifies that these routes are protected by JWT authentication.
 */
@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly service: AuthorsService) {}

  /**
   * Creates a new author.
   * This route is protected by the `AuthGuard`, requiring JWT authentication.
   *
   * @param {CreateAuthorDto} createDto - The DTO containing data for the new author.
   * @returns {Promise<Author>} - The result of creating the author.
   */
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new author' })
  create(@Body() createDto: CreateAuthorDto): Promise<Author> {
    return this.service.create(createDto);
  }

  /**
   * Retrieves all authors with optional pagination.
   * This route is publicly accessible.
   *
   * @param {PaginationDto} pagination - The pagination parameters to control the results.
   * @returns {Promise<{data: Author[]; count: number}>} - A paginated list of authors.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<{ data: Author[]; count: number }> {
    return this.service.findAll(pagination);
  }

  /**
   * Retrieves a single author by its ID.
   * This route is publicly accessible.
   *
   * @param {string} id - The ID of the author to retrieve.
   * @returns {Promise<Author | null>} - The requested author.
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get single author' })
  findOne(@Param('id') id: string): Promise<Author | null> {
    return this.service.findOne(id);
  }

  /**
   * Updates an existing author by its ID.
   * This route is protected by the `AuthGuard`, requiring JWT authentication.
   *
   * @param {string} id - The ID of the author to update.
   * @param {UpdateAuthorDto} updateDto - The DTO containing updated data for the author.
   * @returns {Promise<Author | null>} - The result of updating the author.
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update author' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAuthorDto,
  ): Promise<Author | null> {
    return this.service.update(id, updateDto);
  }

  /**
   * Deletes a author by its ID.
   * This route is protected by the `AuthGuard`, requiring JWT authentication.
   *
   * @param {string} id - The ID of the author to delete.
   * @returns {Promise<Author | null>} - The result of deleting the author.
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete author' })
  remove(@Param('id') id: string): Promise<Author | null> {
    return this.service.remove(id);
  }
}
