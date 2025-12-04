import { Supervisor } from "../models/supervisorModel.js";


const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};



export const signupAdmin = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const existing = await Supervisor.findOne({ email });
        if (existing)
            return res.status(409).json({ message: "Email already registered" });

        const supervisor = await Supervisor.create({
            name,
            email,
            password,
            phone,
        });

        res.status(201).json({
            message: "Supervisor registered successfully",
            supervisor: {
                _id: supervisor._id,
                name: supervisor.name,
                email: supervisor.email,
                role: supervisor.role,
            },
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "Email & password required" });


        const supervisor = await Supervisor.findOne({ email });
        if (!supervisor)
            return res.status(404).json({ message: "Supervisor not found" });


        const isValid = await supervisor.isPasswordCorrect(password);
        if (!isValid)
            return res.status(401).json({ message: "Invalid credentials" });


        const accessToken = supervisor.generateAccessToken();
        const refreshToken = supervisor.generateRefreshToken();

        supervisor.accessToken = accessToken;
        supervisor.refreshToken = refreshToken;
        await supervisor.save();


        res
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .status(200)
            .json({
                message: "Login successful",
                supervisor: {
                    _id: supervisor._id,
                    name: supervisor.name,
                    email: supervisor.email,
                    role: supervisor.role,
                },
            });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};



export const logoutAdmin = async (req, res) => {
    try {
        const supervisorId = req.user?._id;

        if (!supervisorId) {
            return res.status(400).json({ message: "Invalid request" });
        }


        await Supervisor.findByIdAndUpdate(
            supervisorId,
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
        res.status(500).json({ message: "Server error" });
    }
};

