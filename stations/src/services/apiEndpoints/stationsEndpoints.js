const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
console.log("Base url ", BASE_URL);


export const stationEndpoints = {
  // 🔐 AUTH
  LOGIN_STATION_API: BASE_URL + "/stations/login",
  LOGOUT_STATION_API: BASE_URL + "/stations/logout",
  REFRESH_TOKEN_API: BASE_URL + "/stations/refresh-token",
  UPDATE_REMARK_API: "/stations/update-remark",
  Refresh_Token_API: BASE_URL + "/stations/refresh-token",


  // 🏢 STATION PROFILE
  GET_STATION_BY_FINANCIAL_YEAR: BASE_URL + "/stations/get-station-detail-by-financial-year",

  // 📊 YEARLY BUDGET
  GET_STATION_BUDGET_API: BASE_URL + "/station/budget",  // GET /station/budget/:year
  UPDATE_STATION_BUDGET_API: BASE_URL + "/station/budget/update", // PUT /update/:year
  UPLOAD_RECEIPT_API: BASE_URL + "/station/budget/upload-receipt",

  // 🏭 ADMIN (optional depending on your backend)
  GET_ALL_STATIONS_API: BASE_URL + "/admin/stations",
  CREATE_STATION_API: BASE_URL + "/admin/station/create",
  UPDATE_STATION_YEARLY_API: BASE_URL + "/admin/station/yearly/update",
};
