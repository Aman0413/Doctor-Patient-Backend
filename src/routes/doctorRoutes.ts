import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  addDoctor,
  deleteDoctor,
  getDoctor,
  getDoctors,
  updateDoctor,
} from "../controllers/doctorControllers";

const router = express.Router();

// Add a new doctor (Authenticated users only).
router.post("/", authMiddleware, addDoctor);

// Retrieve all doctors.
router.get("/", getDoctors);

// Get details of a specific doctor.
router.get("/:id", getDoctor);

// Update doctor details.
router.put("/:id", updateDoctor);

// Delete a doctor record.
router.delete("/:id", deleteDoctor);

export default router;
