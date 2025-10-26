import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';

interface Kiosko {
  _id: string;
  name: string;
  address: string;
  active: boolean;
  date: string;
  medias?: any[];
  deeplinks?: any[];
}
interface Media {
  _id: string;
  url: string;
  tags: string;
}
interface Props {
  show: boolean;
  onHide: () => void;
  kioskos: Kiosko[];
  onSuccess?: (medias: Media[]) => void;
}

export default function KioskoBulkMediaModal({ show, onHide, kioskos, onSuccess }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mediaCreated, setMediaCreated] = useState<Media[]>([]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFiles(Array.from(e.dataTransfer.files));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };
  const handleUpload = async () => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('videos', f));
      const uploadRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.uploaded || !Array.isArray(uploadData.uploaded)) throw new Error('Error en subida');
      // Crear media para cada url
      const medias: Media[] = [];
      for (const fileObj of uploadData.uploaded) {
        const url = fileObj.url;
        const mediaRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/media`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({ url, tags: '' }),
        });
        const media: Media = await mediaRes.json();
        medias.push(media);
      }
      setMediaCreated(medias);
      // Actualizar kioskos
      for (const kiosko of kioskos) {
        const updated: Kiosko = { ...kiosko, medias: [...(kiosko.medias || []), ...medias] };
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/kiosko/${kiosko._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify(updated),
        });
      }
      onSuccess && onSuccess(medias);
    } catch (err) {
      setError('Error al subir o asociar videos');
    }
    setUploading(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cargar videos a kiosko(s)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{ border: '2px dashed #287cfa', borderRadius: 12, padding: 24, textAlign: 'center', marginBottom: 16 }}
        >
          <div style={{ marginBottom: 8 }}>Arrastra aquí los videos o selecciona:</div>
          <Form.Control type="file" multiple accept="video/mp4" onChange={handleFileChange} disabled={uploading} />
          {files.length > 0 && (
            <div style={{ marginTop: 16, textAlign: 'left' }}>
              <b>Videos seleccionados:</b>
              <ul style={{ paddingLeft: 18 }}>
                {files.map((f, idx) => (
                  <li key={idx}>{f.name} ({(f.size/1024/1024).toFixed(2)} MB)</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {mediaCreated.length > 0 && <Alert variant="success">Videos subidos y asociados correctamente.</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={uploading}>Cerrar</Button>
        <Button variant="primary" onClick={handleUpload} disabled={uploading || files.length === 0}>
          {uploading ? <Spinner animation="border" size="sm" /> : 'Subir y asociar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
