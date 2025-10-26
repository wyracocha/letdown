import { useEffect, useState } from 'react';
import './AppDashboard.scss';
import DashboardFooter from './DashboardFooter';
import BannerSlider from './BannerSlider';
import AppsSlider, { AppType } from './AppsSlider';

type DeeplinkApp = {
  _id: string;
  name: string;
  url: string;
  date: string;
  __v?: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LOGIN_USER = import.meta.env.VITE_LOGIN_USER;
const LOGIN_PASSWORD = import.meta.env.VITE_LOGIN_PASSWORD;

// Fallback apps en caso de que no haya respuesta del backend
const FALLBACK_APPS: DeeplinkApp[] = [
  {
    "_id": "68fa5c6f365bd9d317872648",
    "name": "Test",
    "url": "test9://promo/123",
    "date": "2025-10-23T16:48:47.438Z",
    "__v": 0
  },
  {
    "_id": "68f91a6fb39d8db7c0aa271c",
    "name": "Rappi 999",
    "url": "rappi9://promo/123",
    "date": "2025-10-22T17:54:55.363Z",
    "__v": 0
  },
  {
    "_id": "68f91a6bb39d8db7c0aa271a",
    "name": "Rappi 8",
    "url": "rappi8://promo/123",
    "date": "2025-10-22T17:54:51.592Z",
    "__v": 0
  },
  {
    "_id": "68f91a67b39d8db7c0aa2718",
    "name": "Rappi 7",
    "url": "rappi7://promo/123",
    "date": "2025-10-22T17:54:47.905Z",
    "__v": 0
  },
  {
    "_id": "68f91a62b39d8db7c0aa2716",
    "name": "Rappi 6",
    "url": "rappi6://promo/123",
    "date": "2025-10-22T17:54:42.665Z",
    "__v": 0
  },
  {
    "_id": "68f91a58b39d8db7c0aa2714",
    "name": "Rappi 5",
    "url": "rappi5://promo/123",
    "date": "2025-10-22T17:54:32.270Z",
    "__v": 0
  },
  {
    "_id": "68f91a54b39d8db7c0aa2712",
    "name": "Rappi 4",
    "url": "rappi4://promo/123",
    "date": "2025-10-22T17:54:28.516Z",
    "__v": 0
  },
  {
    "_id": "68f91a4fb39d8db7c0aa2710",
    "name": "Rappi 3",
    "url": "rappi3://promo/123",
    "date": "2025-10-22T17:54:23.805Z",
    "__v": 0
  },
  {
    "_id": "68f91a47b39d8db7c0aa270e",
    "name": "Rappi 2",
    "url": "rappi2://promo/123",
    "date": "2025-10-22T17:54:15.966Z",
    "__v": 0
  },
  {
    "_id": "68f91a43b39d8db7c0aa270c",
    "name": "Rappi",
    "url": "rappi://promo/123",
    "date": "2025-10-22T17:54:11.295Z",
    "__v": 0
  },
  {
    "_id": "68f91a39b39d8db7c0aa270a",
    "name": "Surco",
    "url": "municipaclidaddesurco://promo/123",
    "date": "2025-10-22T17:54:01.525Z",
    "__v": 0
  },
  {
    "_id": "68f91a2bb39d8db7c0aa2708",
    "name": "Pardos",
    "url": "http://metro.com.pe",
    "date": "2025-10-22T17:53:47.530Z",
    "__v": 0
  },
  {
    "_id": "68f91a24b39d8db7c0aa2706",
    "name": "Samsung",
    "url": "samsung://promo/123",
    "date": "2025-10-22T17:53:40.279Z",
    "__v": 0
  },
  {
    "_id": "68f91a1cb39d8db7c0aa2704",
    "name": "Claro",
    "url": "claro://promo/123",
    "date": "2025-10-22T17:53:32.683Z",
    "__v": 0
  },
  {
    "_id": "68ed2020cdcb268cc93df7f9",
    "name": "InDrive",
    "url": "indrive://home/xyz",
    "date": "2025-10-13T15:52:00.365Z",
    "__v": 0
  },
  {
    "_id": "68ed0ba4cdcb268cc93df7f3",
    "name": "Yango",
    "url": "yango://home/123",
    "date": "2025-10-13T14:24:36.558Z",
    "__v": 0
  }
];

export default function AppDashboard() {
  const [apps, setApps] = useState<AppType[]>([]);
  const [clickedApp, setClickedApp] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        // Login para obtener el token
        const loginRes = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: LOGIN_USER, password: LOGIN_PASSWORD })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        // Obtener los apps con el token
        const appsRes = await fetch(`${API_BASE_URL}/deeplink`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data: DeeplinkApp[] = await appsRes.json();
        setApps(
          data.map(app => ({
            id: app._id,
            label: app.name,
            url: app.url,
            icon: (
              // Pendiente: cambiar la imagen por el ícono real de las apps
              <img src="metro.png" width="48" height="48" alt="" draggable="false" style={{ userSelect: 'none', pointerEvents: 'none' }} />
              // <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              //   <rect width="48" height="48" rx="12" fill="white" />
              //   <text x="24" y="28" textAnchor="middle" alignmentBaseline="middle" fontSize="14" fill="black" fontFamily="Arial">{app.name[0]}</text>
              // </svg>
            ),
          }))
        );
      } catch (err) {
        console.error('Error fetching apps from backend, using fallback apps:', err);
        // Usar fallback apps si hay error
        setApps(
          FALLBACK_APPS.map(app => ({
            id: app._id,
            label: app.name,
            url: app.url,
            icon: (
              <img src="metro.png" width="48" height="48" alt="" draggable="false" style={{ userSelect: 'none', pointerEvents: 'none' }} />
            ),
          }))
        );
      }
    }
    fetchApps();
  }, []);

  const handleAppClick = (appId: string) => {
    setClickedApp(appId);
    setTimeout(() => {
      setClickedApp(null);
      window.open('https://www.metro.pe', '_blank');
    }, 350);
  };

  return (
    <>
      <main className="dashboard-main" style={{ height: 'calc(100vh - 80px)', overflow: 'hidden', background: 'linear-gradient(180deg, #001430 0%, #043286 50%, #001430 100%)' }}>
        <BannerSlider />
        <AppsSlider apps={apps} clickedApp={clickedApp} handleAppClick={handleAppClick} />
      </main>
      <DashboardFooter />
    </>
  );
}
