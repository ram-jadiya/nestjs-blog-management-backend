import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class R2Service {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      endpoint: this.configService.get<string>('r2.endpoint'),
      credentials: {
        accessKeyId: this.configService.get<string>('r2.accessKey') ?? '',
        secretAccessKey: this.configService.get<string>('r2.secretKey') ?? '',
      },
      signatureVersion: 'v4',
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const key = `uploads/${uuidv4()}-${file.originalname}`;

    await this.s3
      .upload({
        Bucket: this.configService.get<string>('r2.bucketName') ?? '',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    return `${this.configService.get('r2.publicDomain')}/${key}`;
  }

  async uploadFromUrl(url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type');

    const key = `uploads/${uuidv4()}-${Date.now()}`;

    await this.s3
      .upload({
        Bucket: this.configService.get<string>('r2.bucketName') ?? '',
        Key: key,
        Body: Buffer.from(buffer),
        ContentType: contentType || 'application/octet-stream',
      })
      .promise();

    return `${this.configService.get('r2.publicDomain')}/${key}`;
  }
}
