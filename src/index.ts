import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/authRouter";
import http from "http";
import userRouter from "./routes/userRouter";
import dotenv from "dotenv"
dotenv.config()

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

app.use("/auth", authRouter);
app.use("/users", userRouter);
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const MONGO_URL : any = process.env.MONGOURL

mongoose
  .connect(MONGO_URL)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server started on Port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });
