import type { Request, Response } from "express";
import { generateToken } from "../utils/jwt";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "1234";

export const login = async (req: Request, res: Response) => {
  const { user, password } = req.body;

  if (user !== ADMIN_USER)
    return res.status(400).json({ message: "User not found" });

  if (password !== ADMIN_PASS)
    return res.status(400).json({ message: "Invalid password" });

  const token = generateToken({ user });
  res.json({ token });
};
