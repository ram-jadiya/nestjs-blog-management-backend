import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class UrlUploadDto {
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL of the image to fetch',
  })
  @IsUrl()
  url: string;
}
