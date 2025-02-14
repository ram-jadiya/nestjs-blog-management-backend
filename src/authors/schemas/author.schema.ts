import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Represents a author in the database.
 *
 * This schema defines the structure of the `Author` document, which includes
 * properties such as `name` (the author name) and `isActive` (the status of the author).
 * The schema also automatically includes `timestamps` to track when the author is created and updated.
 *
 * @extends {Document} - This class extends the Mongoose `Document` class to provide MongoDB document functionality.
 */
@Schema({ timestamps: true })
export class Author extends Document {
  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  designation: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  linkedin: string;

  @Prop({ default: true })
  isActive: boolean;
}

/**
 * The Mongoose schema for the `Author` model.
 * This schema defines how the `Author` class will be represented in the database.
 */
export const AuthorSchema = SchemaFactory.createForClass(Author);
