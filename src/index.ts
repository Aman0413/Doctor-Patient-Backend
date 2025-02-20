import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import patientRoutes from "./routes/patientRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import mappingRoutes from "./routes/mappingRoutes";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { Response, Request } from "express";
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/mappings", mappingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Ok from Server",
  });
  return;
});
