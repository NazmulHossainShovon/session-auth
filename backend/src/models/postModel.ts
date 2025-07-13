import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Post {
  @prop({ required: true })
  post!: string;

  @prop({ type: () => [String] })
  images?: string[];

  @prop({ required: true })
  authorName!: string;

  @prop({ required: true })
  userId!: string;

  @prop({ required: true })
  likers!: string[];

  @prop({ type: () => [Comment], default: [] })
  comments: Comment[] = [];
}

class Comment {
  @prop({ required: true })
  userName!: string;

  @prop({ required: true })
  comment!: string;

  @prop({ default: Date.now() })
  createdAt!: Date;
}

export const PostModel = getModelForClass(Post);
