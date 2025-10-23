import mongoose, { Schema, Document, Model } from "mongoose";

export interface IKiosko extends Document {
  name: string;
  address: string;
  active: boolean;
  date: Date;
  medias: mongoose.Types.ObjectId[];
  deeplinks: mongoose.Types.ObjectId[];
}

const kioskoSchema = new Schema<IKiosko>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  active: { type: Boolean, default: true },
  date: { type: Date, default: Date.now },
  medias: [{ type: Schema.Types.ObjectId, ref: "Media" }],
  deeplinks: [{ type: Schema.Types.ObjectId, ref: "Deeplink" }],
});

const Kiosko: Model<IKiosko> =
  mongoose.models.Kiosko || mongoose.model<IKiosko>("Kiosko", kioskoSchema, "kioskos");

export default Kiosko;
