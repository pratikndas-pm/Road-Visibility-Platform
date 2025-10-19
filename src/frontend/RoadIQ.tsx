import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Navigation, Search, Filter, Bell, Settings, Plus, BarChart3, Clock, AlertTriangle, MessageSquare, ChevronDown } from 'lucide-react';
import UAEMap, { Pin } from '../components/UAEMap';
import { useAuth } from '../auth/AuthProvider';

type Status = 'IN_TRANSIT' | 'DELAYED' | 'IDLE';
type Severity = 'HIGH' | 'MEDIUM' | 'LOW';
type AlertT = { type: 'DELAY' | 'IDLE' | 'ROUTE_DEVIATION'; severity: Severity; openedAt: Date; };
type Shipment = {
  id: string; reference: string; carrier: string; driverName: string; driverId: string;
  status: Status; lat: number; lng: number; speedKph: number; heading: number; updated: Date;
  origin: string; destination: string; lane: string; eta: Date; confidence: number; marginMin: number;
  deviationKm: number; priority: 'HIGH'|'MEDIUM'|'LOW'; tags: string[]; source: string; port: string; alerts: AlertT[];
};

const statusColor = {
  IN_TRANSIT: 'bg-emerald-500',
  DELAYED: 'bg-rose-500',
  IDLE: 'bg-amber-500'
} as const;

function timeLeft(d: Date) {
  const diff = Math.floor((d.getTime() - Date.now()) / 60000);
  if (diff < 0) return `${Math.abs(diff)}m ago`;
  if (diff < 60) return `${diff}m`;
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
}

