import { Router } from "express";
import {
  createMedia,
  getMedias,
  getMediaById,
  updateMedia,
  deleteMedia,
} from "../controllers/media.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * @openapi
 * /api/media:
 *   get:
 *     summary: Obtener todos los registros de Media
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: Lista de medios obtenida correctamente.
 *   post:
 *     summary: Crear un nuevo registro de Media
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://mystorage.blob.core.windows.net/videos/video1.mp4"
 *               tags:
 *                 type: string
 *                 example: "promo, octubre, lanzamiento"
 *     responses:
 *       201:
 *         description: Media creado correctamente.
 */

/**
 * @openapi
 * /api/media/{id}:
 *   get:
 *     summary: Obtener un Media por su ID
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del Media
 *     responses:
 *       200:
 *         description: Media encontrado correctamente.
 *       404:
 *         description: Media no encontrado.
 *   put:
 *     summary: Actualizar un Media existente
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del Media
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://mystorage.blob.core.windows.net/videos/video2.mp4"
 *               tags:
 *                 type: string
 *                 example: "actualizado, noviembre"
 *     responses:
 *       200:
 *         description: Media actualizado correctamente.
 *       404:
 *         description: Media no encontrado.
 *   delete:
 *     summary: Eliminar un Media por su ID
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del Media
 *     responses:
 *       200:
 *         description: Media eliminado correctamente.
 *       404:
 *         description: Media no encontrado.
 */

router.get("/media/", authMiddleware, getMedias);
router.post("/media/", authMiddleware, createMedia);
router.get("/media/:id", authMiddleware, getMediaById);
router.put("/media/:id", authMiddleware, updateMedia);
router.delete("/media/:id", authMiddleware, deleteMedia);

export default router;
