import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Confetti from 'react-confetti';
import MobileHeader from './MobileHeader';

const GAME_CONFIG = {
  metro: {
    images: [
      '/memoria-metro-1.png',
      '/memoria-metro-2.png',
      '/memoria-metro-3.png',
      '/memoria-metro-4.png',
      '/memoria-metro-5.png',
    ],
    bg: '/memoria-metro-bg.png',
    cardBorder: '2px solid #FFE936',
    logo: '/metro-logo.png',
    successBg: '/memoria-metro-success-bg.png',
    code: 'XDERYU900IA',
    brand: 'Metro',
  },
  yango: {
    images: [
      '/memoria-yango-1.png',
      '/memoria-yango-2.png',
      '/memoria-yango-3.png',
      '/memoria-yango-4.png',
      '/memoria-yango-5.png',
    ],
    bg: '/memoria-yango-bg.png',
    cardBorder: 'none',
    logo: '/yango-logo.png',
    successBg: '/memoria-yango-success-bg.png',
    code: 'YANGO10OFF',
    brand: 'Yango',
  },
};

function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function MemoriaGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const gameType = params.get('game') === 'yango' ? 'yango' : 'metro';
  const config = GAME_CONFIG[gameType];

  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
//   const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const deck = shuffle([...config.images, ...config.images]).map((img, idx) => ({ img, idx }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    // setWon(false);
  }, [gameType, config.images]);

  useEffect(() => {
    if (flipped.length === 2) {
      setBusy(true);
      setTimeout(() => {
        const [i1, i2] = flipped;
        if (cards[i1].img === cards[i2].img) {
          setMatched(m => [...m, cards[i1].img]);
        }
        setFlipped([]);
        setBusy(false);
      }, 900);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === config.images.length) {
    //   setWon(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        navigate(`/memoria-success?game=${gameType}`);
      }, 2000);
    }
  }, [matched, navigate, config.images.length, gameType]);

  const handleFlip = (idx: number) => {
    if (busy || flipped.includes(idx) || matched.includes(cards[idx].img)) return;
    if (flipped.length < 2) setFlipped(f => [...f, idx]);
  };

  return (
    <div className="memoria-bg" style={{ minHeight: '100vh', width: '100vw', position: 'relative', background: `url('${config.bg}') center/cover no-repeat` }}>
      <MobileHeader />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
      }}>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={180}
            recycle={false}
            gravity={0.25}
            initialVelocityY={8}
            opacity={0.95}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
          />
        )}
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          borderRadius: 16,
          margin: '0 16px',
          padding: 16,
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        }}>
          <div className="memoria-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: 18, justifyContent: 'center' }}>
            {(() => {
              const rows = [];
              const total = cards.length;
              const perRow = 3;
              for (let i = 0; i < total; i += perRow) {
                const rowCards = cards.slice(i, i + perRow);
                if (i + perRow >= total && rowCards.length < perRow) {
                  const emptySlots = Math.floor((perRow - rowCards.length) / 2);
                  for (let e = 0; e < emptySlots; e++) {
                    rows.push(<div key={`empty-left-${i}-${e}`} style={{ width: 100, height: 140 }} />);
                  }
                  rowCards.forEach((card, idx) => {
                    const isFlipped = flipped.includes(i + idx) || matched.includes(card.img);
                    rows.push(
                      <div
                        key={i + idx}
                        className={`memoria-card${isFlipped ? ' flipped' : ''}`}
                        style={{ perspective: '800px', cursor: isFlipped ? 'default' : 'pointer', justifySelf: 'center' }}
                        onClick={() => handleFlip(i + idx)}
                      >
                        <div className="memoria-card-inner" style={{
                          position: 'relative',
                          width: 100,
                          height: 140,
                          transition: 'transform 0.6s cubic-bezier(.68,-0.55,.27,1.55)',
                          transformStyle: 'preserve-3d',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}>
                          <div className="memoria-card-front" style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            background: '#fff',
                            borderRadius: 12,
                            boxShadow: '0 2px 12px rgba(40,124,250,0.10)',
                            border: config.cardBorder,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            userSelect: 'none',
                          }}>
                            <img src={config.logo} alt="Back" style={{width: 60, userSelect: 'none', pointerEvents: 'none'}} draggable="false" />
                          </div>
                          <div className="memoria-card-back" style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            background: '#fff',
                            borderRadius: 12,
                            boxShadow: '0 2px 12px rgba(40,124,250,0.10)',
                            border: config.cardBorder,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotateY(180deg)',
                          }}>
                            <img src={card.img} alt="Memoria" style={{ width: '80px', objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', userSelect: 'none', pointerEvents: 'none' }} draggable="false" />
                          </div>
                        </div>
                      </div>
                    );
                  });
                  for (let e = 0; e < perRow - rowCards.length - emptySlots; e++) {
                    rows.push(<div key={`empty-right-${i}-${e}`} style={{ width: 100, height: 140 }} />);
                  }
                } else {
                  rowCards.forEach((card, idx) => {
                    const isFlipped = flipped.includes(i + idx) || matched.includes(card.img);
                    rows.push(
                      <div
                        key={i + idx}
                        className={`memoria-card${isFlipped ? ' flipped' : ''}`}
                        style={{ perspective: '800px', cursor: isFlipped ? 'default' : 'pointer', justifySelf: 'center' }}
                        onClick={() => handleFlip(i + idx)}
                      >
                        <div className="memoria-card-inner" style={{
                          position: 'relative',
                          width: 100,
                          height: 140,
                          transition: 'transform 0.6s cubic-bezier(.68,-0.55,.27,1.55)',
                          transformStyle: 'preserve-3d',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}>
                          <div className="memoria-card-front" style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            background: '#fff',
                            borderRadius: 12,
                            boxShadow: '0 2px 12px rgba(40,124,250,0.10)',
                            border: config.cardBorder,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            userSelect: 'none',
                          }}>
                            <img src={config.logo} alt="Back" style={{ width: 60, userSelect: 'none', pointerEvents: 'none' }} draggable="false" />
                          </div>
                          <div className="memoria-card-back" style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            background: '#fff',
                            borderRadius: 12,
                            boxShadow: '0 2px 12px rgba(40,124,250,0.10)',
                            border: config.cardBorder,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotateY(180deg)',
                          }}>
                            <img src={card.img} alt="Memoria" style={{ width: '80px', objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', userSelect: 'none', pointerEvents: 'none' }} draggable="false" />
                          </div>
                        </div>
                      </div>
                    );
                  });
                }
              }
              return rows;
            })()}
          </div>
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
            <FaArrowLeft style={{ marginRight: 8, fontSize: 18 }} /> Atrás
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
  );
}
