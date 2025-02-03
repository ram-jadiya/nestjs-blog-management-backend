import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';

/**
 * DTO for updating an existing blog post.
 *
 * This class extends `CreateBlogDto` and makes all properties optional,
 * allowing partial updates to an existing blog post. Only the properties that
 * are provided in the request will be updated, leaving the others unchanged.
 */
export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
