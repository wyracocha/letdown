import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createDeeplink,
  getDeeplinks,
  getDeeplinkById,
  updateDeeplink,
  deleteDeeplink,
} from "../controllers/deeplink.controller";

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Deeplink:
 *       type: object
 *       required:
 *         - name
 *         - url
 *       properties:
 *         _id:
 *           type: string
 *           example: 652a1b2c4e7a3f45d6e8c9f0
 *         name:
 *           type: string
 *           example: Yango
 *         url:
 *           type: string
 *           example: yango://promo/123
 *         date:
 *           type: string
 *           format: date-time
 *           example: 2025-10-12T05:10:00.000Z
 */

/**
 * @openapi
 * /api/deeplink:
 *   get:
 *     summary: Obtener todos los deeplinks
 *     tags: [Deeplinks]
 *     responses:
 *       200:
 *         description: Lista de deeplinks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Deeplink'
 */
router.get("/deeplink/", authMiddleware, getDeeplinks);

/**
 * @openapi
 * /api/deeplink/{id}:
 *   get:
 *     summary: Obtener un deeplink por su ID
 *     tags: [Deeplinks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del deeplink
 *     responses:
 *       200:
 *         description: Deeplink encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deeplink'
 *       404:
 *         description: Deeplink no encontrado
 */
router.get("/deeplink/:id", authMiddleware, getDeeplinkById);

/**
 * @openapi
 * /api/deeplink:
 *   post:
 *     summary: Crear un nuevo deeplink
 *     tags: [Deeplinks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deeplink'
 *     responses:
 *       201:
 *         description: Deeplink creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deeplink'
 */
router.post("/deeplink/", authMiddleware, createDeeplink);

/**
 * @openapi
 * /api/deeplink/{id}:
 *   put:
 *     summary: Actualizar un deeplink existente
 *     tags: [Deeplinks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del deeplink a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deeplink'
 *     responses:
 *       200:
 *         description: Deeplink actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deeplink'
 *       404:
 *         description: Deeplink no encontrado
 */
router.put("/deeplink/:id", authMiddleware, updateDeeplink);

/**
 * @openapi
 * /api/deeplink/{id}:
 *   delete:
 *     summary: Eliminar un deeplink
 *     tags: [Deeplinks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del deeplink a eliminar
 *     responses:
 *       200:
 *         description: Deeplink eliminado correctamente
 *       404:
 *         description: Deeplink no encontrado
 */
router.delete("/deeplink/:id", authMiddleware, deleteDeeplink);

export default router;
