import Home from './Home';
import SplashScreen from './SplashScreen';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/dashboard" element={<Home />} />
    </Routes>
  );
}

export default App;
