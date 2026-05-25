import { useState, useEffect, useRef } from "react";

const TABS = ["Dashboard", "Lista de Espera", "Predicción", "Reportes", "Datos"];

const SAMPLE_DATA = [
  { id: 1, paciente: "P-0041", edad: 67, dx: "Neumonía", estancia: 8, ocupacion: "UCI", riesgo: 0.87 },
  { id: 2, paciente: "P-0042", edad: 54, dx: "Fractura", estancia: 3, ocupacion: "General", riesgo: 0.32 },
  { id: 3, paciente: "P-0043", edad: 78, dx: "ICC", estancia: 11, ocupacion: "UCI", riesgo: 0.91 },
  { id: 4, paciente: "P-0044", edad: 45, dx: "Apendicitis", estancia: 2, ocupacion: "General", riesgo: 0.18 },
  { id: 5, paciente: "P-0045", edad: 82, dx: "EPOC", estancia: 9, ocupacion: "UCI", riesgo: 0.79 },
  { id: 6, paciente: "P-0046", edad: 61, dx: "Infarto", estancia: 6, ocupacion: "Coronaria", riesgo: 0.74 },
];

const BEDS = [
  { id: "UCI-01", tipo: "UCI", ocupada: true, riesgo: 0.87 },
  { id: "UCI-02", tipo: "UCI", ocupada: true, riesgo: 0.91 },
  { id: "UCI-03", tipo: "UCI", ocupada: false, riesgo: 0 },
  { id: "UCI-04", tipo: "UCI", ocupada: true, riesgo: 0.79 },
  { id: "COR-01", tipo: "Coronaria", ocupada: true, riesgo: 0.74 },
  { id: "COR-02", tipo: "Coronaria", ocupada: false, riesgo: 0 },
  { id: "GEN-01", tipo: "General", ocupada: true, riesgo: 0.32 },
  { id: "GEN-02", tipo: "General", ocupada: true, riesgo: 0.18 },
  { id: "GEN-03", tipo: "General", ocupada: false, riesgo: 0 },
  { id: "GEN-04", tipo: "General", ocupada: false, riesgo: 0 },
  { id: "GEN-05", tipo: "General", ocupada: false, riesgo: 0 },
  { id: "GEN-06", tipo: "General", ocupada: false, riesgo: 0 },
];

const LOS_HISTORY = [
  { mes: "Ene", avg: 5.2 }, { mes: "Feb", avg: 4.8 }, { mes: "Mar", avg: 6.1 },
  { mes: "Abr", avg: 5.5 }, { mes: "May", avg: 7.2 }, { mes: "Jun", avg: 6.8 },
];

const LISTA_ESPERA = [
  { id: "LE-001", rut: "12.345.678-9", nombre: "María González", edad: 58, especialidad: "Traumatología", prestacion: "Artroplastia rodilla", diasEspera: 412, garantia: "GES", fechaIngreso: "2024-03-15", prioridad: 1, estado: "vencida" },
  { id: "LE-002", rut: "9.876.543-2", nombre: "Carlos Muñoz", edad: 71, especialidad: "Cardiología", prestacion: "Cateterismo", diasEspera: 115, garantia: "GES", fechaIngreso: "2025-01-24", prioridad: 2, estado: "alerta" },
  { id: "LE-003", rut: "15.432.100-K", nombre: "Ana Reyes", edad: 44, especialidad: "Oftalmología", prestacion: "Cirugía catarata", diasEspera: 201, garantia: "GES", fechaIngreso: "2024-11-02", prioridad: 1, estado: "vencida" },
  { id: "LE-004", rut: "8.765.432-1", nombre: "Pedro Soto", edad: 66, especialidad: "Urología", prestacion: "Prostatectomía", diasEspera: 47, garantia: "No GES", fechaIngreso: "2025-03-30", prioridad: 3, estado: "normal" },
  { id: "LE-005", rut: "11.222.333-4", nombre: "Rosa Martínez", edad: 52, especialidad: "Traumatología", prestacion: "Artroscopia hombro", diasEspera: 310, garantia: "No GES", fechaIngreso: "2024-06-28", prioridad: 2, estado: "critica" },
  { id: "LE-006", rut: "14.555.666-7", nombre: "Luis Herrera", edad: 39, especialidad: "Cirugía General", prestacion: "Colecistectomía", diasEspera: 62, garantia: "GES", fechaIngreso: "2025-03-04", prioridad: 2, estado: "alerta" },
  { id: "LE-007", rut: "7.888.999-0", nombre: "Carmen López", edad: 63, especialidad: "Cardiología", prestacion: "Marcapasos", diasEspera: 28, garantia: "GES", fechaIngreso: "2025-04-08", prioridad: 1, estado: "normal" },
  { id: "LE-008", rut: "16.111.222-3", nombre: "Jorge Vargas", edad: 75, especialidad: "Oftalmología", prestacion: "Cirugía retina", diasEspera: 178, garantia: "GES", fechaIngreso: "2024-12-05", prioridad: 1, estado: "vencida" },
];

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; }
  @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(2.5); opacity: 0; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes gridScroll { from { background-position: 0 0; } to { background-position: 40px 40px; } }
  input[type=range] { width: 100%; height: 4px; accent-color: #6366f1; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
  button:not(:disabled):hover { filter: brightness(1.09); transition: filter 0.15s; }
  [data-row]:hover { background: rgba(99,102,241,0.05) !important; cursor: pointer; }
  :root {
    --bg:#0a0b14; --bg-panel:#0d0e1f; --bg-card:rgba(255,255,255,0.03);
    --bg-card2:rgba(255,255,255,0.04); --bg-row:rgba(255,255,255,0.02);
    --bg-input:rgba(255,255,255,0.05); --bg-select:rgba(20,20,35,0.95);
    --bd:rgba(255,255,255,0.07); --bd2:rgba(255,255,255,0.08);
    --bd3:rgba(255,255,255,0.06); --bd4:rgba(255,255,255,0.04);
    --bd-in:rgba(255,255,255,0.1);
    --t1:#f0f4ff; --t2:#e5e7eb; --t3:#d1d5db;
    --t4:#9ca3af; --t5:#6b7280; --t6:#4b5563;
    --shadow:none;
  }
  :root.light {
    --bg:#f1f5f9; --bg-panel:#e2e8f0; --bg-card:#ffffff;
    --bg-card2:#ffffff; --bg-row:rgba(0,0,0,0.02);
    --bg-input:rgba(0,0,0,0.04); --bg-select:#ffffff;
    --bd:rgba(0,0,0,0.09); --bd2:rgba(0,0,0,0.11);
    --bd3:rgba(0,0,0,0.07); --bd4:rgba(0,0,0,0.05);
    --bd-in:rgba(0,0,0,0.13);
    --t1:#0f172a; --t2:#1e293b; --t3:#334155;
    --t4:#475569; --t5:#64748b; --t6:#94a3b8;
    --shadow:0 1px 3px rgba(0,0,0,0.08);
  }
`;

function downloadText(content, filename) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

async function callClaude(prompt, maxTokens = 1000) {
  const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] }) });
  const data = await res.json();
  return data.content?.find(b => b.type === "text")?.text || "";
}

function useExportFeedback(defaultLabel) {
  const [label, setLabel] = useState(defaultLabel);
  function trigger(fn) { fn(); setLabel("✓ Descargado"); setTimeout(() => setLabel(defaultLabel), 2000); }
  return [label, trigger];
}

function getRiskColor(r) {
  if (r >= 0.75) return "#ef4444";
  if (r >= 0.5) return "#f59e0b";
  return "#22c55e";
}
function getRiskLabel(r) {
  if (r >= 0.75) return "COMPLEJIDAD ALTA";
  if (r >= 0.5) return "COMPLEJIDAD MEDIA";
  return "BAJA COMPLEJIDAD";
}
function getEstadoColor(e) {
  if (e === "vencida") return "#ef4444";
  if (e === "critica") return "#f97316";
  if (e === "alerta") return "#f59e0b";
  return "#22c55e";
}
function getEstadoLabel(e) {
  if (e === "vencida") return "INCUMPLIMIENTO";
  if (e === "critica") return "SANCIÓN POSIBLE";
  if (e === "alerta") return "EN RIESGO GES";
  return "EN PLAZO";
}

function Pulse({ color = "#22c55e" }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: 10, height: 10, flexShrink: 0 }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, opacity: 0.4, animation: "pulse 1.5s ease-in-out infinite" }} />
      <span style={{ position: "absolute", inset: 2, borderRadius: "50%", background: color }} />
    </span>
  );
}

function KpiCard({ label, value, sub, accent = "#6366f1" }) {
  return (
    <div style={{ background: "var(--bg-card2)", border: "1px solid var(--bd2)", borderRadius: 14, padding: "18px 20px", boxShadow: "var(--shadow)" }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--t5)", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontFamily: "'DM Mono', monospace", fontWeight: 600, color: accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--t5)", marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function BedMap() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {["UCI", "Coronaria", "General"].map(tipo => (
        <div key={tipo}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--t5)", marginBottom: 6, textTransform: "uppercase" }}>{tipo}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {BEDS.filter(b => b.tipo === tipo).map(b => (
              <div key={b.id} title={b.id} style={{ width: 34, height: 34, borderRadius: 8, background: b.ocupada ? getRiskColor(b.riesgo) + "25" : "var(--bg-row)", border: `1.5px solid ${b.ocupada ? getRiskColor(b.riesgo) : "var(--bd2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: b.ocupada ? getRiskColor(b.riesgo) : "var(--t5)" }}>
                {b.ocupada ? "●" : "○"}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const LOS_NACIONAL = 5.8;
function BarChart() {
  const max = Math.max(...LOS_HISTORY.map(d => d.avg));
  const barAreaH = 58;
  const refPct = LOS_NACIONAL / max;
  const refBottom = refPct * barAreaH;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
          {LOS_HISTORY.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 9, color: "var(--t5)", fontFamily: "'DM Mono', monospace" }}>{d.avg}</div>
              <div style={{ width: "100%", borderRadius: "3px 3px 0 0", height: `${(d.avg / max) * barAreaH}px`, background: "linear-gradient(180deg, #6366f1, #4338ca)", opacity: i === LOS_HISTORY.length - 1 ? 1 : 0.45 }} />
              <div style={{ fontSize: 9, color: "var(--t5)" }}>{d.mes}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: `${refBottom + 16}px`, borderTop: "1.5px dashed #f59e0b", pointerEvents: "none" }}>
          <span style={{ position: "absolute", right: 0, top: -16, fontSize: 9, color: "#f59e0b", fontWeight: 600, background: "var(--bg-card)", padding: "1px 4px" }}>nacional {LOS_NACIONAL}d</span>
        </div>
      </div>
    </div>
  );
}

