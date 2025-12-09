import express from "express";
import {
  createStation,
  loginStation,
  logoutStation,
} from "../controllers/stationAuthController.js";

import { getAllStations, updateYearlyBudget } from "../controllers/stationController.js";

import { isAdmin } from "../middlewares/isAdmin.js";


const router = express.Router();

router.post("/login", loginStation);
router.post("/logout", logoutStation);


router.post("/create-station",  isAdmin, createStation);
router.get("/get-all-stations", isAdmin, getAllStations);
router.put("/update-budget/:stationCode/:year", isAdmin, updateYearlyBudget);

export default router;
