import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createKiosko,
  getKioskos,
  updateKiosko,
  deleteKiosko,
} from "../controllers/kiosko.controller";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Kiosko
 *     description: Endpoints para gestionar kioskos
 */

/**
 * @openapi
 * /api/kiosko:
 *   get:
 *     summary: Obtener todos los kioskos
 *     tags: [Kiosko]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de kioskos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Kiosko'
 */
router.get("/kiosko", authMiddleware, getKioskos);

/**
 * @openapi
 * /api/kiosko:
 *   post:
 *     summary: Crear un nuevo kiosko
 *     tags: [Kiosko]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Kiosko'
 *     responses:
 *       201:
 *         description: Kiosko creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Kiosko'
 *       400:
 *         description: Error en los datos enviados
 */
router.post("/kiosko", authMiddleware, createKiosko);

/**
 * @openapi
 * /api/kiosko/{id}:
 *   put:
 *     summary: Actualizar un kiosko por ID
 *     tags: [Kiosko]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del kiosko
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Kiosko'
 *     responses:
 *       200:
 *         description: Kiosko actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Kiosko'
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Kiosko no encontrado
 */
router.put("/kiosko/:id", authMiddleware, updateKiosko);

/**
 * @openapi
 * /api/kiosko/{id}:
 *   delete:
 *     summary: Eliminar un kiosko por ID
 *     tags: [Kiosko]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del kiosko
 *     responses:
 *       200:
 *         description: Kiosko eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kiosko deleted successfully
 *       404:
 *         description: Kiosko no encontrado
 */
router.delete("/kiosko/:id", authMiddleware, deleteKiosko);

export default router;
