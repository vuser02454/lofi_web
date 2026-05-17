import MediaBackground from './components/Background/MediaBackground';
import LoFiDashboard from './components/UI/LoFiDashboard';

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden select-none" style={{ height: '100dvh' }}>
      {/* Background layers */}
      <div className="fixed inset-0 z-0">
        <MediaBackground />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <div className="pointer-events-auto">
          <LoFiDashboard />
        </div>
      </div>
    </div>
  );
}

export default App;
