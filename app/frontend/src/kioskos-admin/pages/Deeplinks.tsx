import React from "react";
import { Button, Modal, Table, Spinner, Alert } from "react-bootstrap";

export type Deeplink = {
  _id: string;
  name: string;
  url: string;
  icon?: string;
};

export type DeeplinkCreateValues = {
  name: string;
  url: string;
  icon?: string;
};

export type DeeplinkEditValues = {
  name: string;
  url: string;
};

export interface DeeplinksManagerProps {
  /** Config/API */
  API_BASE_URL: string;

  /** Data */
  deeplinks: Deeplink[];

  /** UI state */
  loading: boolean;
  error: string | null;

  /** Create modal */
  showDeeplinkCreateModal: boolean;
  setShowDeeplinkCreateModal: React.Dispatch<React.SetStateAction<boolean>>;

  /** Delete modal */
  showDeeplinkDeleteModal: boolean;
  setShowDeeplinkDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;

  /** Edit row state */
  deeplinkEditId: string | null;
  setDeeplinkEditId: React.Dispatch<React.SetStateAction<string | null>>;
  deeplinkEditValues: DeeplinkEditValues;
  setDeeplinkEditValues: React.Dispatch<React.SetStateAction<DeeplinkEditValues>>;

  /** Create values */
  deeplinkCreateValues: DeeplinkCreateValues;
  setDeeplinkCreateValues: React.Dispatch<React.SetStateAction<DeeplinkCreateValues>>;

  /** Upload state/handlers */
  iconUploaded: boolean;
  setIconUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  iconUploadLoading: boolean;
  handleIconDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleIconFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /** Delete flow */
  deeplinkToDelete: Deeplink | null;
  setDeeplinkToDelete: React.Dispatch<React.SetStateAction<Deeplink | null>>;

  /** External ops */
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  fetchDeeplinks: () => void;
}

const DeeplinksManager: React.FC<DeeplinksManagerProps> = (props) => {
  const {
    API_BASE_URL,
    deeplinks,
    loading,
    error,
    showDeeplinkCreateModal,
    setShowDeeplinkCreateModal,
    showDeeplinkDeleteModal,
    setShowDeeplinkDeleteModal,
    deeplinkEditId,
    setDeeplinkEditId,
    deeplinkEditValues,
    setDeeplinkEditValues,
    deeplinkCreateValues,
    setDeeplinkCreateValues,
    iconUploaded,
    setIconUploaded,
    iconUploadLoading,
    handleIconDrop,
    handleIconFileChange,
    deeplinkToDelete,
    setDeeplinkToDelete,
    setLoading,
    setError,
    fetchDeeplinks,
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
          Apps
        </h1>
        <Button
          variant="success"
          size="sm"
          onClick={() => setShowDeeplinkCreateModal(true)}
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
                <th>Ícono</th>
                <th>Nombre</th>
                <th>URL</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {deeplinks.map((d, idx) =>
                deeplinkEditId === d._id ? (
                  <tr key={d._id || d.url || idx}>
                    <td>
                      {d.icon ? (
                        <img
                          src={d.icon}
                          alt="icon"
                          style={{ width: 32, height: 32, objectFit: "contain" }}
                        />
                      ) : (
                        <span style={{ color: "#888" }}>-</span>
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        value={deeplinkEditValues.name}
                        onChange={(e) =>
                          setDeeplinkEditValues((v) => ({ ...v, name: e.target.value }))
                        }
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={deeplinkEditValues.url}
                        onChange={(e) =>
                          setDeeplinkEditValues((v) => ({ ...v, url: e.target.value }))
                        }
                        className="form-control"
                      />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", minWidth: 120 }}>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={async () => {
                            setLoading(true);
                            try {
                              await fetch(`${API_BASE_URL}/deeplink/${d._id}`, {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                                },
                                body: JSON.stringify(deeplinkEditValues),
                              });
                              setDeeplinkEditId(null);
                              fetchDeeplinks();
                            } catch {
                              setError("Error al actualizar deeplink");
                              setLoading(false);
                            }
                          }}
                        >
                          Aceptar
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setDeeplinkEditId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={d._id || d.url || idx}>
                    <td>
                      {d.icon ? (
                        <img
                          src={d.icon}
                          alt="icon"
                          style={{ width: 32, height: 32, objectFit: "contain" }}
                        />
                      ) : (
                        <span style={{ color: "#888" }}>-</span>
                      )}
                    </td>
                    <td>{d.name}</td>
                    <td>
                      <a href={d.url} target="_blank" rel="noopener noreferrer">
                        {d.url}
                      </a>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", minWidth: 120 }}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setDeeplinkEditId(d._id);
                            setDeeplinkEditValues({ name: d.name, url: d.url });
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setDeeplinkToDelete(d);
                            setShowDeeplinkDeleteModal(true);
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

          {/* Crear deeplink */}
          <Modal
            show={showDeeplinkCreateModal}
            onHide={() => {
              setShowDeeplinkCreateModal(false);
              setIconUploaded(false);
              setDeeplinkCreateValues({ name: "", url: "", icon: "" });
            }}
            centered
            animation
          >
            <Modal.Header closeButton>
              <Modal.Title>Crear nuevo App</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label className="form-label">Subir Icono</label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleIconDrop}
                    style={{
                      border: "2px dashed #287cfa",
                      borderRadius: 8,
                      padding: 16,
                      textAlign: "center",
                      marginBottom: 8,
                      background: "#f8f9fa",
                      cursor: iconUploaded ? "not-allowed" : "default",
                      opacity: iconUploaded ? 0.6 : 1,
                    }}
                  >
                    Arrastra aquí el icono para subirlo
                  </div>
                  <div style={{ textAlign: "center" }}>ó</div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={iconUploaded}
                    onChange={handleIconFileChange}
                    style={{ marginBottom: 8 }}
                  />
                  {iconUploadLoading && (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 40 }}>
                      <Spinner animation="border" variant="primary" />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Icono URL</label>
                  <input type="text" className="form-control" value={deeplinkCreateValues.icon || ""} disabled />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={deeplinkCreateValues.name}
                    onChange={(e) =>
                      setDeeplinkCreateValues((v) => ({ ...v, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={deeplinkCreateValues.url}
                    onChange={(e) =>
                      setDeeplinkCreateValues((v) => ({ ...v, url: e.target.value }))
                    }
                    required
                  />
                </div>
              </form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeeplinkCreateModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="success"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await fetch(`${API_BASE_URL}/deeplink`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                      },
                      body: JSON.stringify(deeplinkCreateValues),
                    });
                    setShowDeeplinkCreateModal(false);
                    setDeeplinkCreateValues({ name: "", url: "", icon: "" });
                    fetchDeeplinks();
                  } catch {
                    setError("Error al crear deeplink");
                    setLoading(false);
                  }
                }}
              >
                Crear
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Eliminar deeplink */}
          <Modal
            show={showDeeplinkDeleteModal}
            onHide={() => setShowDeeplinkDeleteModal(false)}
            centered
            animation
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Seguro que deseas eliminar el deeplink <b>{deeplinkToDelete?.name}</b>?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeeplinkDeleteModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (!deeplinkToDelete) return;
                  setLoading(true);
                  try {
                    await fetch(`${API_BASE_URL}/deeplink/${deeplinkToDelete._id}`, {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                      },
                    });
                    setShowDeeplinkDeleteModal(false);
                    setDeeplinkToDelete(null);
                    fetchDeeplinks();
                  } catch {
                    setError("Error al eliminar deeplink");
                    setLoading(false);
                  }
                }}
              >
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default DeeplinksManager;
