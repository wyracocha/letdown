import type { Request, Response } from "express";
import multer from "multer";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

const account = process.env.AZURE_STORAGE_ACCOUNT!;
const accountKey = process.env.AZURE_STORAGE_KEY!;
const containerName = process.env.AZURE_CONTAINER_NAME!;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);

export const uploadVideos = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No se recibieron archivos" });
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists({ access: "blob" });

    const uploaded = [];

    for (const file of files) {
      const blobName = `${Date.now()}_${file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      uploaded.push({
        name: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: blockBlobClient.url,
      });
    }

    res.status(200).json({
      message: "Videos subidos correctamente a Azure",
      uploaded,
    });
  } catch (error: any) {
    let details = [];
  
    // 1️⃣ Mensaje base
    details.push(`Mensaje: ${error.message || "Error desconocido"}`);
  
    // 2️⃣ Código del error (si existe)
    if (error.code) details.push(`Código: ${error.code}`);
  
    // 3️⃣ Revisión de variables clave (sin mostrar valores reales)
    if (!process.env.AZURE_STORAGE_ACCOUNT) details.push("Falta AZURE_STORAGE_ACCOUNT");
    if (!process.env.AZURE_STORAGE_KEY) details.push("Falta AZURE_STORAGE_KEY");
    if (!process.env.AZURE_CONTAINER_NAME) details.push("Falta AZURE_CONTAINER_NAME");
  
    // 4️⃣ Revisión de datos del archivo recibido
    if (!req.file) {
      details.push("req.file no definido (multer no procesó el archivo)");
    } else {
      details.push(`Archivo: ${req.file.originalname} (${req.file.mimetype}, ${req.file.size} bytes)`);
    }
  
    // 5️⃣ Revisión de container name (si lo usas desde variable o constante)
    if (!process.env.AZURE_STORAGE_CONTAINER && !containerName) {
      details.push("containerName no definido o vacío");
    }
  
    // 6️⃣ Combinar todo en un mensaje de salida
    const message = details.join(" | ");
  
    res.status(500).json({
      message: "Error al subir videos",
      error: message
    });
  }
};
