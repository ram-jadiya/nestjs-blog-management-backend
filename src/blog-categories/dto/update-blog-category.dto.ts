import { PartialType } from '@nestjs/swagger';
import { CreateBlogCategoryDto } from './create-blog-category.dto';

/**
 * Data Transfer Object (DTO) for updating an existing blog category.
 *
 * This DTO extends the `CreateBlogCategoryDto` to allow partial updates of the blog category.
 * The fields are optional, so the user can update only the properties they wish to modify.
 */
export class UpdateBlogCategoryDto extends PartialType(CreateBlogCategoryDto) {}
