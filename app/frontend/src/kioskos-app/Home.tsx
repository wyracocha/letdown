import './Home.scss';
import AppDashboard from './AppDashboard';
import MobileHeader from './MobileHeader';

export default function Home() {
  return (
    <div className="home-container" style={{overflow: 'hidden'}}>
      <MobileHeader />
      <AppDashboard />
    </div>
  );
}
