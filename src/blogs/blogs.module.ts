import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogCategoriesModule } from '../blog-categories/blog-categories.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    BlogCategoriesModule,
    AuthorsModule,
    AuthModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
