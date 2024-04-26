const mongoose = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const articalSchema = new mongoose.Schema(
  {
    category: {
      ref: "Category",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      required: true,
      type: String,
    },
    mainImage: {
      required: true,
      type: {
        url: String,
        public_id: String,
      },
    },
    title: {
      required: true,
      type: String,
    },
    heading: {
      required: true,
      type: String,
    },
    subImages: {
      type: [
        {
          url: String,
          public_id: String,
          prompt: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

articalSchema.plugin(mongooseAggregatePaginate);

const Artical = mongoose.model("Artical", articalSchema);
module.exports = { Artical };
