import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDeeplink extends Document {
  name: string;
  url: string;
  icon: string;
  date: Date;
}

const deeplinkSchema = new Schema<IDeeplink>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Deeplink: Model<IDeeplink> =
  mongoose.models.Deeplink || mongoose.model<IDeeplink>("Deeplink", deeplinkSchema, "deeplinks");

export default Deeplink;
