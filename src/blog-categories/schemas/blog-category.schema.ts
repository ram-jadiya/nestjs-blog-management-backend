import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Domain } from 'src/domains/schemas/domain.schema';

/**
 * Represents a blog category in the database.
 *
 * This schema defines the structure of the `BlogCategory` document, which includes
 * properties such as `name` (the category name) and `isActive` (the status of the category).
 * The schema also automatically includes `timestamps` to track when the category is created and updated.
 *
 * @extends {Document} - This class extends the Mongoose `Document` class to provide MongoDB document functionality.
 */
@Schema({ timestamps: true })
export class BlogCategory extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Domain.name, required: true })
  domain: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

/**
 * The Mongoose schema for the `BlogCategory` model.
 * This schema defines how the `BlogCategory` class will be represented in the database.
 */
export const BlogCategorySchema = SchemaFactory.createForClass(BlogCategory);
