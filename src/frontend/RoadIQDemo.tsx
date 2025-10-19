import React, { useMemo, useState } from "react";

/**
 * RoadIQ — UI Demo (Single-file React)
 * Tailwind-ready. Replace map placeholder with Mapbox GL / HERE.
 */

type Shipment = {
  id: string;
  reference: string;
  carrier: string;
  vehicleId: string;
  driver: { id: string; name: string; licenseRef?: string; contactMasked?: string };
  status: "IN_TRANSIT" | "IDLE" | "DELAYED" | "OFFLINE";
  position: { lat: number; lng: number; speedKph?: number; heading?: number; ts: string };
  origin: string;
  destination: string;
  eta?: { ts: string; confidence?: number; marginMin?: number };
  deviationKm?: number;
  tags?: string[];
};

const fmtTime = (iso?: string) => (iso ? new Date(iso).toLocaleTimeString() : "—");
const fromNow = (iso?: string) => {
  if (!iso) return "—";
  const d = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (d < 60) return `${Math.floor(d)}s ago`;
  if (d < 3600) return `${Math.floor(d/60)}m ago`;
  return `${Math.floor(d/3600)}h ago`;
};
const pct = (n?: number) => (n == null ? "—" : `${Math.round(n * 100)}%`);
const tokenize = (q: string) => q.trim().toLowerCase().split(/\s+/).filter(Boolean);

function matches(sh: Shipment, query: string) {
  if (!query) return true;
  const tokens = tokenize(query);
  const hay = [
    sh.id, sh.reference, sh.carrier, sh.vehicleId,
    sh.driver?.name, sh.driver?.id, sh.driver?.licenseRef,
    sh.origin, sh.destination, sh.status,
    ...(sh.tags || []),
  ].join(" ").toLowerCase();
  return tokens.every(t => hay.includes(t));
}

