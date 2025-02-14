import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a new domain.
 *
 * This DTO is used for validating the incoming data when creating a domain.
 * It ensures that the domain name is a non-empty string, and optionally allows
 * setting the active status of the domain.
 */
export class CreateDomainDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ required: false, default: true })
  isActive?: boolean;
}
