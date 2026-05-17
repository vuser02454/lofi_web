import MediaBackground from './components/Background/MediaBackground';
import LoFiDashboard from './components/UI/LoFiDashboard';

function App() {
  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
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
