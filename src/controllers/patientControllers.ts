import { customRequest } from "./../middleware/authMiddleware";
import { Response } from "express";
import { prisma } from "../utils";

// Add a new patient
export const addPatient = async (req: customRequest, res: Response) => {
  try {
    const { name, age, gender, disease } = req.body;

    if (!name || !age || !gender) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    // Ensure the user is authenticated
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Create a new patient record in the database
    const newPatient = await prisma.patient.create({
      data: {
        name,
        age,
        gender,
        disease,
        userId: req.user.id, // Attach the authenticated user's ID
      },
    });

    res.status(201).json({
      success: true,
      message: "Patient added successfully",
      newPatient,
    });
    return;
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: "Error adding patient",
      error,
    });
    return;
  }
};

// Retrieve all patients
export const getPatients = async (req: customRequest, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      where: { userId: req.user!.id },
    });

    if (!patients) {
      res.status(400).json({
        success: false,
        message: "No patients found",
        data: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Patients retrieved",
      data: patients,
    });
    return;
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: "Error while retrieve patients",
      error,
    });
    return;
  }
};

// Get details of a specific patient.
export const getPatient = async (req: customRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Id is required",
      });
      return;
    }
    const patient = await prisma.patient.findMany({
      where: { id: id },
    });

    if (!patient) {
      res.status(400).json({
        success: false,
        message: "No patient found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Patient retrieved",
      data: patient,
    });
    return;
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: "Error while retrieve patient",
      error,
    });
    return;
  }
};

//  Update patient details.
export const updatePatient = async (req: customRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Id is required",
      });
      return;
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: id },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Patient updated",
      data: updatedPatient,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while updating patient",
      error,
    });
    return;
  }
};

//  Delete a patient record.
export const deletePatient = async (req: customRequest, res: Response) => {
  try {
    const patient = await prisma.patient.delete({
      where: { id: req.params.id },
    });

    if (!patient) {
      res.status(400).json({
        success: false,
        message: "No patient found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted",
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while updating patient",
      error,
    });
    return;
  }
};
