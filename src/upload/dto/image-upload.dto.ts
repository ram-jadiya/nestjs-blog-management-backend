import { ApiProperty } from '@nestjs/swagger';
import { IsFile, MaxFileSize } from 'nestjs-form-data';

export class ImageUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
  })
  @IsFile()
  @MaxFileSize(5 * 1024 * 1024) // 5MB
  image: any;
}
