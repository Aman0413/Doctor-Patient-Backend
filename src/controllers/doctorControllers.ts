import { Response } from "express";
import { customRequest } from "../middleware/authMiddleware";
import { prisma } from "../utils";

// Add a new doctor (Authenticated users only).
export const addDoctor = async (req: customRequest, res: Response) => {
  try {
    const { name, specialty } = req.body;

    if (!name || !specialty) {
      res.status(400).json({
        success: false,
        message: "All field are required",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialty,
        userId: req.user.id,
      },
    });
    res.status(201).json({
      success: true,
      message: "Doctor added",
      data: doctor,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while adding doctor",
      error,
    });
    return;
  }
};

// Retrieve all doctors.
export const getDoctors = async (req: customRequest, res: Response) => {
  try {
    const doctor = await prisma.doctor.findMany();

    if (!doctor) {
      res.status(400).json({
        success: false,
        message: "No doctors found",
        data: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Doctors retrieved",
      data: doctor,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while retrieveing doctors",
      error,
    });
    return;
  }
};

// Get details of a specific doctor.
export const getDoctor = async (req: customRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Id is required",
      });
      return;
    }

    const doctor = await prisma.doctor.findFirst({
      where: { id: id },
    });

    if (!doctor) {
      res.status(400).json({
        success: false,
        message: "No doctor found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Doctor retrieved",
      data: doctor,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while retrieveing doctor",
      error,
    });
    return;
  }
};

//  Update doctor details.
export const updateDoctor = async (req: customRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Id is required",
      });
      return;
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id: id },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "doctor updated",
      data: updatedDoctor,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while retrieveing doctor",
      error,
    });
    return;
  }
};

// Delete a doctor record.
export const deleteDoctor = async (req: customRequest, res: Response) => {
  try {
    const doctor = await prisma.doctor.delete({
      where: { id: req.params.id },
    });

    if (!doctor) {
      res.status(400).json({
        success: false,
        message: "No doctor found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted",
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while deleting doctor",
      error,
    });
    return;
  }
};
