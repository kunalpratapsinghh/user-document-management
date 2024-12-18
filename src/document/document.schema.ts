import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserDocument extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;

  @Prop({ required: true })
  uploadedBy: string;

  @Prop({ default: 'viewer' })
  role: string;
  
  @Prop({ type: Object }) 
  details: object;
}

export const UserDocumentSchema = SchemaFactory.createForClass(UserDocument);
