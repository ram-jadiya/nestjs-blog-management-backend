import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a new author.
 *
 * This DTO is used for validating the incoming data when creating a author.
 * It ensures that the author name is a non-empty string, and optionally allows
 * setting the active status of the author.
 */
export class CreateAuthorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  designation: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  linkedin: string;

  @ApiProperty({ required: false, default: true })
  isActive?: boolean;
}
