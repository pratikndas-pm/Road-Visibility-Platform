
import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import UAEMap from '../components/UAEMap';

export default function RoadIQ() {
  const { user, logout } = useAuth();
  const pins = [
    { id: 'ACME-001', lat: 25.2, lng: 55.3, caption: 'Jebel Ali' },
    { id: 'ACME-002', lat: 24.4, lng: 54.3, caption: 'Abu Dhabi Hub' }
  ];
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">RoadIQ Dashboard</h1>
        <div className="text-sm">{user?.org} — {user?.email}
          <button onClick={logout} className="ml-3 text-blue-400 hover:underline">Logout</button>
        </div>
      </header>
      <UAEMap pins={pins} />
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Live KPIs</h2>
        <ul className="space-y-1 text-slate-300 text-sm">
          <li>ETA Accuracy: 92%</li>
          <li>Delay Alert Precision: 88%</li>
          <li>Ticket Resolution Time ↓ 40%</li>
        </ul>
      </div>
    </div>
  );
}
