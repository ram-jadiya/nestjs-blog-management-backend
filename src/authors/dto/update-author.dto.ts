import { PartialType } from '@nestjs/swagger';
import { CreateAuthorDto } from './create-author.dto';

/**
 * Data Transfer Object (DTO) for updating an existing author.
 *
 * This DTO extends the `CreateAuthorDto` to allow partial updates of author.
 * The fields are optional, so the user can update only the properties they wish to modify.
 */
export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {}
