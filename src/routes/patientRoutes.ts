import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  addPatient,
  deletePatient,
  getPatient,
  getPatients,
  updatePatient,
} from "../controllers/patientControllers";

const router = express.Router();

// Add a new patient (Authenticated users only).
router.post("/", authMiddleware, addPatient);

// Retrieve all patients created by the authenticated user
router.get("/", authMiddleware, getPatients);

// Get details of a specific patient.
router.get("/:id", getPatient);

// Update patient details.
router.put("/:id", updatePatient);

// Delete a patient record.
router.delete("/:id", deletePatient);

export default router;
