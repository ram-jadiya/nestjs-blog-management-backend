import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { BlogCategoriesModule } from './blog-categories/blog-categories.module';
import { R2Service } from './r2/r2.service';
import { UploadController } from './upload/upload.controller';
import configuration from './auth/config/configuration';
import { AuthorsModule } from './authors/authors.module';
import { DomainsModule } from './domains/domains.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AuthorsModule,
    DomainsModule,
    BlogCategoriesModule,
    BlogsModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, R2Service],
})
export class AppModule {}
