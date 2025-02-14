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
import { DomainsService } from './domains.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { PaginationDto } from '../shared/interfaces/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Domain } from './schemas/domain.schema';

/**
 * Controller for managing domains.
 *
 * This controller defines the routes for CRUD operations on domains.
 * It includes routes for creating, reading, updating, and deleting domains,
 * as well as retrieving a paginated list of domains. Some routes are protected
 * by the `AuthGuard` to ensure authentication, while others are publicly accessible.
 *
 * @ApiTags('Domains') - This is the Swagger tag for grouping these endpoints under "Domains".
 * @ApiBearerAuth('JWT-auth') - Specifies that these routes are protected by JWT authentication.
 */
@ApiTags('Domains')
@Controller('domains')
export class DomainsController {
  constructor(private readonly service: DomainsService) {}

  /**
   * Creates a new domain.
   * This route is protected by the `AuthGuard`, requiring JWT authentication.
   *
   * @param {CreateDomainDto} createDto - The DTO containing data for the new domain.
   * @returns {Promise<string>} - The result of creating the domain id.
   */
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new domain' })
  create(@Body() createDto: CreateDomainDto): Promise<string> {
    return this.service.create(createDto);
  }

  /**
   * Retrieves all domains with optional pagination.
   * This route is publicly accessible.
   *
   * @param {PaginationDto} pagination - The pagination parameters to control the results.
   * @returns {Promise<{data: Domain[]; count: number}>} - A paginated list of domains.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all domains' })
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<{ data: Domain[]; count: number }> {
    return this.service.findAll(pagination);
  }

  /**
   * Retrieves a single domain by its ID.
   * This route is publicly accessible.
   *
   * @param {string} id - The ID of the domain to retrieve.
   * @returns {Promise<Domain | null>} - The requested domain.
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get single domain' })
  findOne(@Param('id') id: string): Promise<Domain | null> {
    return this.service.findOne(id);
  }

  /**
   * Updates an existing domain by its ID.
   * This route is protected by the `AuthGuard`, requiring JWT authentication.
   *
   * @param {string} id - The ID of the domain to update.
   * @param {UpdatedomainDto} updateDto - The DTO containing updated data for the domain.
   * @returns {Promise<string | null>} - The result of updating the domain.
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update domain' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDomainDto,
  ): Promise<string | null> {
    return this.service.update(id, updateDto);
  }

  /**
   * Deletes a domain by its ID.
   * This route is protected by the `AuthGuard`, requiring JWT authentication.
   *
   * @param {string} id - The ID of the domain to delete.
   * @returns {Promise<string | null>} - The result of deleting the domain.
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete domain' })
  remove(@Param('id') id: string): Promise<string | null> {
    return this.service.remove(id);
  }
}
