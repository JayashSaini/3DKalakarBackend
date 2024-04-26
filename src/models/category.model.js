const mongoose = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.plugin(mongooseAggregatePaginate);

const Category = mongoose.model("Category", categorySchema);
module.exports = { Category };
