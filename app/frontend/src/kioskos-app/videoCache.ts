// Utilidad para cachear videos en IndexedDB
const DB_NAME = 'KioskosVideoCache';
const STORE_NAME = 'videos';
const DB_VERSION = 1;

interface CachedVideo {
  url: string;
  blob: Blob;
  timestamp: number;
}

// Inicializar base de datos
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'url' });
      }
    };
  });
}

// Guardar video en cache
export async function cacheVideo(url: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const cachedVideo: CachedVideo = {
      url,
      blob,
      timestamp: Date.now(),
    };

    const request = store.put(cachedVideo);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Obtener video del cache
export async function getCachedVideo(url: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onsuccess = () => {
        if (request.result) {
          const cached: CachedVideo = request.result;
          // Crear URL del blob para usar en el video
          const blobUrl = URL.createObjectURL(cached.blob);
          resolve(blobUrl);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting cached video:', error);
    return null;
  }
}

// Descargar y cachear video
export async function downloadAndCacheVideo(url: string, token?: string): Promise<string> {
  // Primero verificar si ya está en cache
  const cachedUrl = await getCachedVideo(url);
  if (cachedUrl) {
    console.log('Video cargado desde cache:', url);
    return cachedUrl;
  }

  // Si no está en cache, descargar
  console.log('Descargando video:', url);
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  const blob = await response.blob();
  
  // Guardar en cache
  await cacheVideo(url, blob);
  
  // Retornar URL del blob
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}

// Limpiar cache viejo (opcional, para evitar que crezca indefinidamente)
export async function clearOldCache(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.openCursor();
    const now = Date.now();

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        const cached: CachedVideo = cursor.value;
        if (now - cached.timestamp > maxAgeMs) {
          cursor.delete();
        }
        cursor.continue();
      } else {
        resolve();
      }
    };
    request.onerror = () => reject(request.error);
  });
}

// Limpiar todo el cache
export async function clearAllCache(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
