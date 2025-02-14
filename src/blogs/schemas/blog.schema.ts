import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BlogCategory } from '../../blog-categories/schemas/blog-category.schema';
import { Author } from 'src/authors/schemas/author.schema';
import { Domain } from 'src/domains/schemas/domain.schema';

/**
 * Mongoose schema for the Blog model.
 *
 * This class defines the schema for a blog post, including properties such as
 * title, publish date, content, image, tags, and relationships with the blog category.
 * The schema also includes fields for tracking the active status, featured status, and
 * other metadata like timestamps.
 */
@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  publishDate: Date;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  introduction: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: BlogCategory.name, required: true })
  blogCategory: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Author.name, required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Domain.name, required: true })
  domain: Types.ObjectId;

  @Prop({ default: false })
  isFeatured: boolean;
}

/**
 * The Mongoose schema for the Blog model, generated from the `Blog` class.
 */
export const BlogSchema = SchemaFactory.createForClass(Blog);
