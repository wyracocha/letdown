import './AppDashboard.scss';

interface DashboardFooterProps {
  disableMinijuegos?: boolean;
}

export default function DashboardFooter({ disableMinijuegos = false }: DashboardFooterProps) {
  return (
    <footer className="dashboard-footer">
      <div className="footer-buttons">
        <button disabled className="footer-btn" style={{ userSelect: 'none' }}>
          <span className="footer-icon" role="img" aria-label="Lockers" style={{ userSelect: 'none' }}>
            <img width="20px" height="20px" src="lockers.svg" alt="" draggable="false" style={{ userSelect: 'none', pointerEvents: 'none' }} />
          </span>
          <span className="footer-label" style={{ userSelect: 'none' }}>Lockers Inteligentes</span>
        </button>
        <button className="footer-btn" onClick={() => window.location.href = '/minijuegos'} disabled={disableMinijuegos} style={{ userSelect: 'none' }}>
          <span className="footer-icon" role="img" aria-label="Mini Juegos" style={{ userSelect: 'none' }}>
            <img width="20px" height="20px" src="minijuegos.svg" alt="" draggable="false" style={{ userSelect: 'none', pointerEvents: 'none' }} />
          </span>
          <span className="footer-label" style={{ userSelect: 'none' }}>Mini Juegos</span>
        </button>
        <button disabled className="footer-btn" style={{ userSelect: 'none' }}>
          <span className="footer-icon" role="img" aria-label="Pago de Servicios" style={{ userSelect: 'none' }}>
            <img width="20px" height="20px" src="pagodeservicios.svg" alt="" draggable="false" style={{ userSelect: 'none', pointerEvents: 'none' }} />
          </span>
          <span className="footer-label" style={{ userSelect: 'none' }}>Pago de Servicios</span>
        </button>
        <button disabled className="footer-btn" style={{ userSelect: 'none' }}>
          <span className="footer-icon" role="img" aria-label="Wi-fi gratuito" style={{ userSelect: 'none' }}>
            <img width="20px" height="20px" src="wifi.svg" alt="" draggable="false" style={{ userSelect: 'none', pointerEvents: 'none' }} />
          </span>
          <span className="footer-label" style={{ userSelect: 'none' }}>Wi-fi gratuito</span>
        </button>
      </div>
    </footer>
  );
}
