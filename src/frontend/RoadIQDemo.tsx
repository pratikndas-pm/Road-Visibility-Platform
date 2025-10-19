import React, { useMemo, useState } from 'react';
import MapView, { ShipmentPin } from '../components/MapView';

type Shipment = {
  id: string;
  reference: string;
  carrier: string;
  vehicleId: string;
  driver: { id: string; name: string; licenseRef?: string; contactMasked?: string };
  status: 'IN_TRANSIT' | 'IDLE' | 'DELAYED' | 'OFFLINE';
  position: { lat: number; lng: number; speedKph?: number; heading?: number; ts: string };
  origin: string;
  destination: string;
  eta?: { ts: string; confidence?: number; marginMin?: number };
  deviationKm?: number;
  tags?: string[];
};

const fmtTime = (iso?: string) => (iso ? new Date(iso).toLocaleTimeString() : '—');
const fromNow = (iso?: string) => {
  if (!iso) return '—';
  const d = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (d < 60) return String(Math.floor(d)) + 's ago';
  if (d < 3600) return String(Math.floor(d / 60)) + 'm ago';
  return String(Math.floor(d / 3600)) + 'h ago';
};
const pct = (n?: number) => (n == null ? '—' : String(Math.round(n * 100)) + '%');
const tokenize = (q: string) => q.trim().toLowerCase().split(/\s+/).filter(Boolean);

function matches(sh: Shipment, query: string) {
  if (!query) return true;
  const tokens = tokenize(query);
  const hay = [
    sh.id, sh.reference, sh.carrier, sh.vehicleId,
    sh.driver?.name, sh.driver?.id, sh.driver?.licenseRef,
    sh.origin, sh.destination, sh.status,
    ...(sh.tags || []),
  ].join(' ').toLowerCase();
  return tokens.every(t => hay.includes(t));
}

function StatusChip({ s }: { s: Shipment['status'] }) {
  const map: Record<Shipment['status'], string> = {
    IN_TRANSIT: 'bg-emerald-100 text-emerald-700',
    IDLE: 'bg-amber-100 text-amber-800',
    DELAYED: 'bg-red-100 text-red-700',
    OFFLINE: 'bg-gray-200 text-gray-700',
  };
  return <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + map[s]}>{s}</span>;
}

function KPICard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub ? <div className="text-xs text-gray-500 mt-1">{sub}</div> : null}
    </div>
  );
}

const MOCK: Shipment[] = [
  {
    id: 'SHP-74219',
    reference: 'PO-8891',
    carrier: 'DHL',
    vehicleId: 'VEH-112',
    driver: { id: 'DRV-311', name: 'Ahmed Salem', licenseRef: 'UAE-99821', contactMasked: '+971-5X-XXX-123' },
    status: 'IN_TRANSIT',
    position: { lat: 25.2048, lng: 55.2708, speedKph: 62, heading: 118, ts: '2025-10-15T08:12:18Z' },
    origin: 'Jebel Ali, AE',
    destination: 'Riyadh, SA',
    eta: { ts: '2025-10-15T14:35:00Z', confidence: 0.82, marginMin: 8 },
    deviationKm: 0.3,
    tags: ['priority:A', 'lane:AE-SA'],
  },
  {
    id: 'SHP-74255',
    reference: 'PO-8899',
    carrier: 'Aramex',
    vehicleId: 'VEH-341',
    driver: { id: 'DRV-122', name: 'Fatima Khan', licenseRef: 'UAE-55321', contactMasked: '+971-5X-XXX-821' },
    status: 'DELAYED',
    position: { lat: 24.4539, lng: 54.3773, speedKph: 18, heading: 92, ts: '2025-10-15T08:10:05Z' },
    origin: 'Abu Dhabi, AE',
    destination: 'Muscat, OM',
    eta: { ts: '2025-10-15T16:05:00Z', confidence: 0.64, marginMin: 25 },
    deviationKm: 11.2,
    tags: ['lane:AE-OM'],
  },
  {
    id: 'SHP-74001',
    reference: 'BOOK-557',
    carrier: 'DB Schenker',
    vehicleId: 'VEH-902',
    driver: { id: 'DRV-501', name: 'Omar N.', licenseRef: 'KSA-92833', contactMasked: '+966-5X-XXX-502' },
    status: 'IDLE',
    position: { lat: 25.276987, lng: 55.296249, speedKph: 0, heading: 10, ts: '2025-10-15T08:09:48Z' },
    origin: 'Dubai, AE',
    destination: 'Doha, QA',
    eta: { ts: '2025-10-15T20:20:00Z', confidence: 0.9, marginMin: 5 },
    deviationKm: 0,
    tags: ['temp:2-8C', 'lane:AE-QA'],
  },
];

