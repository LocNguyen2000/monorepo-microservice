import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User;

@Schema({ collection: "user", timestamps: true })
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
