import express from "express";
import { getAuthenticatedUser, login, signUp, logout } from "../controllers/users_controller";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/", getAuthenticatedUser);
router.post("/logout", logout);

export default router;