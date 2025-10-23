import type { Request, Response } from "express";
import Deeplink from "../models/Deeplink";

/**
 * @desc Obtener todos los deeplinks
 */
export const getDeeplinks = async (_req: Request, res: Response) => {
  try {
    const deeplinks = await Deeplink.find().sort({ date: -1 });
    res.status(200).json(deeplinks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Obtener un deeplink por ID
 */
export const getDeeplinkById = async (req: Request, res: Response) => {
  try {
    const deeplink = await Deeplink.findById(req.params.id);
    if (!deeplink)
      return res.status(404).json({ message: "Deeplink no encontrado" });

    res.status(200).json(deeplink);
  } catch (error: any) {
    res.status(400).json({ message: "ID inválido o error al obtener deeplink" });
  }
};

/**
 * @desc Crear un nuevo deeplink
 */
export const createDeeplink = async (req: Request, res: Response) => {
  try {
    const deeplink = new Deeplink(req.body);
    const savedDeeplink = await deeplink.save();
    res.status(201).json(savedDeeplink);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Actualizar un deeplink por ID
 */
export const updateDeeplink = async (req: Request, res: Response) => {
  try {
    const updated = await Deeplink.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Deeplink no encontrado" });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Eliminar un deeplink por ID
 */
export const deleteDeeplink = async (req: Request, res: Response) => {
  try {
    const deleted = await Deeplink.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Deeplink no encontrado" });

    res.status(200).json({ message: "Deeplink eliminado correctamente" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
