import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import supervisoruthRoutes from "./routes/supervisorAuthRoutes.js";

const app = express();



app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", 
    credentials: true,
  })
);


app.use(cookieParser());


app.use(express.json({ limit: "5mb" }));


app.use(express.urlencoded({ extended: true }));


app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 }, 
  })
);



app.use("/uploads", express.static("uploads"));


app.use("/superviser-auth", supervisoruthRoutes);

export default app;
