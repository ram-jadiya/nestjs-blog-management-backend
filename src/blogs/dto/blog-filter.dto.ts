import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../shared/interfaces/pagination.dto';

/**
 * DTO for filtering blog categories with pagination support.
 *
 * This class extends the `PaginationDto` and adds additional optional filters
 * such as `blogCategoryId`, `keyword`, `isActive`, and `isFeatured` for querying blog categories.
 * The class supports filtering based on category, keyword, and status, in addition to pagination.
 */
export class BlogFilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  blogCategoryId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  isActive?: string;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  isFeatured?: string;
}
