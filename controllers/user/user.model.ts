import mongoose, { Document } from "mongoose";
import { createTimestampedParanoidSchema, ITimestampParanoidDocument } from "../../model/model.config";
import { IUser } from "./user.types";
import { paranoidPlugin } from "../../model/plugins";

export type IUserDocument = IUser & ITimestampParanoidDocument;

const userSchema = createTimestampedParanoidSchema<IUser>({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
});

userSchema.plugin(paranoidPlugin);

export const UserModel = mongoose.model<IUserDocument>("User", userSchema);
