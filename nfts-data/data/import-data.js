const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const NFT = require("../../models/nftsModel");

// CONFIG ENV
dotenv.config({ path: "../../config.env" });

// CONNECT TO DB
mongoose
  .connect(process.env.DB_REMOTE_STR, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("Database connect successfully.");
  })
  .catch((error) => {
    console.log(error.message);
  });

// READ DATA and IMPORT
const importData = async () => {
  try {
    const nfts = JSON.parse(
      fs.readFileSync(`${__dirname}/nft-simple.json`, "utf-8"),
    );
    await NFT.create(nfts);
    console.log("Load successfully.");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

// REMOVE DATA
const deleteData = async () => {
  try {
    await NFT.deleteMany();
    console.log("Delete data successfully!");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--del") {
  deleteData();
}
