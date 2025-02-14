import { PartialType } from '@nestjs/swagger';
import { CreateDomainDto } from './create-domain.dto';

/**
 * Data Transfer Object (DTO) for updating an existing domain.
 *
 * This DTO extends the `CreateDomainDto` to allow partial updates of the domain.
 * The fields are optional, so the user can update only the properties they wish to modify.
 */
export class UpdateDomainDto extends PartialType(CreateDomainDto) {}
