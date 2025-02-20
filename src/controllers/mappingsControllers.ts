import { Response } from "express";
import { customRequest } from "../middleware/authMiddleware";
import { prisma } from "../utils";

// Assign a doctor to a patient
export const assignDoctor = async (req: customRequest, res: Response) => {
  try {
    const { patientId, doctorId } = req.body;

    if (!patientId || !doctorId) {
      res.status(400).json({
        success: false,
        message: "patientId & doctorId required",
      });
      return;
    }

    const mapping = await prisma.mapping.create({
      data: { patientId, doctorId },
    });

    res.status(201).json({
      success: true,
      message: "Assign a doctor to a patient",
      data: mapping,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while assigning doctor",
      error,
    });
    return;
  }
};

// Retrieve all patient-doctor mappings.
export const getMappings = async (req: customRequest, res: Response) => {
  try {
    const mappings = await prisma.mapping.findMany();
    if (!mappings) {
      res.status(400).json({
        success: false,
        message: "No mapping found",
        data: [],
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Mapping found",
      data: mappings,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while mapping doctor",
      error,
    });
    return;
  }
};

//  Get all doctors assigned to a specific patient.
export const getPatientDoctors = async (req: customRequest, res: Response) => {
  try {
    const patientId = req.params.patientId;

    if (!patientId) {
      res.status(400).json({
        success: false,
        message: "patientId is required",
      });
      return;
    }
    const mappings = await prisma.mapping.findMany({
      where: { patientId },
      include: { doctor: true },
    });

    if (!mappings) {
      res.status(400).json({
        success: false,
        message: "No doctor patient mappings found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Doctor patient mappings found",
      data: mappings,
    });

    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while doctor patient mappings",
      error,
    });
    return;
  }
};

// Remove a doctor from a patient.
export const removeMapping = async (req: customRequest, res: Response) => {
  try {
    const mapId = req.params.id;

    if (!mapId) {
      res.status(400).json({
        success: false,
        message: "Mapping id is required",
      });
      return;
    }
    await prisma.mapping.delete({ where: { id: mapId } });

    res.status(200).json({
      success: true,
      message: "Mapping removed",
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while removing mappings",
      error,
    });
    return;
  }
};
