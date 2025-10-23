import { Router } from "express";
import { login } from "../controllers/auth.controller";

const router = Router();

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Inicia sesión y genera un token JWT
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - password
 *             properties:
 *               user:
 *                 type: string
 *                 example: admin
 *                 description: Nombre de usuario (por defecto "admin")
 *               password:
 *                 type: string
 *                 example: 1234
 *                 description: Contraseña del usuario (por defecto "1234")
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Credenciales inválidas o usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid password
 *       500:
 *         description: Error interno del servidor
 */

router.post("/login", login);

export default router;
