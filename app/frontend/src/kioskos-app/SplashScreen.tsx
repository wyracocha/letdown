import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { downloadAndCacheVideo, clearOldCache } from './videoCache';

export default function SplashScreen() {
  const [videos, setVideos] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const LOGIN_USER = import.meta.env.VITE_LOGIN_USER;
  const LOGIN_PASSWORD = import.meta.env.VITE_LOGIN_PASSWORD;

  useEffect(() => {
    const loadVideos = async () => {
      try {
        // TODO: Descomentar cuando se configure CORS en Azure Blob Storage
        // Limpiar cache viejo (más de 7 días)
        // await clearOldCache();

        // Login para obtener el token
        const loginRes = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: LOGIN_USER, password: LOGIN_PASSWORD })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;

        // Guardar el token en localStorage para uso posterior
        localStorage.setItem('token', token);

        // Obtener los videos con el token
        const res = await fetch(`${API_BASE_URL}/media`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const videoData = Array.isArray(data) 
          ? data.filter(m => m.url.endsWith('.mp4'))
          : [];

        // Usar las URLs originales (sin cachear por ahora debido a CORS)
        // El navegador usará su propio cache HTTP
        const videoUrls = videoData.map(m => m.url);
        
        // TODO: Descomentar cuando se configure CORS en Azure Blob Storage
        // Descargar y cachear todos los videos en IndexedDB
        // const cachedVideoUrls = await Promise.all(
        //   videoData.map(v => downloadAndCacheVideo(v.url, token))
        // );
        // setVideos(cachedVideoUrls);
        
        setVideos(videoUrls);
        setLoading(false);
      } catch (error) {
        console.error('Error loading videos:', error);
        setLoading(false);
      }
    };

    loadVideos();
  }, [API_BASE_URL, LOGIN_USER, LOGIN_PASSWORD]);

  useEffect(() => {
    if (videos.length > 0 && playing && videoRef.current) {
      videoRef.current.volume = 1;
      videoRef.current.play().catch(() => {});
    }
  }, [videos, current, playing]);

  // const handlePlay = () => {
  //   setPlaying(true);
  //   if (videoRef.current) {
  //     videoRef.current.volume = 1;
  //     videoRef.current.play();
  //   }
  // };

  const handleNext = () => {
    if (videos.length === 1) {
      // Loop infinito para un solo video
      setCurrent(0);
      setPlaying(true);
      videoRef.current?.play();
    } else if (current < videos.length - 1) {
      setCurrent(current + 1);
      setPlaying(true);
    } else {
      // Si hay varios, volver al inicio y reproducir todos de nuevo
      setCurrent(0);
      setPlaying(true);
      videoRef.current?.play();
    }
  };

  const handleScreenClick = () => {
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={handleScreenClick}
      tabIndex={0}
      role="button"
    >
      {loading && (
        <div style={{ color: '#fff', fontSize: 18 }}>Cargando videos...</div>
      )}
      {!loading && videos.length > 0 && (
        <video
          ref={videoRef}
          src={videos[current]}
          style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
          autoPlay
          muted
          controls={false}
          loop={videos.length === 1}
          onEnded={() => {
            if (videos.length > 1) {
              handleNext();
            }
          }}
          onError={() => {
            // Si el recurso no se puede reproducir, pasar al siguiente
            if (videos.length > 1) {
              handleNext();
            } else {
              // Si solo hay uno, intenta de nuevo en loop
              setTimeout(() => {
                if (videoRef.current) {
                  videoRef.current.load();
                  videoRef.current.play().catch(() => {});
                }
              }, 1000);
            }
          }}
          onCanPlay={() => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          }}
        />
      )}
      {/* El botón de play siempre debe mostrarse */}
      {!loading && videos.length > 0 && (
        <button
          onClick={e => {
            e.stopPropagation();
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.volume = 1;
              videoRef.current.play();
            }
            setPlaying(true);
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            cursor: 'pointer',
            zIndex: 10001,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#fff" opacity="0.7" />
            <polygon points="13,10 24,16 13,22" fill="#287cfa" />
          </svg>
        </button>
      )}
    </div>
  );
}
