const express = require("express");
const nftControllers = require("../controller/nftControlers");
const authController = require("../controller/authController");

const router = express.Router();

// top 5 NFTs by price
router
  .route("/top-5-nfts")
  .get(
    authController.protect,
    nftControllers.aliasTopNFTs,
    nftControllers.getAllNfts,
  );

// Nfts Stats
router
  .route("/nfts-stats")
  .get(authController.protect, nftControllers.getNFTsStats);

// Nfts mongthly-plan
router
  .route("/monthly-plan/:year")
  .get(authController.protect, nftControllers.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, nftControllers.getAllNfts)
  .post(authController.protect, nftControllers.createNFT);
router
  .route("/:id")
  .get(authController.protect, nftControllers.getNFT)
  .patch(authController.protect, nftControllers.updateNFT)
  .delete(
    authController.protect,
    authController.restrict("admin", "guide"),
    nftControllers.deleteNFT,
  );

module.exports = router;