export default function RoadIQ() {
  const { user, logout } = useAuth();

  // UAE-only mock data
  const base: Shipment[] = useMemo(() => [
    { id:'SHP-74219', reference:'REF-8821', carrier:'DHL Express', driverName:'Ahmed K.', driverId:'D-4512', status:'IN_TRANSIT', lat:25.276987, lng:55.296249, speedKph:72, heading:135, updated:new Date(Date.now()-2*60000), origin:'Abu Dhabi', destination:'Dubai', lane:'AE-DXB', eta:new Date(Date.now()+3*60000), confidence:94, marginMin:8, deviationKm:0.3, priority:'HIGH', tags:['temp:2-8C','fragile'], source:'Volvo', port:'Jebel Ali', alerts:[] },
    { id:'SHP-74220', reference:'REF-8822', carrier:'Aramex', driverName:'Mohammed S.', driverId:'D-4513', status:'DELAYED', lat:24.453884, lng:54.377344, speedKph:0, heading:0, updated:new Date(Date.now()-18*60000), origin:'Abu Dhabi', destination:'Muscat', lane:'AE-SA', eta:new Date(Date.now()+120*60000), confidence:68, marginMin:35, deviationKm:12.7, priority:'MEDIUM', tags:['hazmat:limited'], source:'Samsara', port:'Abu Dhabi Port', alerts:[{ type:'DELAY', severity:'HIGH', openedAt:new Date(Date.now()-15*60000) }] },
    { id:'SHP-74221', reference:'REF-8823', carrier:'FedEx', driverName:'Youssef A.', driverId:'D-4514', status:'IN_TRANSIT', lat:25.198, lng:55.274, speedKph:85, heading:90, updated:new Date(Date.now()-1*60000), origin:'Dubai', destination:'Sharjah', lane:'AE-DXB', eta:new Date(Date.now()+22*60000), confidence:97, marginMin:4, deviationKm:0.1, priority:'HIGH', tags:['lane:AE-DXB'], source:'Geotab', port:'Jebel Ali', alerts:[] },
    { id:'SHP-74224', reference:'REF-8826', carrier:'Aramex', driverName:'Omar F.', driverId:'D-4517', status:'IDLE', lat:25.0657, lng:55.17128, speedKph:0, heading:45, updated:new Date(Date.now()-8*60000), origin:'Sharjah', destination:'Dubai', lane:'AE-DXB', eta:new Date(Date.now()+42*60000), confidence:65, marginMin:28, deviationKm:8.9, priority:'HIGH', tags:['temp:2-8C'], source:'Webfleet', port:'Jebel Ali', alerts:[{ type:'IDLE', severity:'MEDIUM', openedAt:new Date(Date.now()-5*60000) }] }
  ], []);

  const [shipments, setShipments] = useState<Shipment[]>(base);
  useEffect(() => {
    const id = setInterval(() => {
      setShipments(s => s.map(x => x.status === 'IN_TRANSIT' ? { ...x, speedKph: Math.max(0, x.speedKph + (Math.random()-0.5)*8), updated: new Date() } : x));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const [activeTab, setActiveTab] = useState<'map'|'list'>('map');
  const kpis = useMemo(() => {
    const total = shipments.length;
    const activeAlerts = shipments.reduce((a,s) => a + s.alerts.length, 0);
    const etaAcc = (shipments.reduce((a,s)=>a+s.confidence,0)/(total||1)).toFixed(1);
    return { total, activeAlerts, etaAcc, totalValue:'$262K' };
  }, [shipments]);

  const pins: Pin[] = useMemo(() =>
    shipments.map(s => ({ id: s.id, lat: s.lat, lng: s.lng, caption: `${s.carrier} • ${s.driverName} • ${s.speedKph.toFixed(0)} km/h` })), [shipments]
  );

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Top bar */}
      <div className="px-4 lg:px-6 py-3 border-b border-slate-800/70 bg-slate-900/90 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 min-w-[220px]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 grid place-items-center">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold leading-tight">RoadIQ</div>
              <div className="text-[10px] text-slate-400 -mt-0.5">Freight Forwarding Platform</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 text-sm">
            <span className="text-slate-300">{user?.org || 'Gulf Logistics Solutions'}</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>

          <div className="flex-1" />

          <div className="hidden lg:flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input className="w-full bg-slate-800/70 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm"
                     placeholder="Search shipments, carriers, drivers…" />
            </div>
            <button className="tabchip tabchip-idle flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</button>
            <button className="relative tabchip tabchip-idle"><Bell className="w-4 h-4" /><span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] grid place-items-center">2</span></button>
            <button className="tabchip tabchip-idle"><Settings className="w-4 h-4" /></button>
            <button onClick={logout} className="tabchip tabchip-idle">{user?.email?.split('@')[0]?.slice(0,2).toUpperCase() || 'RA'}</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left KPI rail */}
        <aside className="w-[320px] p-4 border-r border-slate-800/70 bg-slate-950/50 hidden md:block">
          <div className="grid gap-3">
            <button className="card px-3 py-2 flex items-center gap-2 text-sm hover:bg-slate-900/80">
              <Plus className="w-4 h-4" /> New Booking
            </button>
            <button className="card px-3 py-2 flex items-center gap-2 text-sm hover:bg-slate-900/80">
              <BarChart3 className="w-4 h-4" /> Generate Report
            </button>

            <div className="card p-4">
              <div className="text-xs text-slate-400">Active Shipments</div>
              <div className="text-3xl font-semibold mt-1">{kpis.total}</div>
              <div className="text-emerald-400 text-xs mt-1">+3</div>
            </div>

            <div className="card p-4">
              <div className="text-xs text-slate-400">Total Value</div>
              <div className="text-3xl font-semibold mt-1">{kpis.totalValue}</div>
              <div className="text-emerald-400 text-xs mt-1">+12%</div>
            </div>

            <div className="card p-4">
              <div className="text-xs text-slate-400">ETA Accuracy</div>
              <div className="text-3xl font-semibold mt-1">{kpis.etaAcc}%</div>
              <div className="text-emerald-400 text-xs mt-1">+2.3%</div>
            </div>

            <div className="card p-4">
              <div className="text-xs text-slate-400">Active Alerts</div>
              <div className="text-3xl font-semibold mt-1">{kpis.activeAlerts}</div>
              <div className="text-rose-400 text-xs mt-1">-2</div>
            </div>

            <div className="card p-4">
              <div className="text-sm font-medium mb-2">Business Insights</div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>$262K total shipment value in transit</li>
                <li>Dubai Airports: highest value client ($82K)</li>
                <li>2 high-priority shipments need attention</li>
                <li>FedEx: 97% ETA accuracy (top carrier)</li>
              </ul>
            </div>

            <div className="mt-1">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Active Shipments</span>
                <span>{shipments.length} results</span>
              </div>
              <div className="space-y-2">
                {shipments.map(s => (
                  <div key={s.id} className="card p-3 hover:bg-slate-900/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">{s.id}</div>
                        <div className="text-[11px] text-slate-400">{s.carrier}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] text-white ${statusColor[s.status]}`}>
                        {s.status.replace('_',' ')}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {s.speedKph.toFixed(0)} km/h</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ETA {timeLeft(s.eta)}</span>
                    </div>
                    {s.alerts.length > 0 && (
                      <div className="mt-2 text-[11px] text-slate-300 flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-rose-400" /> {s.alerts[0].type.replace('_',' ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right main pane */}
        <section className="flex-1 flex flex-col">
          <div className="px-4 lg:px-6 py-3 border-b border-slate-800/70 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('map')}
                className={`tabchip ${activeTab==='map' ? 'tabchip-active' : 'tabchip-idle'} flex items-center gap-2`}
              >
                <MapPin className="w-4 h-4" /> Live Tracking
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`tabchip ${activeTab==='list' ? 'tabchip-active' : 'tabchip-idle'}`}
              >
                Shipment List
              </button>
              <div className="ml-auto text-xs text-emerald-400">● Real-time updates active</div>
            </div>
          </div>

          {activeTab === 'map' ? (
            <div className="flex-1 relative bg-grid">
              <div className="absolute top-4 left-4 card px-3 py-2">
                <div className="text-[10px] text-slate-400">UAE & GCC Region</div>
                <div className="text-sm font-semibold">Live Fleet Tracking</div>
                <div className="text-[11px] text-emerald-400 mt-1">• {shipments.filter(s=>s.status!=='IDLE').length} vehicles in transit</div>
              </div>

              <div className="absolute inset-0">
                <UAEMap pins={pins} />
              </div>

              <div className="absolute left-4 bottom-4 card px-3 py-2 text-[12px]">
                <div className="font-medium mb-1">Legend</div>
                <div className="flex items-center gap-3 text-slate-300">
                  <span><span className="dot bg-emerald-500 mr-1" /> In Transit</span>
                  <span><span className="dot bg-rose-500 mr-1" /> Delayed</span>
                  <span><span className="dot bg-amber-500 mr-1" /> Idle</span>
                </div>
              </div>

              <button className="absolute right-5 bottom-5 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 grid place-items-center shadow-card">
                <MessageSquare className="w-6 h-6 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex-1 p-4 lg:p-6">
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-900/80 border-b border-slate-800/70">
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                      {['Shipment','Carrier','Driver','Route','Speed','ETA','Status','Last Update'].map(h => (
                        <th key={h} className="px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {shipments.map(s => (
                      <tr key={s.id} className="hover:bg-slate-900/60">
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold">{s.id}</div>
                          <div className="text-[11px] text-slate-400">{s.reference}</div>
                        </td>
                        <td className="px-4 py-3">{s.carrier}</td>
                        <td className="px-4 py-3">{s.driverName}</td>
                        <td className="px-4 py-3">{s.origin} → {s.destination}</td>
                        <td className="px-4 py-3">{s.speedKph.toFixed(0)} km/h</td>
                        <td className="px-4 py-3">{timeLeft(s.eta)} <span className="text-[11px] text-slate-400">({s.confidence}% conf.)</span></td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-[11px] text-white ${statusColor[s.status]}`}>{s.status.replace('_',' ')}</span></td>
                        <td className="px-4 py-3 text-slate-300">{timeLeft(s.updated)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
