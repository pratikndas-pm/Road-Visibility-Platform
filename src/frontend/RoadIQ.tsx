
import React, { useMemo, useState } from 'react';
import { MapPin, Navigation, Search, Filter, Bell, Settings, Plus, BarChart3, Clock, AlertTriangle, MessageSquare } from 'lucide-react';
import UAEMap, { Pin } from '../components/UAEMap';

type Status = 'IN_TRANSIT' | 'DELAYED' | 'IDLE';
type Shipment = { id: string; carrier: string; driverName: string; status: Status; lat: number; lng: number; speedKph: number; etaMins: number };

const statusColor: Record<Status,string> = { IN_TRANSIT:'bg-emerald-500', DELAYED:'bg-rose-500', IDLE:'bg-amber-500' };

export default function RoadIQ(){
  const [activeTab, setActiveTab] = useState<'map'|'list'>('map');
  const shipments: Shipment[] = useMemo(()=>[
    { id:'SHP-74219', carrier:'DHL Express', driverName:'Ahmed K.', status:'IN_TRANSIT', lat:25.276987, lng:55.296249, speedKph:72, etaMins:3 },
    { id:'SHP-74220', carrier:'Aramex', driverName:'Mohammed S.', status:'DELAYED',   lat:24.453884, lng:54.377344, speedKph:0,  etaMins:120 },
    { id:'SHP-74221', carrier:'FedEx',     driverName:'Youssef A.', status:'IN_TRANSIT', lat:25.198,    lng:55.274,    speedKph:85, etaMins:22 },
    { id:'SHP-74224', carrier:'Aramex',    driverName:'Omar F.',    status:'IDLE',       lat:25.0657,   lng:55.17128,  speedKph:0,  etaMins:42 }
  ],[]);

  const pins: Pin[] = shipments.map(s=>({ id:s.id, lat:s.lat, lng:s.lng, caption:`${s.carrier} • ${s.driverName}` }));
  const kpis = { total: shipments.length, value:'$262K', eta:'81.2%', alerts: 3 };

  return (
    <div className="h-screen flex flex-col bg-slate-950">
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
          <div className="flex-1" />
          <div className="hidden lg:flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input className="w-full bg-slate-800/70 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm" placeholder="Search shipments, carriers, drivers…" />
            </div>
            <button className="tabchip tabchip-idle flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</button>
            <button className="relative tabchip tabchip-idle"><Bell className="w-4 h-4" /></button>
            <button className="tabchip tabchip-idle"><Settings className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[320px] p-4 border-r border-slate-800/70 bg-slate-950/50 hidden md:block">
          <div className="grid gap-3">
            <button className="card px-3 py-2 flex items-center gap-2 text-sm hover:bg-slate-900/80"><Plus className="w-4 h-4" /> New Booking</button>
            <button className="card px-3 py-2 flex items-center gap-2 text-sm hover:bg-slate-900/80"><BarChart3 className="w-4 h-4" /> Generate Report</button>
            <div className="card p-4"><div className="text-xs text-slate-400">Active Shipments</div><div className="text-3xl font-semibold mt-1">{kpis.total}</div></div>
            <div className="card p-4"><div className="text-xs text-slate-400">Total Value</div><div className="text-3xl font-semibold mt-1">{kpis.value}</div></div>
            <div className="card p-4"><div className="text-xs text-slate-400">ETA Accuracy</div><div className="text-3xl font-semibold mt-1">{kpis.eta}</div></div>
            <div className="card p-4"><div className="text-xs text-slate-400">Active Alerts</div><div className="text-3xl font-semibold mt-1">{kpis.alerts}</div></div>
          </div>
        </aside>

        <section className="flex-1 flex flex-col">
          <div className="px-4 lg:px-6 py-3 border-b border-slate-800/70 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <button onClick={()=>setActiveTab('map')} className={`tabchip ${activeTab==='map'?'tabchip-active':'tabchip-idle'} flex items-center gap-2`}><MapPin className="w-4 h-4" /> Live Tracking</button>
              <button onClick={()=>setActiveTab('list')} className={`tabchip ${activeTab==='list'?'tabchip-active':'tabchip-idle'}`}>Shipment List</button>
              <div className="ml-auto text-xs text-emerald-400">● Real-time updates active</div>
            </div>
          </div>

          {activeTab==='map' ? (
            <div className="flex-1 relative bg-grid">
              <div className="absolute top-4 left-4 card px-3 py-2">
                <div className="text-[10px] text-slate-400">UAE & GCC Region</div>
                <div className="text-sm font-semibold">Live Fleet Tracking</div>
                <div className="text-[11px] text-emerald-400 mt-1">• {shipments.filter(s=>s.status!=='IDLE').length} vehicles in transit</div>
              </div>
              <div className="absolute inset-0"><UAEMap pins={pins} /></div>
              <div className="absolute left-4 bottom-4 card px-3 py-2 text-[12px]">
                <div className="font-medium mb-1">Legend</div>
                <div className="flex items-center gap-3 text-slate-300">
                  <span><span className="dot bg-emerald-500 mr-1" /> In Transit</span>
                  <span><span className="dot bg-rose-500 mr-1" /> Delayed</span>
                  <span><span className="dot bg-amber-500 mr-1" /> Idle</span>
                </div>
              </div>
              <button className="absolute right-5 bottom-5 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 grid place-items-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex-1 p-4 lg:p-6">
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-900/80 border-b border-slate-800/70">
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                      {['Shipment','Carrier','Driver','Speed','ETA','Status'].map(h=><th key={h} className="px-4 py-3">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {shipments.map(s => (
                      <tr key={s.id} className="hover:bg-slate-900/60">
                        <td className="px-4 py-3">{s.id}</td>
                        <td className="px-4 py-3">{s.carrier}</td>
                        <td className="px-4 py-3">{s.driverName}</td>
                        <td className="px-4 py-3">{s.speedKph.toFixed(0)} km/h</td>
                        <td className="px-4 py-3">{s.etaMins}m</td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-[11px] text-white ${statusColor[s.status]}`}>{s.status.replace('_',' ')}</span></td>
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
