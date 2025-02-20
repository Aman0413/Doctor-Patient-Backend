import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils";

export interface customRequest extends Request {
  user?: { id: string; name: string; email: string };
}
export const authMiddleware = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from cookies
    const token = req.cookies?.token;

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Fetch user from the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token", error });
    return;
  }
};
