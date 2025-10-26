import { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { WiDaySunny, WiCloudy, WiRain, WiDayFog, WiThunderstorm } from 'react-icons/wi';
import { useNavigate } from 'react-router-dom';
import './Home.scss';

const options = [
  'Ayuda',
  'Idioma',
  'KioskosIA',
  'FAQ',
  'Soporte',
];

export default function MobileHeader() {
  const [date, setDate] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function fetchWeather(lat: number, lon: number) {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
          if (data && data.current_weather) {
            if (typeof data.current_weather.weathercode === 'number') {
              setWeatherCode(data.current_weather.weathercode);
            }
            if (typeof data.current_weather.temperature === 'number') {
              setTemperature(data.current_weather.temperature);
            }
          }
        });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          fetchWeather(-12.0464, -77.0428);
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeather(-12.0464, -77.0428);
    }
  }, []);

  let formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  formattedTime = formattedTime.replace(/\s?(a\.m\.|p\.m\.|am|pm)/gi, match => ' ' + match.trim().replace(/\.|\s/g, '').toUpperCase());
  const formattedDate = date.toLocaleDateString();

  const getWeatherIcon = (code: number | null) => {
    if (code === null) return null;
    if (code === 0) return <WiDaySunny title="Soleado" />;
    if ([1, 2, 3].includes(code)) return <WiCloudy title="Nublado" />;
    if ([45, 48].includes(code)) return <WiDayFog title="Niebla" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <WiRain title="Lluvia" />;
    if ([95, 96, 99].includes(code)) return <WiThunderstorm title="Tormenta" />;
    return <WiCloudy title="Nublado" />;
  };

  return (
    <header className="mobile-header">
      <div className="header-left">
        <div className="time">
          {formattedTime}
          {weatherCode !== null && (
            <span className="weather-icon">
              {temperature !== null && (
                <span className="weather-temp">{Math.round(temperature)}°C</span>
              )}
              {getWeatherIcon(weatherCode)}
            </span>
          )}
        </div>
        <div className="date">
          {formattedDate}
        </div>
      </div>
      <div className="header-center">
        <span className="logo" aria-label="Logo" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => navigate('/dashboard')}>
          <img src="/logo.png" alt="Logo" draggable="false" style={{ userSelect: 'none', pointerEvents: 'none' }} />
        </span>
      </div>
      <div className="header-right">
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            Ayuda
            <span className={`arrow${dropdownOpen ? ' open' : ''}`}>
              <FaChevronDown />
            </span>
          </button>
          <ul className={`dropdown-menu${dropdownOpen ? ' show' : ''}`}>
            {options.map(opt => (
              <li key={opt}>{opt}</li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
