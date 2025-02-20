import express from "express";
import {
  assignDoctor,
  getMappings,
  getPatientDoctors,
  removeMapping,
} from "../controllers/mappingsControllers";

const router = express.Router();

// Assign a doctor to a patient.
router.post("/", assignDoctor);

// Retrieve all patient-doctor mappings.
router.get("/", getMappings);

// Get all doctors assigned to a specific patient.
router.get("/:patientId", getPatientDoctors);

// Remove a doctor from a patient.
router.delete("/:id", removeMapping);

export default router;
