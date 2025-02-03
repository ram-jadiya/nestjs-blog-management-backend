import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

/**
 * DTO for pagination parameters.
 *
 * This class defines the properties used for paginating results in API endpoints.
 * It includes the page index (starting from 1) and page size (number of items per page),
 * with default values provided if they are not specified in the request.
 */
export class PaginationDto {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  pageIndex: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  pageSize: number = 10;
}
