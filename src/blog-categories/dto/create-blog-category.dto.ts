import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a new blog category.
 *
 * This DTO is used for validating the incoming data when creating a blog category.
 * It ensures that the category name is a non-empty string, and optionally allows
 * setting the active status of the category.
 */
export class CreateBlogCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, default: true })
  isActive?: boolean;
}
