import express from "express";
import {
    signupSupervisor,
    loginSupervisor,
    logoutSupervisor,
} from "../controllers/supervisorAuthController.js"

const router = express.Router();

router.post("/signup", signupSupervisor);
router.post("/login", loginSupervisor);
router.post("/logout", logoutSupervisor);

export default router;
 