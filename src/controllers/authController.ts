import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils";
import { Request, Response } from "express";

// Register User
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }
    // check user in db before register
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      res
        .status(400)
        .json({ success: false, message: "User alrady registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res
      .status(201)
      .json({ success: true, message: "User registered", newUser });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred",
        error: error.message,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "An unknown error occurred", error });
    }
  }
};

// Login User
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    const isMatch = await bcrypt.compare(password, user!.password);

    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Invalid credentails",
      });

      return;
    }

    const token = jwt.sign({ userId: user!.id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    // store token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development", // Secure in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ success: true, token });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: "Error while login user",
        error: error.message,
      });
      return;
    } else {
      res
        .status(500)
        .json({ success: false, message: "An unknown error occurred", error });
      return;
    }
  }
};
