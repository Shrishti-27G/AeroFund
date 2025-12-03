import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, station, role, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json("User already exists");

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      station,
      role,
      email,
      password: hashedPass,
    });

    res.json({ message: "Registered Successfully" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User Not Found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid Password");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      station: user.station,
      email: user.email,
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
};
