import { Types } from "mongoose";
import { ITimestampParanoidDocument } from "../../model/model.config";
import { IUser } from "../user/user.types";

export interface IItineraryBase {
  title: string;
  destination: string;
  budget: number;
  startDate: Date;
  endDate: Date;
}

export type IItineraryPopulated = IItineraryBase & {
  user: IUser;
};
