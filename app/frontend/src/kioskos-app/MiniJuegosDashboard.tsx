import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './AppDashboard.scss';
import './Home.scss';
import { useNavigate } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import DashboardFooter from './DashboardFooter';

const APPS_PER_PAGE = 16;

export default function MiniJuegosDashboard() {
    const [apps, setApps] = useState<any[]>([]);
    const navigate = useNavigate();

    function getPages(apps: any[]): (any | null)[][] {
        const pages: (any | null)[][] = [];
        for (let i = 0; i < apps.length; i += APPS_PER_PAGE) {
            const page: (any | null)[] = apps.slice(i, i + APPS_PER_PAGE);
            while (page.length < APPS_PER_PAGE) page.push(null);
            pages.push(page);
        }
        return pages;
    }

    useEffect(() => {
        setApps([
            {
                id: 'metro',
                label: 'Metro',
                icon: <img src="metro.png" width="48" height="48" alt="Metro" draggable="false" style={{ userSelect: 'none', pointerEvents: 'none' }} />,
                url: '/memoria-game?game=metro',
            },
            {
                id: 'yango',
                label: 'Yango',
                icon: <img src="yango.png" width="48" height="48" alt="Yango" draggable="false" style={{ userSelect: 'none', pointerEvents: 'none' }} />,
                url: '/memoria-game?game=yango',
            },
        ]);
    }, []);

    const pages = getPages(apps);
    const settings = {
        dots: true,
        infinite: false,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: true,
        arrows: false,
        adaptiveHeight: false,
        className: 'apps-slick',
    };

    const handleAppClick = (app: any) => {
        navigate(app.url);
    };

    return (
        <>
            <MobileHeader />
            <div className="home-container" style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #001430 0%, #043286 50%, #001430 100%)', overflow: 'hidden' }}>
                <div style={{ width: '100%', textAlign: 'center', margin: '32px 0 0 0' }}>
                    <h1 style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 700, margin: 0 }}>Micro-Juegos</h1>
                    <p style={{ color: 'white', marginTop: '20px' }}>Diviértete, juega y gana con <br /> KioskosIA</p>
                </div>
                <div style={{ marginTop: 32 }}>
                    <Slider {...settings}>
                        {pages.map((appsPage, idx) => (
                            <section key={idx} className="apps-slide">
                                <div className="apps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 24 }}>
                                    {appsPage.map((app: any | null, i: number) =>
                                        app ? (
                                            <button
                                                key={app.id}
                                                className="app-item"
                                                style={{ transition: 'box-shadow 0.3s, border-color 0.3s', userSelect: 'none' }}
                                                onClick={() => handleAppClick(app)}
                                            >
                                                <span className="app-icon" style={{ userSelect: 'none' }}>{app.icon}</span>
                                                <span className="app-label" style={{ userSelect: 'none' }}>{app.label}</span>
                                            </button>
                                        ) : (
                                            <span key={`empty-${i}`} className="app-item empty-slot" />
                                        )
                                    )}
                                </div>
                            </section>
                        ))}
                    </Slider>
                </div>
                {/* Custom Footer */}
                <DashboardFooter disableMinijuegos={true} />
            </div>
        </>
    );
}
