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
    console.error("Error al subir a Azure:", error);
    res.status(500).json({ message: "Error al subir videos", error });
  }
};
