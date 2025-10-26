import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './AppDashboard.scss';

function BannerImage({ src, alt }: { src: string; alt: string }) {
  const [loading, setLoading] = useState(true);
  return (
    <div className="banner-slide" style={{ position: 'relative', width: '100%', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <div className="spinner-border" style={{ width: 40, height: 40, color: '#287cfa' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className="banner-img"
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', // Quizás deba ser contain dependiendo del diseño
          objectPosition: 'center',
          borderRadius: 18, 
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          background: 'linear-gradient(180deg, #001430 0%, #043286 50%, #001430 100%)' // Fondo para los espacios vacíos
        }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

export default function BannerSlider() {
  const images = [
    'banner1.png',
    'banner2.png',
    'banner3.png',
  ];

  return (
    <div className="banner-slider-container">
      <Slider
        dots={true}
        arrows={true}
        infinite={true}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={true}
        autoplaySpeed={4000}
        className="banner-slider"
      >
        {images.map((src, idx) => (
          <BannerImage key={idx} src={src} alt={`Banner ${idx + 1}`} />
        ))}
      </Slider>
    </div>
  );
}
