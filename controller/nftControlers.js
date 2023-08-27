const NFT = require("../models/nftsModel");
const APIFeatures = require("../utils/APIFeatures");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const AppError = require("../utils/AppError");

// GET TOP 5 NFTs BY PRICE
exports.aliasTopNFTs = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-price";
  req.query.fields = "name,price";
  next();
};

// GET NFTS
exports.getAllNfts = asyncErrorHandler(async (req, res, next) => {
  const features = new APIFeatures(NFT.find(), req.query)
    .filter()
    .limit()
    .sort()
    .pagination();
  const nfts = await features.query;
  res.status(200).json({
    status: "success",
    results: nfts.length,
    data: {
      nfts,
    },
  });
});

// GET NFT
exports.getNFT = asyncErrorHandler(async (req, res, next) => {
  const nft = await NFT.findById(req.params.id);

  if (!nft) {
    return next(new AppError(`The ID: ${req.params.id} is not found.`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
});

// CREATE NFT
exports.createNFT = asyncErrorHandler(async (req, res, next) => {
  const newNFT = await NFT.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      nft: newNFT,
    },
  });
});

// UPDATE NFT
exports.updateNFT = asyncErrorHandler(async (req, res, next) => {
  const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!nft) {
    return next(new AppError(`The ID: ${req.params.id} is not found.`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
});

// DELETE NFT
exports.deleteNFT = asyncErrorHandler(async (req, res, next) => {
  const nft = await NFT.findByIdAndDelete(req.params.id);

  if (!nft) {
    return next(new AppError(`The ID: ${req.params.id} is not found.`, 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// AGGREGARION PIPELINE
exports.getNFTsStats = asyncErrorHandler(async (req, res, next) => {
  const stats = await NFT.aggregate([
    {
      $match: { ratingsAverage: { $gt: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        totalNFT: { $sum: 1 },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { maxPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

// GET MONTHLY PLAN
exports.getMonthlyPlan = asyncErrorHandler(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await NFT.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numNFTsStarts: { $sum: 1 },
        nfts: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numNFTsStarts: 1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: plan,
  });
});
