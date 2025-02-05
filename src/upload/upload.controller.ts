import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from '../r2/r2.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UrlUploadDto } from './dto/url-upload.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ImageUploadDto } from './dto/image-upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly r2Service: R2Service) {}

  @Public()
  @Post('file')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload image file to Cloudflare R2' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file upload',
    type: ImageUploadDto,
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'number', example: 1 },
        file: {
          type: 'object',
          properties: {
            url: { type: 'string', example: 'https://example.com/image.jpg' },
          },
        },
      },
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.r2Service.uploadFile(file);
    return { success: 1, file: { url } };
  }

  @Public()
  @Post('fetchUrl')
  @ApiOperation({ summary: 'Upload image from URL to Cloudflare R2' })
  @ApiBody({ type: UrlUploadDto })
  @ApiResponse({
    status: 201,
    description: 'URL content uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'number', example: 1 },
        file: {
          type: 'object',
          properties: {
            url: { type: 'string', example: 'https://example.com/image.jpg' },
          },
        },
      },
    },
  })
  async fetchFromUrl(@Body() body: { url: string }) {
    const url = await this.r2Service.uploadFromUrl(body.url);
    return { success: 1, file: { url } };
  }
}
