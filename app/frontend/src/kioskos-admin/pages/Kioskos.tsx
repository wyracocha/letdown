import React from "react";
import { Button, Modal, Table, Spinner, Alert } from "react-bootstrap";
import KioskoBulkMediaModal from '../KioskoBulkMediaModal';

export type AppItem = { _id: string; name: string; url?: string };
export type MediaItem = { _id: string; url: string; tags?: string };
export type DeepLink =
  | { _id?: string; name?: string; url?: string } // cuando llega “expandido”
  | string; // cuando llega solo el id

export type Kiosko = {
  _id: string;
  name: string;
  address: string;
  active: boolean;
  medias: (MediaItem | string)[];
  deeplinks: DeepLink[];
  date: string; 
};

export type CreateValues = {
  name: string;
  address: string;
  active: boolean;
};

export type EditValues = {
  name: string;
  address: string;
  active: boolean;
  medias: string[];
  deeplinks: string[];
};

export type BulkModalProps<TKiosko> = {
  show: boolean;
  onHide: () => void;
  kioskos: TKiosko[];
  onSuccess: () => void;
};

export interface KioskosManagerProps {
  /** Config/API */
  API_BASE_URL: string;

  /** Data */
  kioskos: Kiosko[];
  appsList: AppItem[];
  mediaList: MediaItem[];

  /** UI state */
  loading: boolean;
  error: string | null;

  /** Selection & editing */
  selectedKioskos: Kiosko[];
  setSelectedKioskos: (next: Kiosko[] | ((prev: Kiosko[]) => Kiosko[])) => void;

  showCreateModal: boolean;
  setShowCreateModal: (v: boolean) => void;

  showBulkModal: boolean;
  setShowBulkModal: (v: boolean) => void;

  showModal: boolean;
  setShowModal: (v: boolean) => void;

  kioskoToDelete: Kiosko | null;
  setKioskoToDelete: (k: Kiosko | null) => void;

  editId: string | null;
  setEditId: (id: string | null) => void;

  editValues: EditValues;
  setEditValues: React.Dispatch<React.SetStateAction<EditValues>>;

  createValues: CreateValues;
  setCreateValues: (next: CreateValues | ((prev: CreateValues) => CreateValues)) => void;

  selectedApps: string[];
  setSelectedApps: (next: string[] | ((prev: string[]) => string[])) => void;

  /** Ops */
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  fetchKioskos: () => void;
  handleEditKiosko: (k: Kiosko) => void;
  handleDelete: () => void;
  sidebarCollapsed?: boolean;
}

