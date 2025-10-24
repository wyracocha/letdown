import { Router } from "express";
import { upload, uploadVideos } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Sube uno o varios videos (mock)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Videos subidos correctamente
 *       400:
 *         description: No se recibieron archivos
 */
router.post("/upload", authMiddleware, upload.array("videos"), uploadVideos);

export default router;
