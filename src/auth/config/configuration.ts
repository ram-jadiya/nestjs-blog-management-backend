import { registerAs } from '@nestjs/config';

export default registerAs('r2', () => ({
  endpoint: process.env.R2_ENDPOINT,
  accessKey: process.env.R2_ACCESS_KEY,
  secretKey: process.env.R2_SECRET_KEY,
  bucketName: process.env.R2_BUCKET_NAME,
  publicDomain: process.env.R2_PUBLIC_DOMAIN,
}));
