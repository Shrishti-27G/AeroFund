import jwt from "jsonwebtoken";
import { Supervisor } from "../models/supervisorModel.js";

export const isAdmin = async (req, res, next) => {
  try {
    // ✅ TOKEN FROM COOKIE
    const token = req.cookies?.accessToken;

    console.log("Tokens -> in middleware ",token);
    

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing in cookies",
      });
    }

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // ✅ FIND ADMIN FROM DB
    const admin = await Supervisor.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // ✅ CHECK ROLE
    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // ✅ CHECK ACTIVE STATUS
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is deactivated",
      });
    }

    // ✅ ATTACH ADMIN TO REQUEST
    req.admin = admin;

    next(); // ✅ ACCESS GRANTED
  } catch (error) {
    console.error("Admin Cookie Auth Error:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized or token expired",
    });
  }
};
