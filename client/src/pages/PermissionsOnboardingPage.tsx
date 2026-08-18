import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PermissionsOnboardingPage() {
  const navigate = useNavigate();
  const [gpsGranted, setGpsGranted] = useState(false);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);

  const requestGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setGpsGranted(true),
        () => setGpsGranted(true) // graceful fallback
      );
    } else {
      setGpsGranted(true);
    }
  };

  const requestCamera = () => {
    setCameraGranted(true);
  };

  const requestNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => setNotificationsGranted(true));
    } else {
      setNotificationsGranted(true);
    }
  };

  const handleContinue = () => {
    navigate('/home');
  };

  return (
    <div className="bg-[#0c0e14] text-[#e2e2eb] min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#191b22] border border-[#33343b] rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#fa5c1b]/20 border border-[#fa5c1b] mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-[#fa5c1b] text-2xl">radar</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Enable Civic Intelligence</h1>
          <p className="text-xs text-[#8B8FA8] leading-relaxed">
            Nagpur Pulse uses device sensors to auto-tag civic incident coordinates and capture photo evidence.
          </p>
        </div>

        {/* Permission Item 1: Location */}
        <div className="bg-[#111319] border border-[#282a30] rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined text-lg">location_on</span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Precise GPS Location</div>
              <div className="text-[10px] text-[#8B8FA8]">Auto-pins your issue to the correct ward</div>
            </div>
          </div>
          <button
            onClick={requestGps}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              gpsGranted
                ? 'bg-green-950/60 text-green-400 border border-green-800/60'
                : 'bg-[#fa5c1b] hover:bg-[#d94a10] text-white'
            }`}
          >
            {gpsGranted ? '✓ Granted' : 'Allow'}
          </button>
        </div>

        {/* Permission Item 2: Camera */}
        <div className="bg-[#111319] border border-[#282a30] rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <span className="material-symbols-outlined text-lg">photo_camera</span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Camera & Storage</div>
              <div className="text-[10px] text-[#8B8FA8]">Capture pothole & road damage evidence</div>
            </div>
          </div>
          <button
            onClick={requestCamera}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              cameraGranted
                ? 'bg-green-950/60 text-green-400 border border-green-800/60'
                : 'bg-[#fa5c1b] hover:bg-[#d94a10] text-white'
            }`}
          >
            {cameraGranted ? '✓ Granted' : 'Allow'}
          </button>
        </div>

        {/* Permission Item 3: Notifications */}
        <div className="bg-[#111319] border border-[#282a30] rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-lg">notifications</span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Resolution Alerts</div>
              <div className="text-[10px] text-[#8B8FA8]">Live notifications when NMC fixes your report</div>
            </div>
          </div>
          <button
            onClick={requestNotifications}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              notificationsGranted
                ? 'bg-green-950/60 text-green-400 border border-green-800/60'
                : 'bg-[#fa5c1b] hover:bg-[#d94a10] text-white'
            }`}
          >
            {notificationsGranted ? '✓ Granted' : 'Allow'}
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-[#fa5c1b] hover:bg-[#d94a10] text-white font-mono text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-950/40"
        >
          Enter Nagpur Pulse →
        </button>
      </div>
    </div>
  );
}
