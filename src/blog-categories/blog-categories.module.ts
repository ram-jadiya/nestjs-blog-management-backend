import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlogCategory,
  BlogCategorySchema,
} from './schemas/blog-category.schema';
import { BlogCategoriesController } from './blog-categories.controller';
import { BlogCategoriesService } from './blog-categories.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogCategory.name, schema: BlogCategorySchema },
    ]),
    AuthModule,
  ],
  controllers: [BlogCategoriesController],
  providers: [BlogCategoriesService],
  exports: [BlogCategoriesService],
})
export class BlogCategoriesModule {}
