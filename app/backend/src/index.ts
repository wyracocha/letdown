import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import kioskoRoutes from "./routes/kiosko.routes";
import { setupSwagger } from "./swagger";
import mediaRoutes from "./routes/media.routes";
import deeplinkRoutes from "./routes/deeplink.routes";
import uploadRouter from "./routes/upload.routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", authRoutes);
app.use("/api", kioskoRoutes);
app.use("/api", mediaRoutes);
app.use("/api", deeplinkRoutes);
app.use("/api", uploadRouter);
setupSwagger(app);

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
