import { Schema } from "mongoose";

export function paranoidPlugin(schema: Schema) {
  // Apply this filter to all find queries, findOne, findOneAndUpdate, etc.
  function addDeletedAtFilter(this: any) {
    // Only add the filter if it's not explicitly overridden
    if (!this.getQuery().hasOwnProperty("deletedAt")) {
      this.where({ deletedAt: null });
    }
  }

  schema.pre("find", addDeletedAtFilter);
  schema.pre("findOne", addDeletedAtFilter);
  schema.pre("findOneAndUpdate", addDeletedAtFilter);
  schema.pre("count", addDeletedAtFilter);
  schema.pre("countDocuments", addDeletedAtFilter);
  schema.pre("update", addDeletedAtFilter);
  schema.pre("updateMany", addDeletedAtFilter);
  schema.pre("aggregate", function () {
    // For aggregate queries, add a match stage at the beginning
    if (
      !this.pipeline().some(
        (stage) => "$match" in stage && "deletedAt" in stage["$match"]
      )
    ) {
      this.pipeline().unshift({ $match: { deletedAt: null } });
    }
  });
}
