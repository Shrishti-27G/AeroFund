import { apiConnector } from "../apiConnector";
import { stationEndpoints } from "../apiEndpoints/stationsEndpoints.js";
import { clearStation } from "../../redux/slices/stationAuthSlice.js";


const { LOGIN_STATION_API, GET_STATION_BY_FINANCIAL_YEAR, UPDATE_REMARK_API, LOGOUT_STATION_API } = stationEndpoints;

export const loginStation = async (stationCode, password) => {
  try {
    const response = await apiConnector(
      "POST",
      LOGIN_STATION_API,
      { stationCode, password }
    );

    console.log("Response -> ", response);


    return response.data; // ⬅️ IMPORTANT
  } catch (error) {
    console.error("Login Station API Error:", error);
    throw error;
  }
};


export const getStationYearData = async (stationCode, year = "") => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_STATION_BY_FINANCIAL_YEAR}/${stationCode}/${year}`
    );

    console.log("yearly data -> ", response);


    return response.data;
  } catch (error) {
    console.error("Fetch FY Data Error:", error);
    throw error;
  }
};




export const updateRemark = async (stationCode, year, remark) => {
  try {
    const response = await apiConnector(
      "PUT",
      `${UPDATE_REMARK_API}/${stationCode}/${year}`,
      { remark }
    );

    return response.data;
  } catch (err) {
    console.error("Update Remark Error:", err);
    throw err;
  }
};


export const logoutStation = (navigate) => async (dispatch) => {
  try {
    console.log("Station logout...");

    const response = await apiConnector(
      "POST",
      LOGOUT_STATION_API,
      null,
      { withCredentials: true } // required for clearing cookies
    );

    if (!response?.data?.success) {
      toast.error("Logout failed");
      return;
    }

    // ✅ Clear station from Redux auth state
    dispatch(clearStation());

    // toast.success("Logged out successfully");

    // Redirect to login page or landing page
    navigate("/");

  } catch (error) {
    console.error("Logout Error:", error);
    // toast.error("Logout failed");
  }
};