function StatusChip({ s }: { s: Shipment["status"] }) {
  const map: Record<Shipment["status"], string> = {
    IN_TRANSIT: "bg-emerald-100 text-emerald-700",
    IDLE: "bg-amber-100 text-amber-800",
    DELAYED: "bg-red-100 text-red-700",
    OFFLINE: "bg-gray-200 text-gray-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[s]}`}>{s}</span>;
}

function KPICard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border bg-card text-card-foreground p-4 shadow-sm">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

const MOCK: Shipment[] = [
  {
    id: "SHP-74219",
    reference: "PO-8891",
    carrier: "DHL",
    vehicleId: "VEH-112",
    driver: { id: "DRV-311", name: "Ahmed Salem", licenseRef: "UAE-99821", contactMasked: "+971-5X-XXX-123" },
    status: "IN_TRANSIT",
    position: { lat: 25.2048, lng: 55.2708, speedKph: 62, heading: 118, ts: "2025-10-15T08:12:18Z" },
    origin: "Jebel Ali, AE",
    destination: "Riyadh, SA",
    eta: { ts: "2025-10-15T14:35:00Z", confidence: 0.82, marginMin: 8 },
    deviationKm: 0.3,
    tags: ["priority:A", "lane:AE-SA"],
  },
  {
    id: "SHP-74255",
    reference: "PO-8899",
    carrier: "Aramex",
    vehicleId: "VEH-341",
    driver: { id: "DRV-122", name: "Fatima Khan", licenseRef: "UAE-55321", contactMasked: "+971-5X-XXX-821" },
    status: "DELAYED",
    position: { lat: 24.4539, lng: 54.3773, speedKph: 18, heading: 92, ts: "2025-10-15T08:10:05Z" },
    origin: "Abu Dhabi, AE",
    destination: "Muscat, OM",
    eta: { ts: "2025-10-15T16:05:00Z", confidence: 0.64, marginMin: 25 },
    deviationKm: 11.2,
    tags: ["lane:AE-OM"],
  },
  {
    id: "SHP-74001",
    reference: "BOOK-557",
    carrier: "DB Schenker",
    vehicleId: "VEH-902",
    driver: { id: "DRV-501", name: "Omar N.", licenseRef: "KSA-92833", contactMasked: "+966-5X-XXX-502" },
    status: "IDLE",
    position: { lat: 25.276987, lng: 55.296249, speedKph: 0, heading: 10, ts: "2025-10-15T08:09:48Z" },
    origin: "Dubai, AE",
    destination: "Doha, QA",
    eta: { ts: "2025-10-15T20:20:00Z", confidence: 0.9, marginMin: 5 },
    deviationKm: 0,
    tags: ["temp:2-8C", "lane:AE-QA"],
  },
];

export default function RoadIQ() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Shipment | null>(null);
  const filtered = useMemo(() => MOCK.filter((s) => matches(s, q)), [q]);

  const kpiEtaAcc = "92%";
  const kpiDelayPrec = "88%";
  const kpiAvgDelay = "12 min";
  const kpiUptime = "99.95%";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="text-lg font-semibold">RoadIQ</div>
          <div className="flex-1" />
          <div className="w-full max-w-xl">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Search: shipment, carrier, driver, vehicle, origin/destination, tag (e.g. lane:AE-SA)'
              className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="ml-3 rounded-xl border px-3 py-2 text-sm">Alerts</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 p-4">
        <aside className="col-span-12 lg:col-span-2 space-y-3">
          <div className="rounded-2xl border p-4">
            <div className="font-medium">Quick Filters</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {["status:IN_TRANSIT", "status:DELAYED", "carrier:DHL", "lane:AE-SA", "driver:Ahmed"].map((tag) => (
                <button key={tag} onClick={() => setQ(tag)} className="rounded-full border px-2 py-1 hover:bg-accent">
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="font-medium mb-2">Legend</div>
            <ul className="text-sm space-y-1">
              <li>🟢 On-Time</li>
              <li>🟡 Idle &gt; 10m</li>
              <li>🔴 Delayed / Deviated</li>
              <li>⚪ Offline &gt; 5m</li>
            </ul>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-6">
          <div className="rounded-2xl border h-[420px] relative overflow-hidden bg-[linear-gradient(120deg,rgba(16,185,129,.08),rgba(99,102,241,.08))]">
            <div className="absolute inset-0 grid place-items-center text-muted-foreground">
              <div className="text-center">
                <div className="text-sm uppercase tracking-wide">Map Placeholder</div>
                <div className="text-xs">(Integrate Mapbox GL / HERE Maps)</div>
              </div>
            </div>
            <div className="absolute left-12 top-14">
              <MarkerCard s={MOCK[0]} onOpen={() => setSelected(MOCK[0])} />
            </div>
            <div className="absolute right-10 bottom-12">
              <MarkerCard s={MOCK[1]} onOpen={() => setSelected(MOCK[1])} />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  {["Shipment", "Carrier", "Driver", "Speed (km/h)", "ETA", "Status", "Last Update"].map((h) => (
                    <th key={h} className="px-3 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-accent/30 cursor-pointer" onClick={() => setSelected(r)}>
                    <td className="px-3 py-2 font-medium">{r.id}</td>
                    <td className="px-3 py-2">{r.carrier}</td>
                    <td className="px-3 py-2">{r.driver?.name}</td>
                    <td className="px-3 py-2">{r.position?.speedKph ?? "—"}</td>
                    <td className="px-3 py-2">
                      {fmtTime(r.eta?.ts)} ({pct(r.eta?.confidence)})
                    </td>
                    <td className="px-3 py-2">
                      <StatusChip s={r.status} />
                    </td>
                    <td className="px-3 py-2">{fromNow(r.position?.ts)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <aside className="col-span-12 lg:col-span-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <KPICard label="ETA Accuracy" value={kpiEtaAcc} sub="MAE ≤ 10m" />
            <KPICard label="Alert Precision" value={kpiDelayPrec} sub="Lower false positives" />
            <KPICard label="Avg Delay" value={kpiAvgDelay} sub="Last 24h" />
            <KPICard label="Uptime" value={kpiUptime} sub="SLA" />
          </div>

          <div className="rounded-2xl border p-4">
            <div className="font-medium mb-2">AI Insights</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>5 shipments predicted &gt; 20 min late (Abu Dhabi → Muscat).</li>
              <li>Model drift +6% detected; retraining tonight 02:00 UTC.</li>
              <li>95% on-time from Jebel Ali corridor today.</li>
            </ul>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="font-medium mb-2">Chatbot — RoadIQ Assistant</div>
            <div className="text-sm text-muted-foreground">
              Ask: “Where is SHP-74219?”, “Delayed &gt; 15 min today?”, “Best carrier on-time % this week?”
            </div>
            <div className="mt-3 flex gap-2">
              {["Where is SHP-74219?", "Late shipments today", "Carrier ranking"].map((t) => (
                <button key={t} className="rounded-full border px-3 py-1 text-xs hover:bg-accent">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">
                  {selected.id} — {selected.carrier}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selected.origin} → {selected.destination}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-xl border px-2 py-1 text-sm">
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <KPICard label="Driver" value={selected.driver?.name || "—"} sub={`ID ${selected.driver?.id}`} />
              <KPICard
                label="Speed"
                value={`${selected.position?.speedKph ?? 0} km/h`}
                sub={fromNow(selected.position?.ts)}
              />
              <KPICard
                label="ETA"
                value={fmtTime(selected.eta?.ts)}
                sub={`Confidence ${pct(selected.eta?.confidence)}`}
              />
              <KPICard label="Deviation" value={`${selected.deviationKm ?? 0} km`} sub={selected.status} />
            </div>

            <div className="mt-4 rounded-2xl border p-4">
              <div className="font-medium mb-2">Driver Details</div>
              <div className="text-sm grid grid-cols-2 gap-y-1">
                <div className="text-muted-foreground">Name</div>
                <div>{selected.driver?.name}</div>
                <div className="text-muted-foreground">License</div>
                <div>{selected.driver?.licenseRef ?? "—"}</div>
                <div className="text-muted-foreground">Contact</div>
                <div>{selected.driver?.contactMasked ?? "—"}</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border p-4">
              <div className="font-medium mb-2">Alerts</div>
              <ul className="text-sm space-y-1">
                <li className="text-muted-foreground">No active alerts (demo)</li>
              </ul>
            </div>

            <div className="mt-4 rounded-2xl border p-4">
              <div className="font-medium mb-2">Timeline</div>
              <ol className="text-sm list-decimal pl-5 space-y-1">
                <li>
                  {fromNow(selected.position?.ts)} • Position update • {selected.position?.lat.toFixed(4)},{" "}
                  {selected.position?.lng.toFixed(4)}
                </li>
                <li>— Geofence events & breadcrumbs (last 6h) —</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MarkerCard({ s, onOpen }: { s: Shipment; onOpen: () => void }) {
  return (
    <button className="rounded-xl border bg-background/95 backdrop-blur px-3 py-2 shadow hover:shadow-md text-left" onClick={onOpen}>
      <div className="text-sm font-semibold">
        {s.id} • {s.carrier}
      </div>
      <div className="text-xs">
        Driver: {s.driver?.name} • Speed: {s.position?.speedKph ?? 0} km/h
      </div>
      <div className="text-xs text-muted-foreground">
        ETA {fmtTime(s.eta?.ts)} ({pct(s.eta?.confidence)}) • {fromNow(s.position?.ts)}
      </div>
    </button>
  );
}
