import { apiConnector } from "../apiConnector";
import { authEnpoint } from "../apiEndpoints/adminAuthEndpoints.js";
import { toast } from "sonner";

const { Login_Admin_API, Signup_Admin_API } = authEnpoint;

export const loginAdmin = async (email, password) => {
    try {
        const response = await apiConnector(
            "POST",
            Login_Admin_API,
            { email, password }
        );

        if (!response.data) {
            toast.error("Login failed");
            return null;
        }

        // toast.success("Login successful");
        return response.data.supervisor || response.data;
    } catch (error) {
        console.log("LOGIN ERROR →", error);
        const msg = error?.response?.data?.message || "Server Error";
        // toast.error(msg);
        return null;
    }
};



export const signupAdmin = async (name, email, password, phone) => {
    try {
        const response = await apiConnector(
            "POST",
            Signup_Admin_API,
            { name, email, password, phone }
        );

        if (!response.data) {
            // toast.error("Signup failed");
            return null;
        }

        // toast.success("Account created successfully!");
        return response.data.supervisor || response.data;
    } catch (error) {
        console.log("SIGNUP ERROR →", error);
        const msg = error?.response?.data?.message || "Server Error";
        // toast.error(msg);
        return null;
    }
};