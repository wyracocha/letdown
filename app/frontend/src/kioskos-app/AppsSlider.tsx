import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './AppDashboard.scss';

const APPS_PER_PAGE = 16;

export type AppType = {
  id: string;
  label: string;
  icon: JSX.Element;
  url: string;
};

interface AppsSliderProps {
  apps: AppType[];
  clickedApp: string | null;
  handleAppClick: (appId: string, url: string) => void;
}

export default function AppsSlider({ apps, clickedApp, handleAppClick }: AppsSliderProps) {
  function getPages(apps: AppType[]): (AppType | null)[][] {
    const pages: (AppType | null)[][] = [];
    for (let i = 0; i < apps.length; i += APPS_PER_PAGE) {
      const page: (AppType | null)[] = apps.slice(i, i + APPS_PER_PAGE);
      while (page.length < APPS_PER_PAGE) page.push(null);
      pages.push(page);
    }
    return pages;
  }

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

  return (
    <Slider {...settings}>
      {pages.map((appsPage, idx) => (
        <section key={idx} className="apps-slide">
          <div className="apps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 24 }}>
            {appsPage.map((app: AppType | null, i: number) =>
              app ? (
                <button
                  key={app.id}
                  className={`app-item${clickedApp === app.id ? ' app-item-animate' : ''}`}
                  onClick={() => handleAppClick(app.id, app.url)}
                  style={{ transition: 'box-shadow 0.3s, border-color 0.3s' }}
                >
                  <span className="app-icon">{app.icon}</span>
                  <span className="app-label">{app.label}</span>
                </button>
              ) : (
                <span key={`empty-${i}`} className="app-item empty-slot" />
              )
            )}
          </div>
        </section>
      ))}
    </Slider>
  );
}
