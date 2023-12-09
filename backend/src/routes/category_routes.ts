import * as CategoryController from "../controllers/categories_controller"
import express from "express";

const router = express.Router();

router.get("/", CategoryController.index);
router.get("/:id", CategoryController.show)
router.post("/", CategoryController.create);
router.patch("/:id", CategoryController.update);
router.delete("/:id", CategoryController.destroy);

export default router;