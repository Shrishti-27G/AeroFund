import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import adminAuthRoutes from "./routes/adminAuthRoutes.js";

const app = express();



app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,               // allow cookies
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


app.use("/admin-auth", adminAuthRoutes);

export default app;
