import { Schema, Types, model, Document } from "mongoose";

export interface ICheatSheet extends Document {
  title: string;
  content: string;
  type: "note" | "snippet";
  favourite?: boolean;
  user: Types.ObjectId;
}

const CheatSheetSchema = new Schema<ICheatSheet>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["note", "snippet"], required: true },
    favourite: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const CheatSheet = model<ICheatSheet>("CheatSheet", CheatSheetSchema);