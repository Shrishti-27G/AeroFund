import { apiConnector } from "../apiConnector";
import { toast } from "sonner";
import { stationEndpoints } from "../apiEndpoints/stationsEndpoints.js"


export const { Create_Stations_API, Get_All_Stations_API, Update_Budget_API, Delete_Financial_Year_API, Delete_Station_API } = stationEndpoints;



export const createStation = (
    stationName,
    stationCode,
    password,
    email,
    financialYear // ✅ ADDED
) => async (dispatch) => {
    try {
        const response = await apiConnector(
            "POST",
            Create_Stations_API,
            {
                stationName,
                stationCode,
                password,
                email,
                financialYear, // ✅ SENT TO BACKEND
            }
        );

        if (!response?.data) {
            toast.error("Station creation failed");
            return null;
        }

        toast.success(response.data.message || "Station created successfully");

        return response.data.station || response.data;

    } catch (error) {
        console.log("CREATE STATION ERROR →", error);
        const msg = error?.response?.data?.message || "Server Error";
        toast.error(msg);
        return null;
    }
};



export const getAllStations = (year) => async (dispatch) => {
    try {
        const url = year
            ? `${Get_All_Stations_API}?year=${year}` // ✅ YEAR FILTER APPLIED
            : Get_All_Stations_API;                  // ✅ DEFAULT = LATEST

        const response = await apiConnector("GET", url);

        if (!response?.data) {
            toast.error("Failed to fetch stations");
            return null;
        }

        console.log("✅ STATIONS API RESPONSE →", response.data);

        return response.data.stations || response.data;

    } catch (error) {
        console.log("GET ALL STATIONS ERROR →", error);
        const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Server Error";
        toast.error(msg);
        return null;
    }
};


export const updateYearlyBudget = (
    stationId,
    year,
    budgetData
) => async (dispatch) => {
    try {
        console.log("Data -> ", budgetData);

        const response = await apiConnector(
            "PUT",
            `${Update_Budget_API}/${stationId}/${year}`, 
            budgetData
        );

        if (!response?.data) {
            toast.error("Budget update failed");
            return null;
        }

        toast.success(response.data.message || "Budget updated successfully");
        return response.data;

    } catch (error) {
        console.log("UPDATE YEARLY BUDGET ERROR →", error);
        const msg = error?.response?.data?.message || "Server Error";
        toast.error(msg);
        return null;
    }
};





export const deleteStation = (stationId) => async (dispatch) => {
    try {
      const response = await apiConnector(
        "DELETE",
        `${Delete_Station_API}/${stationId}`
      );
  
      if (!response?.data?.success) {
        // toast.error("Failed to delete station");
        return false;
      }
  
    //   toast.success(response.data.message || "Station deleted successfully");
      return true;
  
    } catch (error) {
      console.error("DELETE STATION ERROR →", error);
      const msg =
        error?.response?.data?.message ||
        "Server error while deleting station";
    //   toast.error(msg);
      return false;
    }
  };
  

  
export const deleteFinancialYear = (stationId, year) => async (dispatch) => {
    try {
      const response = await apiConnector(
        "DELETE",
        `${Delete_Financial_Year_API}/${stationId}/year/${year}`
      );
  
      if (!response?.data?.success) {
        // toast.error("Failed to delete financial year");
        return false;
      }
  
    //   toast.success(
    //     response.data.message ||
    //     `Financial year ${year}-${year + 1} deleted`
    //   );
  
      return true;
  
    } catch (error) {
      console.error("DELETE FINANCIAL YEAR ERROR →", error);
      const msg =
        error?.response?.data?.message ||
        "Server error while deleting financial year";
    //   toast.error(msg);
      return false;
    }
  };