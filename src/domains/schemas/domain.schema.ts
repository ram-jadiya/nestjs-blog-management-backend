import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Represents a domain in the database.
 *
 * This schema defines the structure of the `Domain` document, which includes
 * properties such as `name` (the domain name) and `isActive` (the status of the domain).
 * The schema also automatically includes `timestamps` to track when the domain is created and updated.
 *
 * @extends {Document} - This class extends the Mongoose `Document` class to provide MongoDB document functionality.
 */
@Schema({ timestamps: true })
export class Domain extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  url: string;

  @Prop({ default: true })
  isActive: boolean;
}

/**
 * The Mongoose schema for the `Domain` model.
 * This schema defines how the `Domain` class will be represented in the database.
 */
export const DomainSchema = SchemaFactory.createForClass(Domain);
