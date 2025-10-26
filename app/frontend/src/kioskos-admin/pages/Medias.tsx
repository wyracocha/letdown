import React from "react";
import { Button, Modal, Table, Spinner, Alert } from "react-bootstrap";

export type Media = {
  _id: string;
  url: string;
  tags: string;
};

export type MediaCreateValues = {
  url: string;
  tags: string;
};

export type MediaEditValues = {
  url: string;
  tags: string;
};

export interface MediasManagerProps {
  /** Config/API */
  API_BASE_URL: string;

  /** Data */
  medias: Media[];

  /** UI state */
  loading: boolean;
  error: string | null;

  /** Create modal */
  showMediaCreateModal: boolean;
  setShowMediaCreateModal: React.Dispatch<React.SetStateAction<boolean>>;

  /** Delete modal */
  showMediaDeleteModal: boolean;
  setShowMediaDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;

  /** Edit row state */
  mediaEditId: string | null;
  setMediaEditId: React.Dispatch<React.SetStateAction<string | null>>;
  mediaEditValues: MediaEditValues;
  setMediaEditValues: React.Dispatch<React.SetStateAction<MediaEditValues>>;

  /** Create values */
  mediaCreateValues: MediaCreateValues;
  setMediaCreateValues: React.Dispatch<React.SetStateAction<MediaCreateValues>>;

  /** Upload state/handlers */
  mediaUploaded: boolean;
  setMediaUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  mediaUploadLoading: boolean;
  handleMediaDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleMediaFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /** Delete flow */
  mediaToDelete: Media | null;
  setMediaToDelete: React.Dispatch<React.SetStateAction<Media | null>>;

  /** External ops */
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  fetchMedias: () => void;

  /** Context (por si usas tabs para condicionar un modal adicional) */
  active?: string; // ej. "medias" | "kioskos" | ...
}

