import express from "express";
import {
  createStation,
  loginStation,
  logoutStation,
  refreshStationAccessToken
} from "../controllers/stationAuthController.js";

import { getAllStations, updateYearlyBudget, getStationByFinancialYear, updateRemark } from "../controllers/stationController.js";

import { isAdmin } from "../middlewares/isAdmin.js";
import { isStation } from "../middlewares/isStation.js";


const router = express.Router();

router.post("/login", loginStation);
router.post("/logout", isStation, logoutStation);
router.get(
  "/get-station-detail-by-financial-year/:stationCode/:year",
  isStation,
  getStationByFinancialYear
);
router.post("/refresh-token", refreshStationAccessToken);
router.put("/update-remark/:stationCode/:year", isStation, updateRemark);




router.post("/create-station", isAdmin, createStation);
router.get("/get-all-stations", isAdmin, getAllStations);
router.put("/update-budget/:stationCode/:year", isAdmin, updateYearlyBudget);

export default router;
