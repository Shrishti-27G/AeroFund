import { Station } from "../models/stationsModel.js";
import bcrypt from "bcryptjs";

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

// ----------------------------------------
// ✅ SIGNUP STATION
// ----------------------------------------
// export const createStation = async (req, res) => {
//   try {
//     const { stationName, stationCode, password, email } = req.body;

//     console.log("req -> ", req.body);

//     // ✅ VALIDATION
//     if (!stationName || !stationCode || !password || !email) {
//       return res.status(400).json({
//         message: "Station Name, Station Code, Email and Password are required",
//       });
//     }

//     // ✅ CHECK DUPLICATE STATION CODE
//     const existingStation = await Station.findOne({ stationCode });
//     if (existingStation) {
//       return res.status(409).json({ message: "Station already registered" });
//     }

//     // ✅ CHECK DUPLICATE EMAIL
//     const existingEmail = await Station.findOne({ email });
//     if (existingEmail) {
//       return res.status(409).json({ message: "Email already in use" });
//     }

//     // ✅ CREATE STATION
//     const station = await Station.create({
//       stationName,
//       stationCode,
//       password,
//       email, // ✅ ADDING EMAIL
//     });

//     res.status(201).json({
//       message: "Station registered successfully",
//       station: {
//         _id: station._id,
//         stationName: station.stationName,
//         stationCode: station.stationCode,
//         email: station.email,
//       },
//     });

//   } catch (error) {
//     console.error("Create Station Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// export const createStation = async (req, res) => {
//   try {
//     const { stationName, stationCode, password, email, financialYear } = req.body;

//     console.log("req -> ", req.body);

//     // ✅ FULL VALIDATION
//     if (!stationName || !stationCode || !password || !email || !financialYear) {
//       return res.status(400).json({
//         message: "Station Name, Station Code, Email, Password and Financial Year are required",
//       });
//     }

//     // ✅ ✅ FIX: Extract starting year safely from "2025-2026"
//     const year = parseInt(financialYear.split("-")[0]);

//     if (isNaN(year)) {
//       return res.status(400).json({
//         message: "Invalid Financial Year format. Expected: 2025-2026",
//       });
//     }

//     // ✅ CHECK IF STATION ALREADY EXISTS
//     let station = await Station.findOne({ stationCode });

//     // ✅ IF STATION EXISTS → CHECK IF SAME YEAR DATA EXISTS
//     if (station) {
//       const yearExists = station.yearlyData.some(
//         (item) => item.year === year
//       );

//       if (yearExists) {
//         return res.status(409).json({
//           message: `Station already exists for Financial Year ${financialYear}`,
//         });
//       }

//       // ✅ ADD NEW YEAR DATA INTO EXISTING STATION
//       station.yearlyData.push({
//         year,
//         totalAllocated: 0,
//         totalUtilized: 0,
//         totalEstimated: 0,
//         remark: "N/A",
//         receipt: "Not Uploaded",
//       });

//       await station.save();

//       return res.status(201).json({
//         message: "New Financial Year added successfully",
//         station,
//       });
//     }

//     // ✅ IF STATION DOES NOT EXIST → CREATE NEW
//     const newStation = await Station.create({
//       stationName,
//       stationCode,
//       email,
//       password,
//       yearlyData: [
//         {
//           year,
//           totalAllocated: 0,
//           totalUtilized: 0,
//           totalEstimated: 0,
//           remark: "N/A",
//           receipt: "Not Uploaded",
//         },
//       ],
//     });

//     res.status(201).json({
//       message: "Station created successfully",
//       station: newStation,
//     });

//   } catch (error) {
//     console.error("Create Station Error:", error);
//     res.status(500).json({
//       message: "Server error while creating station",
//     });
//   }
// };



export const createStation = async (req, res) => {
  try {
    const { stationName, stationCode, password, email, financialYear } = req.body;

    console.log("req -> ", req.body);

    // ✅ FULL VALIDATION
    if (!stationName || !stationCode || !password || !email || !financialYear) {
      return res.status(400).json({
        message: "Station Name, Station Code, Email, Password and Financial Year are required",
      });
    }

    // ✅ SAFE FINANCIAL YEAR HANDLING (STRING OR NUMBER)
    let year;

    if (typeof financialYear === "string") {
      year = parseInt(financialYear.split("-")[0]);
    } else if (typeof financialYear === "number") {
      year = financialYear;
    } else {
      return res.status(400).json({
        message: "Invalid Financial Year format",
      });
    }

    if (isNaN(year)) {
      return res.status(400).json({
        message: "Invalid Financial Year format. Expected: 2025-2026 or 2025",
      });
    }

    // ✅ HASH PASSWORD BEFORE SAVING
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ CHECK IF STATION ALREADY EXISTS
    let station = await Station.findOne({ stationCode });

    // ✅ IF STATION EXISTS → CHECK IF SAME YEAR DATA EXISTS
    if (station) {
      const yearExists = station.yearlyData.some(
        (item) => item.year === year
      );

      if (yearExists) {
        return res.status(409).json({
          message: `Station already exists for Financial Year ${year}`,
        });
      }

      // ✅ ADD NEW FINANCIAL YEAR DATA
      station.yearlyData.push({
        year,
        totalAllocated: 0,
        totalUtilized: 0,
        totalEstimated: 0,
        remark: "N/A",
        receipt: "Not Uploaded",
      });

      await station.save();

      return res.status(201).json({
        message: "New Financial Year added successfully",
        station,
      });
    }

    // ✅ IF STATION DOES NOT EXIST → CREATE NEW STATION
    const newStation = await Station.create({
      stationName,
      stationCode,
      email,
      password: hashedPassword,
      yearlyData: [
        {
          year,
          totalAllocated: 0,
          totalUtilized: 0,
          totalEstimated: 0,
          remark: "N/A",
          receipt: "Not Uploaded",
        },
      ],
    });

    res.status(201).json({
      message: "Station created successfully",
      station: newStation,
    });

  } catch (error) {
    console.error("Create Station Error:", error);
    res.status(500).json({
      message: "Server error while creating station",
      error: error.message,
    });
  }
};




// ----------------------------------------
// ✅ LOGIN STATION
// ----------------------------------------
export const loginStation = async (req, res) => {
  try {
    const { stationCode, password } = req.body;

    if (!stationCode || !password) {
      return res.status(400).json({ message: "Station code & password required" });
    }

    const station = await Station.findOne({ stationCode });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const isValid = await station.isPasswordCorrect(password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = station.generateAccessToken();
    const refreshToken = station.generateRefreshToken();

    station.accessToken = accessToken;
    station.refreshToken = refreshToken;
    await station.save({ validateBeforeSave: false });

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        message: "Login successful",
        station: {
          _id: station._id,
          stationName: station.stationName,
          stationCode: station.stationCode,
        },
      });
  } catch (error) {
    console.error("Login Station Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// ✅ LOGOUT STATION
// ----------------------------------------
export const logoutStation = async (req, res) => {
  try {
    const stationId = req.user?._id;

    if (!stationId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    await Station.findByIdAndUpdate(
      stationId,
      {
        $set: { accessToken: null, refreshToken: null },
      },
      { new: true }
    );

    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Station Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
