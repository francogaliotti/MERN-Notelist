import * as NotesController from "../controllers/notes_controller"
import express from "express";

const router = express.Router();

router.get("/", NotesController.index);
router.get("/:id", NotesController.show)
router.post("/", NotesController.create);
router.patch("/:id", NotesController.update);
router.delete("/:id", NotesController.destroy);
router.post("/filter", NotesController.filterNote);

export default router;