import { Document, Schema, model } from "mongoose";
import { IParanoid } from "./model.types";


// Generic base document interface extending timestamps
export interface ITimestampParanoidDocument extends Document, IParanoid {}

// Function to create a schema with timestamp and optional soft delete
export function createTimestampedParanoidSchema<T>(definition: Record<string, any>) {
  const baseDefinition = {
    ...definition,
    deletedAt: { type: Date, default: null },
  };

  const schema = new Schema<T & ITimestampParanoidDocument>(baseDefinition, {
    timestamps: true, // Automatically adds createdAt and updatedAt
  });
  return schema;
}