const KioskosManager: React.FC<KioskosManagerProps> = (props) => {
  const {
    API_BASE_URL,
    kioskos,
    appsList,
    mediaList,
    loading,
    error,
    selectedKioskos,
    setSelectedKioskos,
    showCreateModal,
    setShowCreateModal,
    showBulkModal,
    setShowBulkModal,
    showModal,
    setShowModal,
    kioskoToDelete,
    setKioskoToDelete,
    editId,
    setEditId,
    editValues,
    setEditValues,
    createValues,
    setCreateValues,
    selectedApps,
    setSelectedApps,
    setLoading,
    setError,
    fetchKioskos,
    handleEditKiosko,
    handleDelete,
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
          Kioskos
        </h1>
        
        <div style={{ display: window.innerWidth > 768 ? "flex" : "block", gap: 12}}>
          <Button
            variant="primary"
            onClick={() => selectedKioskos.length > 0 && setShowBulkModal(true)}
            disabled={selectedKioskos.length === 0}
            title="Agrega elementos con los checkbox para habilitar"
            style={{
              alignItems: "center",
              opacity: selectedKioskos.length === 0 ? 0.5 : 1,
              cursor: selectedKioskos.length === 0 ? "not-allowed" : "pointer",
              pointerEvents: selectedKioskos.length === 0 ? "auto" : "auto",
              transition: "opacity 0.2s",
              display: "flex",
              gap: 8,
              marginBottom: window.innerWidth > 768 ? 0 : 12
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700 }}>⇪</span>
            {selectedKioskos.length === 1
              ? "Subir Videos a 1 Kiosko"
              : selectedKioskos.length > 1
              ? `Subir Videos a (${selectedKioskos.length}) Kioskos `
              : "Subir Videos"}
          </Button>

          <Button
            variant="success"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 18, fontWeight: 700 }}>+</span> Crear
          </Button>
        </div>
      </div>

      {/* Modal: Crear */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered animation>
        <Modal.Header closeButton>
          <Modal.Title>Crear nuevo kiosko</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={createValues.name}
                onChange={(e) => setCreateValues((v) => ({ ...v, name: e.target.value }))}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                value={createValues.address}
                onChange={(e) => setCreateValues((v) => ({ ...v, address: e.target.value }))}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Activo</label>
              <select
                className="form-select"
                value={createValues.active ? "true" : "false"}
                onChange={(e) =>
                  setCreateValues((v) => ({ ...v, active: e.target.value === "true" }))
                }
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Apps</label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {appsList.map((app) => (
                  <label key={app._id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={selectedApps.includes(app._id)}
                      onChange={(e) => {
                        setSelectedApps((arr) =>
                          e.target.checked ? [...arr, app._id] : arr.filter((id) => id !== app._id)
                        );
                      }}
                    />
                    {app.name}
                  </label>
                ))}
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>

          <Button
            variant="success"
            onClick={async () => {
              setLoading(true);
              try {
                await fetch(`${API_BASE_URL}/kiosko`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                  },
                  body: JSON.stringify({
                    ...createValues,
                    medias: [],
                    deeplinks: selectedApps,
                  }),
                });

                setShowCreateModal(false);
                setCreateValues({ name: "", address: "", active: true });
                setSelectedApps([]);
                fetchKioskos();
              } catch {
                setError("Error al crear kiosko");
                setLoading(false);
              }
            }}
          >
            Crear
          </Button>
        </Modal.Footer>
      </Modal>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 120 }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            style={{
              width: '100%',
              maxWidth: '100%',
              transition: 'width 0.7s cubic-bezier(0.4,0.8,0.4,1)',
            }}
          >
            <thead>
              <tr>
                <th style={{ minWidth: "40px" }}>Subir videos a:</th>
                <th style={{minWidth: '160px'}}>Nombre</th>
                <th style={{minWidth: '180px'}}>Dirección</th>
                <th style={{minWidth: '100px'}}>Activo</th>
                <th style={{minWidth: '160px'}} title="Los Apps se manejan a detalle en el módulo de Apps">Apps*</th>
                <th style={{minWidth: '300px'}} title="Los videos se manejan a detalle en el módulo de Videos">Videos*</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {kioskos.map((k) =>
                editId === k._id ? (
                  <tr key={k._id}>
                    <td>
                      <input
                        type="checkbox"
                        className="kiosko-checkbox"
                        checked={selectedKioskos.some((s) => s._id === k._id)}
                        onChange={(e) => {
                          setSelectedKioskos((s) =>
                            e.target.checked ? [...s, k] : s.filter((sel) => sel._id !== k._id)
                          );
                        }}
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
                        className="form-control"
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={editValues.address}
                        onChange={(e) => setEditValues((v) => ({ ...v, address: e.target.value }))}
                        className="form-control"
                      />
                    </td>

                    <td>
                      <select
                        value={editValues.active ? "true" : "false"}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, active: e.target.value === "true" }))
                        }
                        className="form-select"
                      >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {appsList.map((app) => (
                          <label
                            key={app._id}
                            style={{ display: "flex", alignItems: "center", gap: 8 }}
                          >
                            <input
                              type="checkbox"
                              checked={editValues.deeplinks?.includes(app._id) || false}
                              onChange={(e) => {
                                setEditValues((v) => ({
                                  ...v,
                                  deeplinks: e.target.checked
                                    ? [...(v.deeplinks || []), app._id]
                                    : (v.deeplinks || []).filter((id: string) => id !== app._id),
                                }));
                              }}
                            />
                            {app.name}
                          </label>
                        ))}
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {mediaList.map((media) => (
                          <label
                            key={media._id}
                            style={{ display: "flex", alignItems: "center", gap: 8 }}
                          >
                            <input
                              type="checkbox"
                              checked={editValues.medias?.includes(media._id) || false}
                              onChange={(e) => {
                                setEditValues((v) => ({
                                  ...v,
                                  medias: e.target.checked
                                    ? [...(v.medias || []), media._id]
                                    : (v.medias || []).filter((id: string) => id !== media._id),
                                }));
                              }}
                            />
                            {media.url.split("/").pop()}
                          </label>
                        ))}
                      </div>
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
                              await fetch(`${API_BASE_URL}/kiosko/${k._id}`, {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                                },
                                body: JSON.stringify(editValues),
                              });
                              setEditId(null);
                              fetchKioskos();
                            } catch {
                              setError("Error al actualizar kiosko");
                              setLoading(false);
                            }
                          }}
                        >
                          Aceptar
                        </Button>

                        <Button variant="secondary" size="sm" onClick={() => setEditId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={k._id}>
                    <td>
                      <input
                        type="checkbox"
                        className="kiosko-checkbox"
                        checked={selectedKioskos.some((s) => s._id === k._id)}
                        onChange={(e) => {
                          setSelectedKioskos((s) =>
                            e.target.checked ? [...s, k] : s.filter((sel) => sel._id !== k._id)
                          );
                        }}
                      />
                    </td>

                    <td>{k.name}</td>
                    <td>{k.address}</td>
                    <td>{k.active ? "Sí" : "No"}</td>

                    <td>
                      {Array.isArray(k.deeplinks) && k.deeplinks.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                          {k.deeplinks.map((d: any, idx: number) => (
                            <li key={d._id || d.url || idx}>
                                {idx+1}.&nbsp;
                              <a href={d.url} target="_blank" rel="noopener noreferrer">
                                {d.name || d.url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: "#888" }}>-</span>
                      )}
                    </td>

                    <td>
                      {Array.isArray(k.medias) && k.medias.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                          {k.medias.map((m: any, idx: number) => {
                            let fileName = m.url ? m.url.split("/").pop() : "";
                            if (fileName && /^[a-zA-Z]/.test(fileName)) {
                              fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
                            }
                            return (
                              <li key={m._id || m.url}>
                                {idx+1}.&nbsp;
                                <a href={m.url} target="_blank" rel="noopener noreferrer">
                                  {m.tags && (
                                    <span style={{
                                      color: 'rgb(13,110,253)',
                                      fontSize: 14,
                                      fontWeight: 500
                                    }}>
                                      {m.tags}
                                    </span>
                                  )}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <span style={{ color: "#888" }}>-</span>
                      )}
                    </td>


                    <td>
                      <div style={{ display: "flex", gap: "8px", minWidth: 160 }}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditKiosko(k)}
                        >
                          Editar
                        </Button>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setKioskoToDelete(k);
                            setShowModal(true);
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

          <KioskoBulkMediaModal
            show={showBulkModal}
            onHide={() => setShowBulkModal(false)}
            kioskos={selectedKioskos}
            onSuccess={() => {
              setShowBulkModal(false);
              setSelectedKioskos([]);
              fetchKioskos();
            }}
          />

          <Modal show={showModal} onHide={() => setShowModal(false)} centered animation>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Seguro que deseas eliminar el kiosko <b>{kioskoToDelete?.address}</b>?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default KioskosManager;
