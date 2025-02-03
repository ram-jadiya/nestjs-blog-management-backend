import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for creating a new blog post.
 *
 * This class defines the properties required to create a new blog post, including
 * the title, publish date, content, introduction, image, category, and optional properties
 * for active status, tags, and featured status.
 */
export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  publishDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  introduction: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ required: false, default: true })
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsArray()
  tags?: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  blogCategoryId: string;

  @ApiProperty({ required: false, default: false })
  isFeatured?: boolean;
}
