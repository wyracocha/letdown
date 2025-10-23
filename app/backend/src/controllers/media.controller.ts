import type { Request, Response } from "express";
import Media from "../models/Media";

/**
 * @desc Obtener todos los medios
 */
export const getMedias = async (_req: Request, res: Response) => {
  try {
    const medias = await Media.find().sort({ date: -1 });
    res.status(200).json(medias);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Obtener un media por ID
 */
export const getMediaById = async (req: Request, res: Response) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media no encontrado" });
    res.status(200).json(media);
  } catch (error: any) {
    res.status(400).json({ message: "ID inválido o error al obtener media" });
  }
};

/**
 * @desc Crear un nuevo media
 */
export const createMedia = async (req: Request, res: Response) => {
  try {
    const media = new Media(req.body);
    const savedMedia = await media.save();
    res.status(201).json(savedMedia);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Actualizar un media
 */
export const updateMedia = async (req: Request, res: Response) => {
  try {
    const updated = await Media.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Media no encontrado" });
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Eliminar un media
 */
export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const deleted = await Media.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Media no encontrado" });
    res.status(200).json({ message: "Media eliminado correctamente" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
