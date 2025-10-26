import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileHeader from './MobileHeader';

const GAME_CONFIG = {
    metro: {
        successBg: '/memoria-metro-success-bg.png',
        logo: '/metro-logo.png',
        code: 'XDERYU900IA',
        brand: 'Metro',
        discount: '10% de descuento en tu próxima compra',
        description: 'Muchas gracias por jugar con nosotros y sumarte a la experiencia METRO+KioscosIA.\n¡Esperamos que vuelvas!',
        cardBg: '#FFE600D1',
    },
    yango: {
        successBg: '/memoria-yango-bg.png',
        logo: '/memoria-yango-logo.png',
        code: 'YANGO10OFF',
        brand: 'Yango',
        discount: '5% de descuento en tu próximo viaje',
        description: 'Muchas gracias por jugar con nosotros y sumarte a la experiencia YANGO+KioscosIA.\n¡Esperamos que vuelvas!',
        cardBg: 'rgba(235,0,0,0.8)',
    },
};

export default function MemoriaGameSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const gameType = params.get('game') === 'yango' ? 'yango' : 'metro';
    const config = GAME_CONFIG[gameType];

    return (
        <>
            <MobileHeader />
            <div className="home-container" style={{ minHeight: 'calc(100vh - 80px)', position: 'relative', width: '100vw', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: `url('${config.successBg}') center/cover no-repeat`,
                    opacity: 0.3,
                    zIndex: 1,
                }} />
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', position: 'relative', zIndex: 2 }}>
                    <div style={{ background: config.cardBg, borderRadius: 6, padding: '32px 24px', maxWidth: 370, width: '100%', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
                        <img src={config.logo} alt={config.brand + ' Logo'} style={{ maxWidth: '50%', marginBottom: 18, userSelect: 'none', pointerEvents: 'none' }} draggable="false" />
                        <h2 style={{ color: gameType === 'yango' ? '#fff' : '#222', fontWeight: 700, fontSize: '1.7rem', marginBottom: 12, textAlign: 'center' }}>¡Felicidades!</h2>
                        <div style={{ color: gameType === 'yango' ? '#fff' : '#222', fontSize: '1.05rem', marginBottom: 18, textAlign: 'center', fontFamily: 'Open Sans, Arial, sans-serif' }}>
                            {config.description.split('\n').map((line, i) => (
                                <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
                            ))}
                        </div>
                        <div style={{ color: gameType === 'yango' ? '#fff' : '#222', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>GANASTE</div>
                        <div style={{ color: gameType === 'yango' ? '#fff' : '#222', fontSize: '1.1rem', marginBottom: 18, textAlign: 'center' }}>{config.discount}</div>
                        <div style={{ width: '100%', background: '#fff', borderRadius: 6, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1.1rem', marginBottom: 24 }}>
                            <span style={{ color: gameType === 'yango' ? '#EB0000' : '#222' }}>Código:</span>
                            <span style={{ color: '#222', letterSpacing: 2 }}>{config.code}</span>
                        </div>
                        <button
                            style={{ width: '100%', background: gameType === 'yango' ? '#000' : '#E20000', color: '#fff', border: 'none', borderRadius: 6, padding: '14px 0', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', marginTop: 8 }}
                            onClick={() => navigate('/dashboard')}
                        >
                            Ir a Kioscos IA
                        </button>
                    </div>
                </div>
                {/* Custom Footer (igual que antes) */}
                <footer className="memoria-footer" style={{
                    width: '100vw',
                    position: 'fixed',
                    left: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, #043286 0%, #001430 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px 30px',
                    zIndex: 10,
                }}>
                    <div style={{ position: 'absolute', left: 30, top: '50%', transform: 'translateY(-50%)' }}>
                        <button
                            onClick={() => window.history.back()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'transparent',
                                border: '1px solid #fff',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '1rem',
                                borderRadius: 6,
                                padding: '8px 18px 8px 12px',
                                cursor: 'pointer',
                                transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
                            }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <span style={{ marginRight: 8, fontSize: 18 }}>&larr;</span> Atrás
                        </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                background: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                padding: 7,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                                cursor: 'pointer',
                                transition: 'box-shadow 0.2s, transform 0.2s',
                            }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img src="/home-icon.svg" alt="Home" style={{ width: 18, height: 18, userSelect: 'none', pointerEvents: 'none' }} draggable="false" />
                        </button>
                    </div>
                </footer>
            </div>
        </>
    );
}
