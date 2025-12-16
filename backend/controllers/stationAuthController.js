import { Station } from "../models/stationsModel.js";
import { Supervisor } from "../models/supervisorModel.js";
import bcrypt from "bcryptjs";

const accessCookieOptions = {
  httpOnly: true,
  secure: false, // true in production
  sameSite: "lax",
  maxAge: 1 * 24 * 60 * 60 * 1000, // ✅ 1 day
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: false, // true in production
  sameSite: "lax",
  maxAge: 5 * 24 * 60 * 60 * 1000, // ✅ 5 days
};



// admin controller
export const createStation = async (req, res) => {
  try {

    console.log("req -> ", req.admin);

    const supervisorId = req.admin._id;

    const { stationName, stationCode, password, email, financialYear } =
      req.body;

    // ✅ VALIDATION
    if (!stationName || !stationCode || !password || !email || !financialYear) {
      return res.status(400).json({
        message:
          "Station Name, Station Code, Email, Password and Financial Year are required",
      });
    }

    // ✅ FINANCIAL YEAR PARSE
    let year;
    if (typeof financialYear === "string") {
      year = parseInt(financialYear.split("-")[0], 10);
    } else if (typeof financialYear === "number") {
      year = financialYear;
    } else {
      return res.status(400).json({ message: "Invalid Financial Year format" });
    }

    if (isNaN(year)) {
      return res.status(400).json({
        message: "Invalid Financial Year format. Expected: 2025-2026 or 2025",
      });
    }

    // =====================================================
    // ✅ GLOBAL UNIQUE STATION CODE CHECK
    // =====================================================
    let station = await Station.findOne({ stationCode });

    // 🔁 STATION CODE EXISTS ANYWHERE
    if (station) {
      // ✅ SAME SUPERVISOR → MAY ADD NEW FY
      if (
        station.createdBy &&
        station.createdBy.toString() === supervisorId.toString()
      ) {

        const yearExists = station.yearlyData.some(
          (item) => item.year === year
        );

        if (yearExists) {
          return res.status(409).json({
            message: `Station already exists for Financial Year ${year}-${year + 1}`,
          });
        }

        station.yearlyData.push({
          year,
          totalAllocated: 0,
          totalUtilized: 0,
          totalEstimated: 0,
          remark: "N/A",
          receipts: [],
        });

        await station.save();

        return res.status(201).json({
          success: true,
          message: "New Financial Year added successfully",
          station,
        });
      }

      // ❌ DIFFERENT SUPERVISOR → BLOCK
      return res.status(409).json({
        success: false,
        message: "Station Code already exists. Station codes must be unique.",
      });
    }

    // =====================================================
    // ✅ CREATE BRAND NEW STATION
    // =====================================================
    const newStation = await Station.create({
      stationName,
      stationCode,
      email,
      password,
      createdBy: supervisorId,
      yearlyData: [
        {
          year,
          totalAllocated: 0,
          totalUtilized: 0,
          totalEstimated: 0,
          remark: "N/A",
          receipts: [],
        },
      ],
    });

    await Supervisor.findByIdAndUpdate(supervisorId, {
      $push: { createdStations: newStation._id },
    });

    res.status(201).json({
      success: true,
      message: "Station created successfully",
      station: newStation,
    });
  } catch (error) {
    console.error("Create Station Error:", error);

    // ✅ HANDLE DUPLICATE KEY ERROR (SAFETY NET)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Station Code already exists. Must be unique.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating station",
      error: error.message,
    });
  }
};



// stations controllers
export const loginStation = async (req, res) => {
  try {
    const { stationCode, password } = req.body;

    console.log("Body -> ", req.body);


    if (!stationCode || !password) {
      return res.status(400).json({ message: "Station code & password required" });
    }

    const station = await Station.findOne({ stationCode: stationCode });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const isValid = await station.isPasswordCorrect(password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ TOKENS
    const accessToken = station.generateAccessToken();   // 10 sec
    const refreshToken = station.generateRefreshToken(); // 2 days

    // ✅ SAVE IN DB
    station.accessToken = accessToken;
    station.refreshToken = refreshToken;
    await station.save({ validateBeforeSave: false });

    // ✅ COOKIES
    res
      .cookie("accessToken", accessToken, accessCookieOptions)
      .cookie("refreshToken", refreshToken, refreshCookieOptions);

    // ✅ SAFE RESPONSE
    const stationData = station.toObject();
    delete stationData.password;
    delete stationData.accessToken;
    delete stationData.refreshToken;

    res.status(200).json({
      success: true,
      message: "Login successful",
      station: stationData,
    });
  } catch (error) {
    console.error("Login Station Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const logoutStation = async (req, res) => {
  try {
    const stationId = req.station?._id; // ✅ MATCHING logoutAdmin style

    if (!stationId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Clear tokens in DB
    await Station.findByIdAndUpdate(
      stationId,
      { $set: { accessToken: null, refreshToken: null } },
      { new: true }
    );

    // Clear cookies
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ success: true, message: "Logged out successfully" });

  } catch (error) {
    console.error("Logout Station Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const refreshStationAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const station = await Station.findById(decoded._id);

    if (!station || station.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // ✅ NEW ACCESS TOKEN
    const newAccessToken = station.generateAccessToken();
    station.accessToken = newAccessToken;
    await station.save({ validateBeforeSave: false });

    // ✅ SET COOKIE AGAIN
    res.cookie("accessToken", newAccessToken, accessCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired",
    });
  }
};
