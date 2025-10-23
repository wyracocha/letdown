import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMedia extends Document {
  url: string;
  tags?: string;
  date: Date;
}

const mediaSchema = new Schema<IMedia>({
  url: { type: String, required: true },
  tags: { type: String },
  date: { type: Date, default: Date.now },
});

const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", mediaSchema, "medias");

export default Media;
