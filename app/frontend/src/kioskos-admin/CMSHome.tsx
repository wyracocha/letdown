import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './admin.css';
import CMSMenu from './CMSMenu';
import DeeplinksManager from './pages/Deeplinks';
import KioskosManager from './pages/Kioskos';
import MediasManager from './pages/Medias';

const menuOptions = [
  { key: 'kioskos', label: 'Kioskos' },
  { key: 'medias', label: 'Videos' },
  { key: 'deeplinks', label: 'Apps' },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CMSHome() {
  const [active, setActive] = useState('kioskos');
  const [kioskos, setKioskos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [kioskoToDelete, setKioskoToDelete] = useState<any>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; address: string; active: boolean; deeplinks: string[]; medias: string[] }>({ name: '', address: '', active: true, deeplinks: [], medias: [] });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createValues, setCreateValues] = useState<{ name: string; address: string; active: boolean }>({ name: '', address: '', active: true });
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Medias state
  const [medias, setMedias] = useState<any[]>([]);
  const [mediaEditId, setMediaEditId] = useState<string | null>(null);
  const [mediaEditValues, setMediaEditValues] = useState<{ url: string; tags: string }>({ url: '', tags: '' });
  const [showMediaCreateModal, setShowMediaCreateModal] = useState(false);
  const [mediaCreateValues, setMediaCreateValues] = useState<{ url: string; tags: string }>({ url: '', tags: '' });
  const [showMediaDeleteModal, setShowMediaDeleteModal] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<any>(null);
  const [mediaUploadLoading, setMediaUploadLoading] = useState(false);
  const [mediaUploaded, setMediaUploaded] = useState(false);

  // Deeplinks state
  const [deeplinks, setDeeplinks] = useState<any[]>([]);
  const [deeplinkEditId, setDeeplinkEditId] = useState<string | null>(null);
  const [deeplinkEditValues, setDeeplinkEditValues] = useState<{ name: string; url: string }>({ name: '', url: '' });
  const [showDeeplinkCreateModal, setShowDeeplinkCreateModal] = useState(false);
  const [deeplinkCreateValues, setDeeplinkCreateValues] = useState<{ name: string; url: string; icon?: string }>({ name: '', url: '', icon: '' });
  const [showDeeplinkDeleteModal, setShowDeeplinkDeleteModal] = useState(false);
  const [deeplinkToDelete, setDeeplinkToDelete] = useState<any>(null);
  const [iconUploadLoading, setIconUploadLoading] = useState(false);
  const [iconUploaded, setIconUploaded] = useState(false);
  const [selectedKioskos, setSelectedKioskos] = useState<any[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [appsList, setAppsList] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);

  const fetchKioskos = () => {
    setLoading(true);
    setError('');
    fetch(`${API_BASE_URL}/kiosko`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setKioskos(Array.isArray(data) ? data : []);
      })
      .catch(() => setError('Error al cargar kioskos'))
      .finally(() => setLoading(false));
  };

  const fetchMedias = () => {
    setLoading(true);
    setError('');
    fetch(`${API_BASE_URL}/media`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setMedias(Array.isArray(data) ? data : []);
      })
      .catch(() => setError('Error al cargar medias'))
      .finally(() => setLoading(false));
  };

  const fetchDeeplinks = () => {
    setLoading(true);
    setError('');
    fetch(`${API_BASE_URL}/deeplink`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setDeeplinks(Array.isArray(data) ? data : []);
      })
      .catch(() => setError('Error al cargar deeplinks'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (active === 'kioskos') {
      fetchKioskos();
    } else if (active === 'medias') {
      fetchMedias();
    } else if (active === 'deeplinks') {
      fetchDeeplinks();
    }
  }, [active]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDelete = async () => {
    if (!kioskoToDelete) return;
    setLoading(true);
    setShowModal(false);
    try {
      await fetch(`${API_BASE_URL}/kiosko/${kioskoToDelete._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      fetchKioskos();
    } catch {
      setError('Error al eliminar kiosko');
      setLoading(false);
    }
    setKioskoToDelete(null);
  };
  const handleSelect = (eventKey: string | null) => {
    if (eventKey) setActive(eventKey);
  };

  useEffect(() => {
    if (showCreateModal) {
      fetch(`${API_BASE_URL}/deeplink`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setAppsList(Array.isArray(data) ? data : []);
        });
    }
  }, [showCreateModal]);

  const handleEditKiosko = async (k: any) => {
    setEditId(k._id);
    setEditValues({
      name: k.name,
      address: k.address,
      active: k.active,
      deeplinks: Array.isArray(k.deeplinks) ? k.deeplinks.map((d: any) => d._id || d) : [],
      medias: Array.isArray(k.medias) ? k.medias.map((m: any) => m._id || m) : [],
    });
    if (!appsList || appsList.length === 0) {
      const res = await fetch(`${API_BASE_URL}/deeplink`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      setAppsList(Array.isArray(data) ? data : []);
    }
    if (!mediaList || mediaList.length === 0) {
      const res = await fetch(`${API_BASE_URL}/media`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      setMediaList(Array.isArray(data) ? data : []);
    }
  };

  const handleMediaDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (mediaUploaded) return;
    const files = Array.from(e.dataTransfer.files).slice(0, 1);
    if (files.length === 0) return;
    setMediaUploadLoading(true);
    const formData = new FormData();
    formData.append('videos', files[0]);
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.uploaded && Array.isArray(data.uploaded) && data.uploaded[0]?.url) {
        setMediaCreateValues(v => ({ ...v, url: data.uploaded[0].url }));
        setMediaUploaded(true);
      }
    } catch {
      setError('Error al subir el video');
    }
    setMediaUploadLoading(false);
  };

  const handleMediaFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mediaUploaded) return;
    const files = e.target.files ? Array.from(e.target.files).slice(0, 1) : [];
    if (files.length === 0) return;
    setMediaUploadLoading(true);
    const formData = new FormData();
    formData.append('videos', files[0]);
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.uploaded && Array.isArray(data.uploaded) && data.uploaded[0]?.url) {
        setMediaCreateValues(v => ({ ...v, url: data.uploaded[0].url }));
        setMediaUploaded(true);
      }
    } catch {
      setError('Error al subir el video');
    }
    setMediaUploadLoading(false);
  };

  const handleIconDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (iconUploaded) return;
    const files = Array.from(e.dataTransfer.files).slice(0, 1);
    if (files.length === 0) return;
    setIconUploadLoading(true);
    const formData = new FormData();
    formData.append('videos', files[0]);
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.uploaded && Array.isArray(data.uploaded) && data.uploaded[0]?.url) {
        setDeeplinkCreateValues(v => ({ ...v, icon: data.uploaded[0].url }));
        setIconUploaded(true);
      }
    } catch {
      setError('Error al subir el icono');
    }
    setIconUploadLoading(false);
  };

  const handleIconFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (iconUploaded) return;
    const files = e.target.files ? Array.from(e.target.files).slice(0, 1) : [];
    if (files.length === 0) return;
    setIconUploadLoading(true);
    const formData = new FormData();
    formData.append('videos', files[0]);
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.uploaded && Array.isArray(data.uploaded) && data.uploaded[0]?.url) {
        setDeeplinkCreateValues(v => ({ ...v, icon: data.uploaded[0].url }));
        setIconUploaded(true);
      }
    } catch {
      setError('Error al subir el icono');
    }
    setIconUploadLoading(false);
  };

  return (
    <Container fluid>
      <Row>
        <CMSMenu
          active={active}
          onSelect={handleSelect}
          menuOptions={menuOptions}
          logoSrc="/logo.png"
          collapsed={menuCollapsed}
          setCollapsed={setMenuCollapsed}
        />
        <Col 
          xs={12}
          className="cms-dashboard-content d-flex flex-column align-items-center" 
          style={{ 
            padding: '32px 0',
            transition: 'margin-left 0.3s cubic-bezier(0.4,0.8,0.4,1), width 0.3s cubic-bezier(0.4,0.8,0.4,1)',
            marginLeft: isDesktop ? (menuCollapsed ? '56px' : '240px') : '0',
            width: isDesktop ? (menuCollapsed ? 'calc(100% - 56px)' : 'calc(100% - 240px)') : '100%',
          }}
        >
          <div className="cms-dashboard-card p-5" style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 32px rgba(40,124,250,0.10)', minWidth: '90%', maxWidth: '95%' }}>
            {/* Fragmento padre para todos los condicionales */}
            <>
              {active === 'kioskos' && (
                <KioskosManager
                  API_BASE_URL={API_BASE_URL}
                  kioskos={kioskos}
                  appsList={appsList}
                  mediaList={mediaList}
                  loading={loading}
                  error={error}
                  selectedKioskos={selectedKioskos}
                  setSelectedKioskos={setSelectedKioskos}
                  showCreateModal={showCreateModal}
                  setShowCreateModal={setShowCreateModal}
                  showBulkModal={showBulkModal}
                  setShowBulkModal={setShowBulkModal}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  kioskoToDelete={kioskoToDelete}
                  setKioskoToDelete={setKioskoToDelete}
                  editId={editId}
                  setEditId={setEditId}
                  editValues={editValues}
                  setEditValues={setEditValues}
                  createValues={createValues}
                  setCreateValues={setCreateValues}
                  selectedApps={selectedApps}
                  setSelectedApps={setSelectedApps}
                  setLoading={setLoading}
                  setError={setError}
                  fetchKioskos={fetchKioskos}
                  handleEditKiosko={handleEditKiosko}
                  handleDelete={handleDelete}
                />
              )}
              {active === 'medias' && (
                <MediasManager
                  API_BASE_URL={API_BASE_URL}
                  medias={medias}
                  loading={loading}
                  error={error}
                  showMediaCreateModal={showMediaCreateModal}
                  setShowMediaCreateModal={setShowMediaCreateModal}
                  showMediaDeleteModal={showMediaDeleteModal}
                  setShowMediaDeleteModal={setShowMediaDeleteModal}
                  mediaEditId={mediaEditId}
                  setMediaEditId={setMediaEditId}
                  mediaEditValues={mediaEditValues}
                  setMediaEditValues={setMediaEditValues}
                  mediaCreateValues={mediaCreateValues}
                  setMediaCreateValues={setMediaCreateValues}
                  mediaUploaded={mediaUploaded}
                  setMediaUploaded={setMediaUploaded}
                  mediaUploadLoading={mediaUploadLoading}
                  handleMediaDrop={handleMediaDrop}
                  handleMediaFileChange={handleMediaFileChange}
                  mediaToDelete={mediaToDelete}
                  setMediaToDelete={setMediaToDelete}
                  setLoading={setLoading}
                  setError={setError}
                  fetchMedias={fetchMedias}
                  active="medias"
                />
              )}
              {active === 'deeplinks' && (
                <DeeplinksManager
                  API_BASE_URL={API_BASE_URL}
                  deeplinks={deeplinks}
                  loading={loading}
                  error={error}
                  showDeeplinkCreateModal={showDeeplinkCreateModal}
                  setShowDeeplinkCreateModal={setShowDeeplinkCreateModal}
                  showDeeplinkDeleteModal={showDeeplinkDeleteModal}
                  setShowDeeplinkDeleteModal={setShowDeeplinkDeleteModal}
                  deeplinkEditId={deeplinkEditId}
                  setDeeplinkEditId={setDeeplinkEditId}
                  deeplinkEditValues={deeplinkEditValues}
                  setDeeplinkEditValues={setDeeplinkEditValues}
                  deeplinkCreateValues={deeplinkCreateValues}
                  setDeeplinkCreateValues={setDeeplinkCreateValues}
                  iconUploaded={iconUploaded}
                  setIconUploaded={setIconUploaded}
                  iconUploadLoading={iconUploadLoading}
                  handleIconDrop={handleIconDrop}
                  handleIconFileChange={handleIconFileChange}
                  deeplinkToDelete={deeplinkToDelete}
                  setDeeplinkToDelete={setDeeplinkToDelete}
                  setLoading={setLoading}
                  setError={setError}
                  fetchDeeplinks={fetchDeeplinks}
                />
              )}
              {/* Bloque por defecto */}
              {active !== 'kioskos' && active !== 'medias' && active !== 'deeplinks' && (
                <>
                  <h1 style={{ color: '#287cfa', fontWeight: 700, fontSize: '2.2rem', marginBottom: 16 }}>Hola mundo</h1>
                  <p style={{ color: '#222', fontSize: '1.2rem', marginBottom: 0 }}>Selecciona una opción del menú para comenzar el mantenimiento.</p>
                </>
              )}
            </>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
