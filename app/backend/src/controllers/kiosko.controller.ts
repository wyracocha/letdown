import type { Request, Response } from "express";
import { Kiosko } from "../models";

/**
 * @desc Obtener todos los kioskos (con sus medias y deeplinks)
 */
export const getKioskos = async (_req: Request, res: Response) => {
  try {
    const kioskos = await Kiosko.find()
      .populate("medias")
      .populate("deeplinks");
    res.status(200).json(kioskos);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Crear un nuevo kiosko
 */
export const createKiosko = async (req: Request, res: Response) => {
  try {
    const kiosko = new Kiosko(req.body);
    const savedKiosko = await kiosko.save();
    res.status(201).json(savedKiosko);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Actualizar un kiosko por ID
 */
export const updateKiosko = async (req: Request, res: Response) => {
  try {
    const updated = await Kiosko.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("medias")
      .populate("deeplinks");

    if (!updated) {
      return res.status(404).json({ message: "Kiosko no encontrado" });
    }

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Eliminar un kiosko por ID
 */
export const deleteKiosko = async (req: Request, res: Response) => {
  try {
    const deleted = await Kiosko.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Kiosko no encontrado" });
    }
    res.status(200).json({ message: "Kiosko eliminado correctamente" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
