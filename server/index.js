const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const router = require("./Router/router");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

app.use("/api", router);

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, async () => {
      console.log("Start Server");
    });
  })
  .catch((error) => {
    console.log(error);
  });
