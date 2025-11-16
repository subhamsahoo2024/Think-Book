import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
  getById,
} from "../controllers/notesController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Protect all note routes
router.use(verifyToken);

router.get("/", getAllNotes);

router.get("/:id", getById);

router.post("/", createNote);

router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

export default router;
