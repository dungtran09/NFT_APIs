const mongoose = require("mongoose");
const slugify = require("slugify");

const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "A NFT must have a name."],
      trim: true,
      maxlength: [40, "nft name must not have more than chatacters."],
      minlength: [5, "nft name must has at least 5 characters."],
    },
    duration: {
      type: String,
      required: [true, "must provide duration."],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "must hava a group size."],
    },
    difficulty: {
      type: String,
      required: [true, "must have difficuty."],
      enum: {
        values: ["easy", "medium", "difficulty"],
        message: "must have choise an values: easy, menium or difficulty.",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      minlength: [true, "min ratings must not a posive number."],
      maxlength: [10, "max ratings must not exceeded 10."],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A NFT must have a price."],
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "Discount price should be below regular price.",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "must provide sumary."],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "must provide the cover image."],
    },
    images: {
      type: [String],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    slug: String,
    scretNfts: {
      type: Boolean,
      default: false,
    },
    start: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Mongoogse virtuals
nftSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

/* Mongoogse middleware*/

// Document middleware: run before save(), create().
nftSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// nftSchema.pre("save", function (next) {
//   console.log("Document will save...");
//   next();
// });
//
// nftSchema.post("save", function (doc, next) {
//   console.log(doc);
//   console.log("Save document successfully!");
//   next();
// });

// Document query middleware:
nftSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  this.find({ scretNfts: { $ne: true } });
  next();
});

// nftSchema.pre("findOne", function (next) {
//   this.find({ scretNfts: { $ne: true } });
//   next();
// });

// nftSchema.post(/^find/, function (doc, next) {
//   console.log(`Query took time: ${Date.now() - this.start} times.`);
//   console.log(doc);
//   next();
// });

// Aggregate middleware
nftSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { scretNfts: { $ne: true } } });
  next();
});

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
