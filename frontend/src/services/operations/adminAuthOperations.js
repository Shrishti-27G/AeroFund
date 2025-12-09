import { apiConnector } from "../apiConnector";
import { authEnpoint } from "../apiEndpoints/adminAuthEndpoints.js";
import { toast } from "sonner";
import { setAdmin } from "../../redux/slices/adminAuthSlice.js";

const { Login_Admin_API, Signup_Admin_API, Logout_Admin_API } = authEnpoint;

export const loginAdmin = (email, password, navigate) => async (dispatch) => {
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

        console.log("data -> ", response);

        // toast.success("Login successful");
        dispatch(setAdmin(response.data.supervisor));
        navigate("/stations")
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



export const logoutAdmin = (navigate) => async (dispatch) => {

    console.log("logout");
    
    try {
        const response = await apiConnector(
            "POST",
            Logout_Admin_API,
            null,
            { withCredentials: true } // ✅ COOKIE REQUIRED
        );

        if (!response?.data?.success) {
            toast.error("Logout failed");
            return;
        }

        // ✅ CLEAR REDUX STATE
        dispatch(setAdmin(null));

        toast.success("Logged out successfully");

        // ✅ REDIRECT TO LANDING
        navigate("/");

    } catch (error) {
        toast.error("Logout failed");
    }
};