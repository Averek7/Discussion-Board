require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const connectToMongo = () => {
  mongoose
    .connect(MONGO_URI)
    .then((res) => console.log("> Connected..."))
    .catch((err) =>
      console.log(`> Error while connecting to mongoDB : ${err.message}`)
    );
};

module.exports = connectToMongo;