function RiskGauge({ riesgo, los, uci }) {
  const pct = Math.round(riesgo * 100);
  const color = getRiskColor(riesgo);
  const filled = (pct / 100) * 166;
  const uciColor = uci ? "#ef4444" : "#22c55e";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24, alignItems: "center", padding: "8px 0" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "var(--t5)", letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>LOS Estimado</div>
        <div style={{ fontSize: 52, fontFamily: "'DM Mono', monospace", color: "#6366f1", lineHeight: 1, fontWeight: 600 }}>{los}</div>
        <div style={{ fontSize: 12, color: "var(--t5)", marginTop: 6 }}>días de estancia</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <svg width="140" height="96" viewBox="0 0 140 96">
          <path d="M 14 70 A 56 56 0 0 0 126 70" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="10" strokeLinecap="round" />
          <path d="M 14 70 A 56 56 0 0 0 126 70" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 176} 176`} />
          <text x="70" y="92" textAnchor="middle" fontSize="30" fontWeight="700" fontFamily="DM Mono, monospace" fill={color}>{pct}%</text>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: -4 }}>
          <div style={{ fontSize: 10, color: "var(--t5)", letterSpacing: 1.5, textTransform: "uppercase" }}>Score de Complejidad</div>
          <span style={{ fontSize: 11, color, fontWeight: 700, letterSpacing: 1.5, background: color + "18", padding: "3px 12px", borderRadius: 6, border: `1px solid ${color}35` }}>{getRiskLabel(riesgo)}</span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "var(--t5)", letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>Requiere UCI</div>
        <div style={{ fontSize: 52, fontFamily: "'DM Mono', monospace", color: uciColor, lineHeight: 1, fontWeight: 600 }}>{uci ? "SÍ" : "NO"}</div>
        <div style={{ fontSize: 12, color: uciColor, marginTop: 6 }}>{uci ? "reservar cama UCI" : "sala general ok"}</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard() {
  const ocupadas = BEDS.filter(b => b.ocupada).length;
  const altoRiesgo = SAMPLE_DATA.filter(p => p.riesgo >= 0.75).length;
  const avgLos = (SAMPLE_DATA.reduce((a, p) => a + p.estancia, 0) / SAMPLE_DATA.length).toFixed(1);
  const vencidas = LISTA_ESPERA.filter(p => p.estado === "vencida").length;
  const criticos = LISTA_ESPERA.filter(p => p.estado === "critica" || p.estado === "alerta");
  const pacientesUCI = SAMPLE_DATA.filter(p => p.ocupacion === "UCI" && p.riesgo >= 0.75);

  const acciones = [
    ...LISTA_ESPERA.filter(p => p.estado === "vencida").sort((a, b) => b.diasEspera - a.diasEspera).map(p => ({
      nivel: "INCUMPLIMIENTO", color: "#ef4444",
      verbo: "Agendar", nombre: p.nombre,
      detalle: `${p.prestacion} — garantía vencida hace ${p.diasEspera - 120}d`,
    })),
    ...criticos.sort((a, b) => b.diasEspera - a.diasEspera).map(p => ({
      nivel: "EN RIESGO GES", color: "#f59e0b",
      verbo: "Priorizar", nombre: p.nombre,
      detalle: `${p.prestacion} — ${120 - p.diasEspera > 0 ? `${120 - p.diasEspera}d para vencer` : "próxima a vencer"}`,
    })),
    ...pacientesUCI.slice(0, 1).map(p => ({
      nivel: "UCI", color: "#f97316",
      verbo: "Evaluar", nombre: p.paciente,
      detalle: `${p.dx} · riesgo ${Math.round(p.riesgo * 100)}% · ${p.estancia}d de estancia`,
    })),
    { nivel: "INFO", color: "#6366f1", verbo: null, nombre: `${BEDS.filter(b => !b.ocupada).length} camas disponibles`, detalle: `${BEDS.filter(b => !b.ocupada && b.tipo === "UCI").length} UCI · ${BEDS.filter(b => !b.ocupada && b.tipo === "Coronaria").length} Coronaria · ${BEDS.filter(b => !b.ocupada && b.tipo === "General").length} General` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--bd)", borderRadius: 14, padding: "14px 18px", boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Pulse color="#ef4444" />
          <span style={{ fontSize: 10, letterSpacing: 2, color: "var(--t5)", textTransform: "uppercase", fontWeight: 600 }}>Próximas Acciones Prioritarias</span>
          <span style={{ marginLeft: "auto", fontSize: 9, letterSpacing: 1, color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>{acciones.filter(a => a.nivel === "INCUMPLIMIENTO").length} INCUMPLIMIENTOS GES</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {acciones.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10, background: a.color + "08", border: `1px solid ${a.color}20` }}>
              <span style={{ fontSize: 9, letterSpacing: 1.2, fontWeight: 700, color: a.color, background: a.color + "18", padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap", alignSelf: "flex-start", marginTop: 1 }}>{a.nivel}</span>
              <div>
                {a.verbo && <div style={{ fontSize: 9, color: a.color, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 1 }}>{a.verbo}</div>}
                <div style={{ fontSize: 13, color: "var(--t1)", fontWeight: 600, marginBottom: 2 }}>{a.nombre}</div>
                <div style={{ fontSize: 11, color: "var(--t5)" }}>{a.detalle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
        <KpiCard label="Camas Ocupadas" value={`${ocupadas}/${BEDS.length}`} sub="66% capacidad" accent="#6366f1" />
        <KpiCard label="Alta Complejidad" value={altoRiesgo} sub="score complejidad clínica" accent="#ef4444" />
        <KpiCard label="LOS Promedio" value={`${avgLos}d`} sub="estancia media" accent="#22c55e" />
        <KpiCard label="GES Vencidas" value={vencidas} sub="garantías incumplidas" accent="#f59e0b" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--bd)", borderRadius: 14, padding: 18, boxShadow: "var(--shadow)" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--t5)", marginBottom: 14, textTransform: "uppercase" }}>Mapa de Camas</div>
          <BedMap />
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            {[["#ef4444", "Alto"], ["#f59e0b", "Medio"], ["#22c55e", "Bajo"], ["var(--bd2)", "Libre"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "var(--t5)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block" }} />{l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--bd)", borderRadius: 14, padding: 18, boxShadow: "var(--shadow)" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--t5)", marginBottom: 14, textTransform: "uppercase" }}>LOS Histórico (días)</div>
          <BarChart />
          <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(99,102,241,0.08)", borderRadius: 8, border: "1px solid rgba(99,102,241,0.18)" }}>
            <span style={{ fontSize: 11, color: "#6366f1" }}>↑ +6% vs mes anterior — modelo predice 7.4d próxima semana</span>
          </div>
        </div>
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--bd)", borderRadius: 14, padding: 18, boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--t5)", textTransform: "uppercase" }}>Pacientes Activos — Score de Complejidad Clínica</div>
          <div style={{ fontSize: 9, color: "var(--t6)" }}>diagnóstico · edad · comorbilidades · unidad</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {SAMPLE_DATA.map(p => (
            <div key={p.id} data-row="1" style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 10, background: "var(--bg-row)", border: "1px solid var(--bd4)" }}>
              <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "var(--t5)", width: 52 }}>{p.paciente}</span>
              <span style={{ fontSize: 12, color: "var(--t3)", flex: 1 }}>{p.dx}</span>
              <span style={{ fontSize: 11, color: "var(--t5)" }}>{p.edad}a</span>
              <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "var(--t4)", width: 28 }}>{p.estancia}d</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 86 }}>
                <div style={{ flex: 1, height: 3, background: "var(--bd2)", borderRadius: 2 }}>
                  <div style={{ width: `${p.riesgo * 100}%`, height: "100%", borderRadius: 2, background: getRiskColor(p.riesgo) }} />
                </div>
                <span style={{ fontSize: 10, color: getRiskColor(p.riesgo), fontFamily: "'DM Mono', monospace", width: 28 }}>{Math.round(p.riesgo * 100)}%</span>
              </div>
              <span style={{ fontSize: 9, letterSpacing: 1.5, fontWeight: 700, color: getRiskColor(p.riesgo), background: getRiskColor(p.riesgo) + "18", padding: "2px 8px", borderRadius: 4 }}>{getRiskLabel(p.riesgo)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LISTA DE ESPERA ──────────────────────────────────────────────────────────
function ListaEspera() {
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [selected, setSelected] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const GES_LIMITE = 120;
  const getDiasRestantes = (p) => p.garantia === "GES" ? GES_LIMITE - p.diasEspera : null;
  const [exportMinsalLabel, triggerExportMinsal] = useExportFeedback("EXPORTAR PARA MINSAL →");

  const especialidades = ["Todos", ...Array.from(new Set(LISTA_ESPERA.map(p => p.especialidad)))];
  const filtrados = LISTA_ESPERA
    .filter(p => (filtro === "Todos" || p.especialidad === filtro) && (p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.rut.includes(busqueda)))
    .sort((a, b) => b.diasEspera - a.diasEspera);

  const vencidas = LISTA_ESPERA.filter(p => p.estado === "vencida").length;
  const enAlerta = LISTA_ESPERA.filter(p => p.estado === "alerta" || p.estado === "critica").length;
  const avgDias = Math.round(LISTA_ESPERA.reduce((a, p) => a + p.diasEspera, 0) / LISTA_ESPERA.length);
  const gesTotal = LISTA_ESPERA.filter(p => p.garantia === "GES").length;
  const gesEnPlazo = LISTA_ESPERA.filter(p => p.garantia === "GES" && p.estado !== "vencida").length;
  const cumplimientoGES = Math.round((gesEnPlazo / gesTotal) * 100);
  const vencenEstaSemana = LISTA_ESPERA.filter(p => p.garantia === "GES" && p.estado !== "vencida" && (120 - p.diasEspera) <= 7 && (120 - p.diasEspera) >= 0).length;

  async function analizarLista() {
    setLoadingAi(true); setAiAnalysis("");
    const resumen = LISTA_ESPERA.map(p => `${p.id}, ${p.edad}a, ${p.especialidad}, ${p.prestacion}, ${p.diasEspera} días, ${p.garantia}, ${p.estado}`).join("\n");
    const prompt = `Eres el sistema de análisis de listas de espera de un hospital público chileno. Analiza la siguiente lista y genera un informe ejecutivo para el director del hospital.\n\n${resumen}\n\nIncluye (texto plano, sin markdown):\n1. SITUACIÓN CRÍTICA: pacientes con garantías GES vencidas o en riesgo inmediato\n2. RIESGO REGULATORIO: exposición ante MINSAL/Superintendencia de Salud\n3. PRIORIZACIÓN RECOMENDADA: qué casos agendar esta semana\n4. ACCIÓN INMEDIATA: una medida concreta para reducir la exposición en 30 días\n\nTono directo y ejecutivo. Máximo 4 oraciones por punto.`;
    try {
      setAiAnalysis(await callClaude(prompt));
    } catch { setAiAnalysis("Error al conectar con el módulo de análisis."); }
    setLoadingAi(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
        <KpiCard label="Total en Espera" value={LISTA_ESPERA.length} sub="pacientes activos" accent="#6366f1" />
        <KpiCard label="GES Vencidas" value={vencidas} sub="incumplimiento legal" accent="#ef4444" />
        <KpiCard label="Cumplimiento GES" value={`${cumplimientoGES}%`} sub={`${gesEnPlazo} de ${gesTotal} garantías en plazo`} accent={cumplimientoGES >= 80 ? "#22c55e" : cumplimientoGES >= 50 ? "#f59e0b" : "#ef4444"} />
        <KpiCard label="Espera Promedio" value={`${avgDias}d`} sub={`${enAlerta} en riesgo GES`} accent="#22c55e" />
      </div>
      {vencenEstaSemana > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10 }}>
          <Pulse color="#ef4444" />
          <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 700 }}>{vencenEstaSemana} garantía{vencenEstaSemana > 1 ? "s" : ""} GES vence{vencenEstaSemana > 1 ? "n" : ""} esta semana</span>
          <span style={{ fontSize: 12, color: "var(--t5)" }}>— agendar con urgencia para evitar incumplimiento</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por nombre o RUT..." style={{ background: "var(--bg-input)", border: "1px solid var(--bd-in)", borderRadius: 8, padding: "9px 14px", color: "var(--t1)", fontSize: 13, outline: "none", width: 220 }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {especialidades.map(e => (
            <button key={e} onClick={() => setFiltro(e)} style={{ padding: "7px 12px", borderRadius: 8, fontSize: 11, cursor: "pointer", border: "1px solid", borderColor: filtro === e ? "#6366f1" : "var(--bd2)", background: filtro === e ? "rgba(99,102,241,0.15)" : "var(--bg-input)", color: filtro === e ? "#6366f1" : "var(--t5)" }}>{e}</button>
          ))}
        </div>
        <button onClick={analizarLista} disabled={loadingAi} style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: loadingAi ? "rgba(99,102,241,0.2)" : "linear-gradient(135deg, #6366f1, #4338ca)", border: "none", color: "#fff", cursor: loadingAi ? "not-allowed" : "pointer" }}>
          {loadingAi ? "Analizando..." : "Análisis IA →"}
        </button>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--bd)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 110px 80px 70px 110px 120px", padding: "10px 16px", borderBottom: "1px solid var(--bd3)", background: "var(--bg-row)" }}>
          {["ID", "Paciente / Prestación", "Especialidad", "Días espera", "Garantía", "Restantes GES", "Estado"].map(h => (
            <span key={h} style={{ fontSize: 10, letterSpacing: 1.5, color: "var(--t6)", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>
        {filtrados.map(p => {
          const restantes = getDiasRestantes(p);
          const restColor = restantes === null ? "var(--t5)" : restantes < 0 ? "#ef4444" : restantes < 30 ? "#f59e0b" : "#22c55e";
          return (
            <div key={p.id} data-row="1" onClick={() => setSelected(selected?.id === p.id ? null : p)} style={{ display: "grid", gridTemplateColumns: "80px 1fr 110px 80px 70px 110px 120px", padding: "11px 16px", borderBottom: "1px solid var(--bd4)", cursor: "pointer", background: selected?.id === p.id ? "rgba(99,102,241,0.07)" : "transparent", transition: "background 0.15s" }}>
              <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "var(--t5)", alignSelf: "center" }}>{p.id}</span>
              <div style={{ alignSelf: "center" }}>
                <div style={{ fontSize: 13, color: "var(--t2)" }}>{p.nombre}</div>
                <div style={{ fontSize: 11, color: "var(--t5)", marginTop: 2 }}>{p.prestacion} · {p.edad}a</div>
              </div>
              <span style={{ fontSize: 12, color: "var(--t4)", alignSelf: "center" }}>{p.especialidad}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5, alignSelf: "center" }}>
                <span style={{ fontSize: 14, fontFamily: "'DM Mono', monospace", color: p.diasEspera > 300 ? "#ef4444" : p.diasEspera > 100 ? "#f59e0b" : "var(--t2)", fontWeight: 600 }}>{p.diasEspera}</span>
                <span style={{ fontSize: 10, color: "var(--t5)" }}>d</span>
              </div>
              <span style={{ fontSize: 9, letterSpacing: 1, fontWeight: 700, alignSelf: "center", color: p.garantia === "GES" ? "#f59e0b" : "var(--t5)", background: p.garantia === "GES" ? "rgba(245,158,11,0.12)" : "transparent", padding: p.garantia === "GES" ? "2px 8px" : "0", borderRadius: 4 }}>{p.garantia}</span>
              <div style={{ alignSelf: "center" }}>
                {restantes !== null ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", color: restColor, fontWeight: 600 }}>
                      {restantes < 0 ? `+${Math.abs(restantes)}d` : `${restantes}d`}
                    </span>
                    <span style={{ fontSize: 9, color: restColor, letterSpacing: 0.5 }}>{restantes < 0 ? "vencida" : "restantes"}</span>
                  </div>
                ) : <span style={{ fontSize: 11, color: "var(--t6)" }}>—</span>}
              </div>
              <span style={{ fontSize: 9, letterSpacing: 1.2, fontWeight: 700, color: getEstadoColor(p.estado), background: getEstadoColor(p.estado) + "18", padding: "3px 8px", borderRadius: 4, alignSelf: "center", whiteSpace: "nowrap" }}>{getEstadoLabel(p.estado)}</span>
            </div>
          );
        })}
      </div>

      {selected && (
        <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#6366f1", marginBottom: 14, textTransform: "uppercase" }}>Detalle — {selected.nombre}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            {[["RUT", selected.rut], ["Fecha ingreso", selected.fechaIngreso], ["Días en espera", `${selected.diasEspera} días`], ["Garantía", selected.garantia], ["Especialidad", selected.especialidad], ["Prestación", selected.prestacion], ["Prioridad", `Nivel ${selected.prioridad}`], ["Estado", getEstadoLabel(selected.estado)]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: "var(--t5)", marginBottom: 3, letterSpacing: 1, textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontSize: 13, color: "var(--t2)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aiAnalysis && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--bd)", borderRadius: 14, padding: 20, boxShadow: "var(--shadow)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Pulse color="#6366f1" />
            <span style={{ fontSize: 10, letterSpacing: 2, color: "#6366f1", textTransform: "uppercase" }}>Informe Ejecutivo IA — Lista de Espera</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.8, margin: "0 0 16px", whiteSpace: "pre-wrap" }}>{aiAnalysis}</p>
          <button onClick={() => triggerExportMinsal(() => downloadText(aiAnalysis, "informe_lista_espera_MINSAL.txt"))} style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.3)", color: "#059669", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>{exportMinsalLabel}</button>
        </div>
      )}
    </div>
  );
}

// ─── PREDICCION ───────────────────────────────────────────────────────────────
function SearchSelect({ options, value, onChange }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  useEffect(() => { setQuery(value || ""); }, [value]);

  const filtered = query.trim()
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()) || o.cat.toLowerCase().includes(query.toLowerCase()))
    : options;
  const groups = filtered.reduce((acc, o) => { (acc[o.cat] = acc[o.cat] || []).push(o); return acc; }, {});

  return (
    <div style={{ position: "relative" }}>
      <input value={query} onChange={e => { setQuery(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Buscar diagnóstico..." style={{ width: "100%", background: "var(--bg-input)", border: "1px solid var(--bd-in)", borderRadius: 8, padding: "10px 14px", color: "var(--t1)", fontSize: 13, outline: "none" }} />
      {open && Object.keys(groups).length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "var(--bg-select)", border: "1px solid var(--bd-in)", borderRadius: 10, zIndex: 50, maxHeight: 260, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.14)" }}>
          {Object.entries(groups).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ fontSize: 9, letterSpacing: 1.5, color: "var(--t5)", padding: "7px 12px 3px", textTransform: "uppercase", background: "var(--bg-row)", borderBottom: "1px solid var(--bd4)" }}>{cat}</div>
              {items.map(o => (
                <div key={o.label} onMouseDown={() => { onChange(o.label); setQuery(o.label); setOpen(false); }}
                  style={{ padding: "9px 14px", cursor: "pointer", fontSize: 13, color: value === o.label ? "#6366f1" : "var(--t2)", background: value === o.label ? "rgba(99,102,241,0.08)" : "transparent", transition: "background 0.1s" }}>
                  {o.label}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const DX_CATALOG = [
  { label: "Neumonía bacteriana",      cat: "Respiratorio",   los: 7  },
  { label: "EPOC reagudizado",          cat: "Respiratorio",   los: 8  },
  { label: "Crisis asmática grave",     cat: "Respiratorio",   los: 3  },
  { label: "Derrame pleural",           cat: "Respiratorio",   los: 6  },
  { label: "Infarto agudo miocardio",   cat: "Cardiovascular", los: 5  },
  { label: "Insuficiencia cardíaca",    cat: "Cardiovascular", los: 10 },
  { label: "Arritmia grave",            cat: "Cardiovascular", los: 3  },
  { label: "ACV isquémico",             cat: "Neurológico",    los: 9  },
  { label: "ACV hemorrágico",           cat: "Neurológico",    los: 12 },
  { label: "Crisis epiléptica",         cat: "Neurológico",    los: 3  },
  { label: "Apendicitis aguda",         cat: "Digestivo",      los: 2  },
  { label: "Pancreatitis aguda",        cat: "Digestivo",      los: 6  },
  { label: "Hemorragia digestiva alta", cat: "Digestivo",      los: 5  },
  { label: "Colecistitis aguda",        cat: "Digestivo",      los: 4  },
  { label: "Sepsis",                    cat: "Infeccioso",     los: 12 },
  { label: "Pielonefritis aguda",       cat: "Infeccioso",     los: 4  },
  { label: "Celulitis complicada",      cat: "Infeccioso",     los: 5  },
  { label: "Diabetes descompensada",    cat: "Metabólico",     los: 4  },
  { label: "Insuficiencia renal aguda", cat: "Metabólico",     los: 6  },
  { label: "Fx. cadera",               cat: "Traumatología",  los: 12 },
  { label: "Fx. fémur",                cat: "Traumatología",  los: 9  },
  { label: "Fx. columna",              cat: "Traumatología",  los: 8  },
  { label: "Fx. pelvis",               cat: "Traumatología",  los: 10 },
  { label: "Fx. tibia/peroné",         cat: "Traumatología",  los: 5  },
  { label: "Fx. húmero proximal",      cat: "Traumatología",  los: 4  },
  { label: "Fx. radio distal",         cat: "Traumatología",  los: 2  },
];

function Prediccion() {
  const [form, setForm] = useState({ edad: "", dx: "Neumonía bacteriana", comorbilidades: 1, urgencia: "sí" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiNarrative, setAiNarrative] = useState("");
  const [showFactores, setShowFactores] = useState(false);
  const resultRef = useRef(null);

  async function predict() {
    if (!form.edad) return;
    setLoading(true); setAiNarrative("");
    await new Promise(r => setTimeout(r, 600));
    const base = Object.fromEntries(DX_CATALOG.map(d => [d.label, d.los]));
    const losBase = base[form.dx] ?? 6;
    const edadFactor = form.edad > 65 ? 1.4 : form.edad > 45 ? 1.15 : 1.0;
    const edadLabel = form.edad > 65 ? ">65 años" : form.edad > 45 ? "46-65 años" : "≤45 años";
    const comFactor = 1 + (form.comorbilidades * 0.12);
    const urgFactor = form.urgencia === "sí" ? 1.1 : 0.95;
    const los = (losBase * edadFactor * comFactor * urgFactor).toFixed(1);
    const riesgo = Math.min(0.97, (los / 15) * 0.85 + (form.comorbilidades * 0.012));
    setResult({ los, riesgo, uci: riesgo > 0.7, factores: { losBase, edadFactor, edadLabel, comFactor, urgFactor, dx: form.dx, coms: form.comorbilidades } });
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    const prompt = `Eres un sistema de análisis clínico predictivo. Genera una narrativa clínica concisa (máximo 4 oraciones) con recomendaciones operativas para el gestor hospitalario.\n\nPaciente: ${form.edad} años, diagnóstico: ${form.dx}, comorbilidades: ${form.comorbilidades}, ingreso urgente: ${form.urgencia}.\nPredicción: LOS = ${los} días, riesgo = ${Math.round(riesgo * 100)}%, UCI: ${riesgo > 0.7 ? "SÍ" : "NO"}.\n\nIncluye: interpretación clínica, recursos a reservar y alertas de gestión. Sé técnico y directo.`;
    try {
      setAiNarrative(await callClaude(prompt));
    } catch { setAiNarrative("Error al conectar con el módulo de análisis clínico."); }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--bd)", borderRadius: 14, padding: 20, boxShadow: "var(--shadow)" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--t5)", marginBottom: 16, textTransform: "uppercase" }}>Parámetros del Paciente</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: "var(--t5)", letterSpacing: 1 }}>EDAD</label>
            <input type="number" placeholder="ej. 68" value={form.edad} onChange={e => setForm({ ...form, edad: e.target.value })} style={{ background: "var(--bg-input)", border: "1px solid var(--bd-in)", borderRadius: 8, padding: "10px 14px", color: "var(--t1)", fontSize: 14, fontFamily: "'DM Mono', monospace", outline: "none" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: "var(--t5)", letterSpacing: 1 }}>DIAGNÓSTICO</label>
            <SearchSelect options={DX_CATALOG} value={form.dx} onChange={dx => setForm({ ...form, dx })} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: "var(--t5)", letterSpacing: 1 }}>COMORBILIDADES ({form.comorbilidades})</label>
            <input type="range" min={0} max={5} value={form.comorbilidades} onChange={e => setForm({ ...form, comorbilidades: +e.target.value })} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: "var(--t5)", letterSpacing: 1 }}>INGRESO URGENTE</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["sí", "no"].map(v => (
                <button key={v} onClick={() => setForm({ ...form, urgencia: v })} style={{ flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer", fontSize: 13, border: "1px solid", borderColor: form.urgencia === v ? "#6366f1" : "var(--bd-in)", background: form.urgencia === v ? "rgba(99,102,241,0.15)" : "var(--bg-input)", color: form.urgencia === v ? "#6366f1" : "var(--t5)" }}>{v.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={predict} disabled={loading || !form.edad} style={{ marginTop: 16, width: "100%", padding: "13px 0", borderRadius: 10, background: loading ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #4338ca)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", letterSpacing: 1 }}>
          {loading ? "ANALIZANDO..." : "CALCULAR PREDICCIÓN CLÍNICA"}
        </button>
      </div>
      {result && (
        <div ref={resultRef} style={{ background: "var(--bg-card)", border: "1px solid var(--bd)", borderRadius: 14, padding: 20, boxShadow: "var(--shadow)" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--t5)", marginBottom: 20, textTransform: "uppercase" }}>Resultado Predictivo</div>
          <RiskGauge riesgo={result.riesgo} los={result.los} uci={result.uci} />
          {result.factores && (
            <div style={{ marginTop: 16, borderRadius: 10, border: "1px solid var(--bd4)", overflow: "hidden" }}>
              <button onClick={() => setShowFactores(s => !s)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "var(--bg-row)", border: "none", cursor: "pointer", color: "var(--t5)" }}>
                <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>Factores del modelo</span>
                <span style={{ fontSize: 11 }}>{showFactores ? "▲ ocultar" : "▼ ver cálculo"}</span>
              </button>
              {showFactores && (
                <div style={{ padding: "12px 16px", background: "var(--bg-row)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    {[
                      [`LOS base (${result.factores.dx})`, `${result.factores.losBase}d`],
                      [`Factor edad (${result.factores.edadLabel})`, `×${result.factores.edadFactor}`],
                      [`Comorbilidades (${result.factores.coms})`, `×${result.factores.comFactor.toFixed(2)}`],
                      [`Ingreso urgente`, `×${result.factores.urgFactor}`],
                    ].map(([label, val]) => (
                      <div key={label} style={{ padding: "8px 10px", background: "var(--bg-card2)", borderRadius: 8, border: "1px solid var(--bd4)" }}>
                        <div style={{ fontSize: 10, color: "var(--t5)", marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 14, fontFamily: "'DM Mono', monospace", color: "#6366f1", fontWeight: 600 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 10, color: "var(--t6)", lineHeight: 1.5 }}>
                    Valores de referencia basados en estándares clínicos internacionales (GRD/DRG). Para calibración con datos propios del establecimiento, contactar al equipo Centinela.
                  </div>
                </div>
              )}
            </div>
          )}
          {aiNarrative && (
            <div style={{ padding: 16, background: "rgba(99,102,241,0.08)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.2)" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#6366f1", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Pulse color="#6366f1" /> ANÁLISIS CLÍNICO IA</div>
              <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.7, margin: 0 }}>{aiNarrative}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DATOS ────────────────────────────────────────────────────────────────────
function Datos() {
  const [dragOver, setDragOver] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [report, setReport] = useState("");
  const [fileName, setFileName] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [exportDatosLabel, triggerExportDatos] = useExportFeedback("EXPORTAR REPORTE EJECUTIVO →");

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer?.files[0] || e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
  }

  async function confirmarProcesar() {
    const file = pendingFile;
    setPendingFile(null);
    setFileName(file.name); setCleaning(true); setReport("");

    let fileContent = "";
    try {
      fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = ev => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsText(file, "UTF-8");
      });
      fileContent = fileContent.slice(0, 10000);
    } catch {
      fileContent = "(no se pudo leer el contenido del archivo)";
    }

    const prompt = `Eres un motor de limpieza y análisis de datos clínicos. Se subió "${file.name}" a una plataforma HealthTech.\n\nContenido del archivo (primeras filas):\n${fileContent}\n\nGenera un reporte de calidad con estos apartados (texto plano, sin markdown):\n\n1. RESUMEN DEL ARCHIVO: tipo, estructura real, columnas identificadas y cantidad de registros estimada\n2. PROBLEMAS DETECTADOS: valores nulos, outliers, inconsistencias (con ejemplos concretos del archivo)\n3. LIMPIEZA APLICADA: acciones automáticas ejecutadas sobre los datos reales\n4. CALIDAD FINAL: puntuación de 0 a 100, variables clave y recomendaciones de uso\n\nSé técnico y conciso. Máximo 4 oraciones por apartado.`;
    try {
      setReport(await callClaude(prompt));
    } catch { setReport("Error al procesar el análisis automático."); }
    setCleaning(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {pendingFile && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "var(--bg-panel)", border: "1px solid var(--bd2)", borderRadius: 16, padding: 28, maxWidth: 440, width: "90%" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--t1)", marginBottom: 10 }}>Aviso antes de procesar</div>
            <p style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.7, margin: "0 0 12px" }}>
              El contenido de <strong style={{ color: "var(--t1)" }}>{pendingFile.name}</strong> será enviado a <strong style={{ color: "var(--t1)" }}>Anthropic (API externa, EE.UU.)</strong> para su análisis.
            </p>
            <p style={{ fontSize: 12, color: "var(--t5)", lineHeight: 1.6, margin: "0 0 20px", padding: "10px 12px", background: "rgba(245,158,11,0.08)", borderRadius: 8, border: "1px solid rgba(245,158,11,0.2)" }}>
              Para cumplir con la <strong>Ley 19.628</strong> y <strong>Ley 20.584</strong>, asegúrese de que el archivo no contenga datos identificadores (RUT, nombre, dirección). Use solo variables clínicas agregadas o anonimizadas.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPendingFile(null)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: "var(--bg-input)", border: "1px solid var(--bd2)", color: "var(--t4)", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
              <button onClick={confirmarProcesar} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #4338ca)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Confirmar y procesar</button>
            </div>
          </div>
        </div>
      )}
      <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => document.getElementById("fi").click()} style={{ border: `2px dashed ${dragOver ? "#6366f1" : "var(--bd2)"}`, borderRadius: 14, padding: "44px 20px", textAlign: "center", background: dragOver ? "rgba(99,102,241,0.06)" : "var(--bg-input)", transition: "all 0.2s", cursor: "pointer" }}>
        <input id="fi" type="file" style={{ display: "none" }} onChange={handleDrop} />
        <div style={{ fontSize: 30, marginBottom: 10 }}>⬆</div>
        <div style={{ fontSize: 14, color: "var(--t4)" }}>Arrastra tu dataset clínico aquí</div>
        <div style={{ fontSize: 11, color: "var(--t5)", marginTop: 4 }}>CSV, XLSX, JSON — hasta 100MB · Los datos serán procesados externamente</div>
      </div>
      {(cleaning || report) && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--bd)", borderRadius: 14, padding: 20, boxShadow: "var(--shadow)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            {cleaning ? <><Pulse color="#6366f1" /><span style={{ fontSize: 10, letterSpacing: 2, color: "#6366f1", textTransform: "uppercase" }}>Limpiando datos automáticamente...</span></> : <span style={{ fontSize: 10, letterSpacing: 2, color: "var(--t5)", textTransform: "uppercase" }}>Reporte de Calidad — {fileName}</span>}
          </div>
          {report && (
            <>
              {report.split(/\n(?=\d\.)/).map((s, i) => (
                <div key={i} style={{ padding: 14, background: "var(--bg-row)", borderRadius: 10, border: "1px solid var(--bd4)", marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: "var(--t3)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{s}</p>
                </div>
              ))}
              <button onClick={() => triggerExportDatos(() => downloadText(report, `reporte_calidad_${fileName}.txt`))} style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.3)", color: "#059669", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>{exportDatosLabel}</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── REPORTES ─────────────────────────────────────────────────────────────────
function Reportes() {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState("");
  const [tipo, setTipo] = useState("Semanal");
  const [exportTxtLabel, triggerExportTxt] = useExportFeedback("EXPORTAR .TXT");

  async function generate() {
    setGenerating(true); setReport("");
    const prompt = `Eres el motor de reportes ejecutivos de una plataforma de gestión hospitalaria para Chile.\n\nGenera un reporte ejecutivo ${tipo}. Incluye (texto plano, sin markdown):\n- Resumen de indicadores clave (LOS, ocupación, readmisiones)\n- 2-3 hallazgos destacados del período\n- Alertas de riesgo operacional y regulatorio\n- Recomendaciones de gestión de recursos\n- Proyección para el siguiente período\n\nDatos de contexto: 66% ocupación, LOS promedio 6.2d, 3 pacientes alto riesgo UCI, 3 garantías GES vencidas. Tono ejecutivo y directo.`;
    try {
      setReport(await callClaude(prompt));
    } catch { setReport("Error al generar reporte."); }
    setGenerating(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--bd)", borderRadius: 14, padding: 20, boxShadow: "var(--shadow)" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--t5)", marginBottom: 14, textTransform: "uppercase" }}>Generador de Reportes Ejecutivos</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["Diario", "Semanal", "Mensual", "Ad-hoc"].map(t => (
            <button key={t} onClick={() => setTipo(t)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, cursor: "pointer", fontSize: 12, border: "1px solid", borderColor: tipo === t ? "#6366f1" : "var(--bd2)", background: tipo === t ? "rgba(99,102,241,0.15)" : "var(--bg-input)", color: tipo === t ? "#6366f1" : "var(--t5)" }}>{t}</button>
          ))}
        </div>
        <button onClick={generate} disabled={generating} style={{ width: "100%", padding: "12px 0", borderRadius: 10, background: generating ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #4338ca)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: generating ? "not-allowed" : "pointer", letterSpacing: 1 }}>
          {generating ? "GENERANDO CON IA..." : `GENERAR REPORTE ${tipo.toUpperCase()}`}
        </button>
      </div>
      {report && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--bd)", borderRadius: 14, padding: 20, boxShadow: "var(--shadow)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Pulse color="#22c55e" />
            <span style={{ fontSize: 10, letterSpacing: 2, color: "#16a34a", textTransform: "uppercase" }}>Reporte Listo</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.8, margin: "0 0 16px", whiteSpace: "pre-wrap" }}>{report}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => triggerExportTxt(() => downloadText(report, `reporte_${tipo.toLowerCase()}_centinela.txt`))} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.3)", color: "#059669", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>{exportTxtLabel}</button>
            <button onClick={() => { const sub = encodeURIComponent(`Reporte ${tipo} Centinela`); const body = encodeURIComponent(report); window.location.href = `mailto:?subject=${sub}&body=${body}`; }} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#6366f1", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>ENVIAR POR EMAIL</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin, darkMode, toggleDark }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleLogin(overrideEmail, overridePass) {
    const e = overrideEmail ?? email;
    const p = overridePass ?? password;
    if (!e || !p) { setError("Completa todos los campos."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 600));
    if (e === "director@hospital.cl" && p === "demo1234") {
      onLogin({ nombre: "Dr. Frankenstein", cargo: "Director Médico", hospital: "Hospital de Curicó" });
    } else {
      setError("Credenciales incorrectas. Usa el acceso demo indicado abajo.");
    }
    setLoading(false);
  }

  function loginDemo() {
    setEmail("director@hospital.cl");
    setPassword("demo1234");
    handleLogin("director@hospital.cl", "demo1234");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Panel izquierdo */}
      <div style={{ width: "44%", background: "var(--bg-panel)", borderRight: "1px solid var(--bd)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 52px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)", backgroundSize: "40px 40px", animation: "gridScroll 10s linear infinite" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 72 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #4338ca)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⬡</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--t1)" }}>Centinela</div>
                <div style={{ fontSize: 9, color: "var(--t6)", letterSpacing: 2 }}>GESTIÓN PREDICTIVA HOSPITALARIA</div>
              </div>
            </div>
            <button onClick={toggleDark} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, cursor: "pointer", border: "1px solid var(--bd2)", background: "var(--bg-input)", color: "var(--t5)" }}>
              {darkMode ? "Modo claro" : "Modo oscuro"}
            </button>
          </div>
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#6366f1", marginBottom: 14, textTransform: "uppercase" }}>Gestión hospitalaria inteligente</div>
            <h1 style={{ fontSize: 36, fontWeight: 600, color: "var(--t1)", lineHeight: 1.2, margin: "0 0 18px", letterSpacing: -0.8 }}>
              Decisiones clínicas.<br />
              <span style={{ color: "#6366f1" }}>Respaldadas por datos.</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--t5)", lineHeight: 1.7, maxWidth: 320 }}>
              Predicción de estancias, gestión de listas de espera GES y reportes ejecutivos automatizados en una sola plataforma.
            </p>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[[`${Math.max(...LISTA_ESPERA.map(p => p.diasEspera))}d`, "espera máxima activa"], [`${LISTA_ESPERA.filter(p => p.estado === "vencida").length}/${LISTA_ESPERA.length}`, "garantías GES vencidas"], ["GES", "monitoreo en tiempo real"]].map(([v, l]) => (
              <div key={l} style={{ padding: "14px 14px", background: "var(--bg-card)", borderRadius: 10, border: "1px solid var(--bd)" }}>
                <div style={{ fontSize: 17, fontFamily: "'DM Mono', monospace", color: "#6366f1", fontWeight: 500 }}>{v}</div>
                <div style={{ fontSize: 10, color: "var(--t6)", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 14px", background: "rgba(99,102,241,0.06)", borderRadius: 8, border: "1px solid rgba(99,102,241,0.12)" }}>
            <div style={{ fontSize: 10, color: "var(--t5)", fontWeight: 600, marginBottom: 4 }}>🔒 Aviso de Privacidad</div>
            <div style={{ fontSize: 10, color: "var(--t6)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--t5)" }}>Demo:</strong> todos los datos son ficticios y no corresponden a pacientes reales.<br />
              <strong style={{ color: "var(--t5)" }}>Producción:</strong> Predicción y Reportes no envían datos identificadores. Lista de Espera usa solo IDs clínicos. El módulo Datos requiere anonimización previa por parte del operador (Ley 19.628 · Ley 20.584).<br />
              Las consultas IA se procesan vía API externa (Anthropic, EE.UU.).
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 64px" }}>
        <div style={{ width: "100%", maxWidth: 380, animation: "fadeUp 0.6s ease forwards" }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: "var(--t1)", margin: "0 0 8px", letterSpacing: -0.5 }}>Iniciar sesión</h2>
          <p style={{ fontSize: 13, color: "var(--t5)", margin: "0 0 32px" }}>Acceso exclusivo para gestores y directivos clínicos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 10, letterSpacing: 1.5, color: "var(--t5)", textTransform: "uppercase" }}>Correo institucional</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="director@hospital.cl" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ background: "var(--bg-input)", border: "1px solid var(--bd-in)", borderRadius: 10, padding: "13px 16px", color: "var(--t1)", fontSize: 14, outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 10, letterSpacing: 1.5, color: "var(--t5)", textTransform: "uppercase" }}>Contraseña</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", background: "var(--bg-input)", border: "1px solid var(--bd-in)", borderRadius: 10, padding: "13px 50px 13px 16px", color: "var(--t1)", fontSize: 14, outline: "none" }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--t5)", cursor: "pointer", fontSize: 12 }}>{showPass ? "ocultar" : "ver"}</button>
              </div>
            </div>
            {error && <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, fontSize: 12, color: "#ef4444" }}>{error}</div>}
            <button onClick={loginDemo} disabled={loading} style={{ padding: "13px 0", borderRadius: 10, fontSize: 14, fontWeight: 600, letterSpacing: 0.5, background: loading ? "rgba(99,102,241,0.35)" : "linear-gradient(135deg, #6366f1, #4338ca)", border: "none", color: "#fff", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Verificando acceso..." : "Acceso demo →"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: "var(--bd2)" }} />
              <span style={{ fontSize: 11, color: "var(--t6)" }}>o ingresa manualmente</span>
              <div style={{ flex: 1, height: 1, background: "var(--bd2)" }} />
            </div>
            <button onClick={() => handleLogin()} disabled={loading} style={{ padding: "12px 0", borderRadius: 10, fontSize: 13, fontWeight: 500, background: "transparent", border: "1px solid var(--bd2)", color: "var(--t4)", cursor: loading ? "not-allowed" : "pointer" }}>
              Ingresar con credenciales
            </button>
            <div style={{ textAlign: "center", fontSize: 12, color: "var(--t6)" }}>
              ¿Problemas para acceder? <span style={{ color: "#6366f1", cursor: "pointer" }}>Contactar soporte</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.add("light");
  }, []);

  const toggleDark = () => setDarkMode(d => !d);
  const gesVencidas = LISTA_ESPERA.filter(p => p.estado === "vencida").length;
  const alertasTotal = LISTA_ESPERA.filter(p => p.estado === "vencida" || p.estado === "critica" || p.estado === "alerta").length + SAMPLE_DATA.filter(p => p.riesgo >= 0.75).length;

  if (!user) return (
    <>
      <style>{GLOBAL_STYLE}</style>
      <Login onLogin={setUser} darkMode={darkMode} toggleDark={toggleDark} />
    </>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--t1)" }}>
      <style>{GLOBAL_STYLE}</style>

      <div style={{ padding: "13px 24px", borderBottom: "1px solid var(--bd)", display: "flex", alignItems: "center", gap: 12, background: "var(--bg-card)" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #4338ca)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⬡</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3, color: "var(--t1)" }}>Centinela</div>
          <div style={{ fontSize: 9, color: "var(--t6)", letterSpacing: 2 }}>GESTIÓN PREDICTIVA HOSPITALARIA</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Pulse color="#22c55e" />
            <span style={{ fontSize: 10, color: "#22c55e", letterSpacing: 1 }}>EN LÍNEA</span>
          </div>
          {alertasTotal > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8 }}>
              <Pulse color="#ef4444" />
              <span style={{ fontSize: 10, color: "#ef4444", letterSpacing: 1, fontWeight: 700 }}>{alertasTotal} ALERTAS</span>
            </div>
          )}
          <button onClick={toggleDark} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, cursor: "pointer", border: "1px solid var(--bd2)", background: "var(--bg-input)", color: "var(--t5)" }}>
            {darkMode ? "Modo claro" : "Modo oscuro"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 14px", background: "var(--bg-input)", borderRadius: 8, border: "1px solid var(--bd2)" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #4338ca)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
              {user.nombre.split(" ").map(n => n[0]).filter((_, i) => i < 2).join("")}
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1 }}>{user.nombre}</div>
              <div style={{ fontSize: 10, color: "var(--t5)" }}>{user.hospital}</div>
            </div>
            <button onClick={() => setUser(null)} style={{ marginLeft: 4, background: "none", border: "1px solid var(--bd2)", borderRadius: 6, color: "var(--t5)", cursor: "pointer", fontSize: 11, padding: "3px 8px" }}>salir</button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid var(--bd)", padding: "0 24px", background: "var(--bg-card)" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer", background: "none", border: "none", borderBottom: `2px solid ${tab === i ? "#6366f1" : "transparent"}`, color: tab === i ? "#6366f1" : "var(--t5)", letterSpacing: 0.5, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
            {t}
            {t === "Lista de Espera" && gesVencidas > 0 && (
              <span style={{ fontSize: 9, background: "#ef4444", color: "#fff", borderRadius: 4, padding: "1px 6px", fontWeight: 700 }}>{gesVencidas}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === 0 && <Dashboard />}
        {tab === 1 && <ListaEspera />}
        {tab === 2 && <Prediccion />}
        {tab === 3 && <Reportes />}
        {tab === 4 && <Datos />}
      </div>

      <div style={{ borderTop: "1px solid var(--bd)", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <span style={{ fontSize: 10, color: "var(--t6)" }}>Centinela v0.9 — demo</span>
        <span style={{ fontSize: 10, color: "var(--bd2)" }}>|</span>
        <span style={{ fontSize: 10, color: "var(--t6)" }}>Integración HIS vía HL7/FHIR disponible en versión producción</span>
        <span style={{ fontSize: 10, color: "var(--bd2)" }}>|</span>
        <span style={{ fontSize: 10, color: "var(--t6)" }}>Datos anonimizados · Ley 19.628 · Ley 20.584</span>
      </div>
    </div>
  );
}