const MediasManager: React.FC<MediasManagerProps> = (props) => {
  const {
    API_BASE_URL,
    medias,
    loading,
    error,
    showMediaCreateModal,
    setShowMediaCreateModal,
    showMediaDeleteModal,
    setShowMediaDeleteModal,
    mediaEditId,
    setMediaEditId,
    mediaEditValues,
    setMediaEditValues,
    mediaCreateValues,
    setMediaCreateValues,
    mediaUploaded,
    setMediaUploaded,
    mediaUploadLoading,
    handleMediaDrop,
    handleMediaFileChange,
    mediaToDelete,
    setMediaToDelete,
    setLoading,
    setError,
    fetchMedias,
    active,
  } = props;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ color: "#287cfa", fontWeight: 700, fontSize: "2.2rem", margin: 0 }}>
          Videos
        </h1>
        <Button
          variant="success"
          size="sm"
          onClick={() => setShowMediaCreateModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <span style={{ fontSize: 18, fontWeight: 700 }}>+</span> Crear
        </Button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 120 }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>URL</th>
                <th>Tags</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {medias.map((m) =>
                mediaEditId === m._id ? (
                  <tr key={m._id}>
                    <td>
                      <input
                        type="text"
                        value={mediaEditValues.url}
                        onChange={(e) => setMediaEditValues((v) => ({ ...v, url: e.target.value }))}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={mediaEditValues.tags}
                        onChange={(e) => setMediaEditValues((v) => ({ ...v, tags: e.target.value }))}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", minWidth: 160 }}>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={async () => {
                            setLoading(true);
                            try {
                              await fetch(`${API_BASE_URL}/media/${m._id}`, {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                                },
                                body: JSON.stringify(mediaEditValues),
                              });
                              setMediaEditId(null);
                              fetchMedias();
                            } catch {
                              setError("Error al actualizar media");
                              setLoading(false);
                            }
                          }}
                        >
                          Aceptar
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setMediaEditId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={m._id}>
                    <td>
                      {(() => {
                        let fileName = m.url ? m.url.split("/").pop() : "";
                        if (fileName && /^[a-zA-Z]/.test(fileName)) {
                          fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
                        }
                        return (
                          <a href={m.url} target="_blank" rel="noopener noreferrer">
                            {fileName}
                          </a>
                        );
                      })()}
                    </td>
                    <td>{m.tags}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", minWidth: 160 }}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setMediaEditId(m._id);
                            setMediaEditValues({ url: m.url, tags: m.tags });
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setMediaToDelete(m);
                            setShowMediaDeleteModal(true);
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>

          {/* Crear media */}
          <Modal
            show={showMediaCreateModal}
            onHide={() => {
              setShowMediaCreateModal(false);
              setMediaUploaded(false);
              setMediaCreateValues({ url: "", tags: "" });
            }}
            centered
            animation
          >
            <Modal.Header closeButton>
              <Modal.Title>Crear nuevo Video</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label className="form-label">Subir Video</label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleMediaDrop}
                    style={{
                      border: "2px dashed #287cfa",
                      borderRadius: 8,
                      padding: 16,
                      textAlign: "center",
                      marginBottom: 8,
                      background: "#f8f9fa",
                      cursor: mediaUploaded ? "not-allowed" : "default",
                      opacity: mediaUploaded ? 0.6 : 1,
                    }}
                  >
                    Arrastra aquí el video para subirlo
                  </div>
                  <div style={{ textAlign: "center" }}>ó</div>
                  <input
                    type="file"
                    accept="video/*"
                    disabled={mediaUploaded}
                    onChange={handleMediaFileChange}
                    style={{ marginBottom: 8 }}
                  />
                  {mediaUploadLoading && (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 40 }}>
                      <Spinner animation="border" variant="primary" />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">URL</label>
                  <input type="text" className="form-control" value={mediaCreateValues.url} disabled />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    className="form-control"
                    value={mediaCreateValues.tags}
                    onChange={(e) => setMediaCreateValues((v) => ({ ...v, tags: e.target.value }))}
                    required
                  />
                </div>
              </form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowMediaCreateModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="success"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await fetch(`${API_BASE_URL}/media`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                      },
                      body: JSON.stringify(mediaCreateValues),
                    });
                    setShowMediaCreateModal(false);
                    setMediaCreateValues({ url: "", tags: "" });
                    fetchMedias();
                  } catch {
                    setError("Error al crear media");
                    setLoading(false);
                  }
                }}
              >
                Crear
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Eliminar media (desde botón Eliminar) */}
          <Modal show={showMediaDeleteModal} onHide={() => setShowMediaDeleteModal(false)} centered animation>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Seguro que deseas eliminar la media <b>{mediaToDelete?.url}</b>?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowMediaDeleteModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (!mediaToDelete) return;
                  setLoading(true);
                  try {
                    await fetch(`${API_BASE_URL}/media/${mediaToDelete._id}`, {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                      },
                    });
                    setShowMediaDeleteModal(false);
                    setMediaToDelete(null);
                    fetchMedias();
                  } catch {
                    setError("Error al eliminar media");
                    setLoading(false);
                  }
                }}
              >
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Eliminar media (cuando editas y dejas url/tags vacíos) */}
          {active === "medias" && (
            <Modal
              show={!!mediaEditId && mediaEditValues.url === "" && mediaEditValues.tags === ""}
              onHide={() => setMediaEditId(null)}
              centered
              animation
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirmar eliminación</Modal.Title>
              </Modal.Header>
              <Modal.Body>¿Seguro que deseas eliminar la media seleccionada?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setMediaEditId(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    if (!mediaEditId) return;
                    setLoading(true);
                    try {
                      await fetch(`${API_BASE_URL}/media/${mediaEditId}`, {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                        },
                      });
                      setMediaEditId(null);
                      fetchMedias();
                    } catch {
                      setError("Error al eliminar media");
                      setLoading(false);
                    }
                  }}
                >
                  Eliminar
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default MediasManager;
