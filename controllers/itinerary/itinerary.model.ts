import { model, Schema, Types } from "mongoose";
import {
  createTimestampedParanoidSchema,
  ITimestampParanoidDocument,
} from "../../model/model.config";
import { IItineraryBase } from "./itinerary.types";
import { paranoidPlugin } from "../../model/plugins";
export type IItineraryDocument = IItineraryBase & {
  user: Types.ObjectId;
} & ITimestampParanoidDocument;

const ItinerarySchema = createTimestampedParanoidSchema<IItineraryDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  budget: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

ItinerarySchema.plugin(paranoidPlugin);

export default model<IItineraryDocument>("Itinerary", ItinerarySchema);
