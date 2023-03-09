import express from "express";
import mongoose from "mongoose";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/user";
import PostRouter from "./routes/post";
import dotenv from "dotenv";

const app = express();
const PORT: number = 3000;
dotenv.config();

mongoose
  .connect(process.env.MONGOURL!)
  .then(() => console.log("MongoDBと接続中"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/post", PostRouter);

app.listen(PORT, () => console.log(`Server is running on PORT:${PORT}`));