export default function RoadIQ() {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Shipment | null>(null);
  const filtered = useMemo(() => MOCK.filter((s) => matches(s, q)), [q]);

  const pins: ShipmentPin[] = filtered.map((s) => ({
    id: s.id,
    caption: s.carrier + ' • ' + (s.driver?.name || '') + ' • ' + String(s.position?.speedKph || 0) + ' km/h',
    pos: { lat: s.position.lat, lng: s.position.lng }
  }));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b sticky top-0 z-40 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="text-lg font-semibold">RoadIQ</div>
          <div className="flex-1" />
          <div className="w-full max-w-xl">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: shipment, carrier, driver, vehicle, origin/destination, tag (e.g. lane:AE-SA)"
              className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button className="ml-3 rounded-xl border px-3 py-2 text-sm">Alerts</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 p-4">
        <aside className="col-span-12 lg:col-span-2 space-y-3">
          <div className="rounded-2xl border p-4 bg-white">
            <div className="font-medium">Quick Filters</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {['status:IN_TRANSIT', 'status:DELAYED', 'carrier:DHL', 'lane:AE-SA', 'driver:Ahmed'].map((tag) => (
                <button key={tag} onClick={() => setQ(tag)} className="rounded-full border px-2 py-1 hover:bg-gray-100">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-6 space-y-4">
          <MapView
            pins={pins}
            geofenceUrl="/data/geofences.geojson"
            onPinClick={(id) => {
              const s = filtered.find(x => x.id === id);
              if (s) setSelected(s);
            }}
          />

          <div className="rounded-2xl border overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {['Shipment', 'Carrier', 'Driver', 'Speed (km/h)', 'ETA', 'Status', 'Last Update'].map((h) => (
                    <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(r)}>
                    <td className="px-3 py-2 font-medium">{r.id}</td>
                    <td className="px-3 py-2">{r.carrier}</td>
                    <td className="px-3 py-2">{r.driver?.name}</td>
                    <td className="px-3 py-2">{r.position?.speedKph ?? '—'}</td>
                    <td className="px-3 py-2">{fmtTime(r.eta?.ts)} ({pct(r.eta?.confidence)})</td>
                    <td className="px-3 py-2"><StatusChip s={r.status} /></td>
                    <td className="px-3 py-2">{fromNow(r.position?.ts)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <aside className="col-span-12 lg:col-span-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <KPICard label="ETA Accuracy" value="92%" sub="MAE <= 10m" />
            <KPICard label="Alert Precision" value="88%" sub="Lower false positives" />
            <KPICard label="Avg Delay" value="12 min" sub="Last 24h" />
            <KPICard label="Uptime" value="99.95%" sub="SLA" />
          </div>
        </aside>
      </div>

      {selected ? (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white border-l p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{selected.id} — {selected.carrier}</div>
                <div className="text-sm text-gray-500">{selected.origin} to {selected.destination}</div>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-xl border px-2 py-1 text-sm">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <KPICard label="Driver" value={selected.driver?.name || '—'} sub={'ID ' + (selected.driver?.id || '')} />
              <KPICard label="Speed" value={(selected.position?.speedKph || 0) + ' km/h'} sub={fromNow(selected.position?.ts)} />
              <KPICard label="ETA" value={fmtTime(selected.eta?.ts)} sub={'Confidence ' + pct(selected.eta?.confidence)} />
              <KPICard label="Deviation" value={(selected.deviationKm || 0) + ' km'} sub={selected.status} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatusChip({ s }: { s: Shipment['status'] }) {
  const map: Record<Shipment['status'], string> = {
    IN_TRANSIT: 'bg-emerald-100 text-emerald-700',
    IDLE: 'bg-amber-100 text-amber-800',
    DELAYED: 'bg-red-100 text-red-700',
    OFFLINE: 'bg-gray-200 text-gray-700',
  };
  return <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + map[s]}>{s}</span>;
}
