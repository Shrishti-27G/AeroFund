import { Station } from "../models/station.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", 
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

// ----------------------------------------
// STATION LOGIN
// ----------------------------------------
export const loginStation = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    // Find station by email
    const station = await Station.findOne({ email });
    if (!station)
      return res.status(404).json({ message: "Station not found" });

    // Compare password
    const validPassword = await station.isPasswordCorrect(password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate tokens
    const accessToken = station.generateAccessToken();
    const refreshToken = station.generateRefreshToken();

    // Save tokens to DB
    station.accessToken = accessToken;
    station.refreshToken = refreshToken;
    await station.save();

    // Send cookies + response
    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        message: "Station login successful",
        station: {
          _id: station._id,
          stationName: station.stationName,
          stationCode: station.stationCode,
          email: station.email,
        },
      });
  } catch (error) {
    console.error("Station Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
