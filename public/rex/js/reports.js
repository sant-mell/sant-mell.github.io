/* ============================================================
   Rex · Reports for caregivers. Read-only view of the same engine
   state the device and parent panel use: today's routine timeline,
   lifetime stars/stage, and the notable-events log (parent_alerts).
   No separate data store — same /api/state as everything else.
   ============================================================ */
const $ = (s) => document.querySelector(s);
const api = async (path, body) => {
  if (window.RexLocalAPI) return window.RexLocalAPI(path, body || null);   // static build
  const opt = body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {};
  return (await fetch(path, opt)).json();
};

const STATUS_LABEL = { done: "Hecho", pending: "Pendiente", snoozed: "Pospuesto" };
const URGENCY_LABEL = { high: "Importante", med: "Aviso" };

let NEEDS = {};

function renderSummary(s) {
  const total = s.timeline.length;
  const done = s.timeline.filter((r) => r.status === "done").length;
  $("#statDone").textContent = `${done}/${total}`;
  $("#statStars").textContent = s.stars;
  $("#statStage").textContent = s.stage.name;
  $("#clockNote").textContent = `Reloj de la demostración: ${s.clock.time} · perfil activo: ${s.profile.label.es}`;
}

function renderRoutines(s) {
  const ul = $("#routineList");
  $("#routineCount").textContent = `(${s.timeline.length})`;
  ul.innerHTML = "";
  if (!s.timeline.length) {
    ul.innerHTML = `<li class="empty">Sin rutinas configuradas todavía.</li>`;
    return;
  }
  s.timeline.forEach((r) => {
    const need = NEEDS[r.need];
    const li = document.createElement("li");
    li.className = "r-row";
    li.innerHTML = `
      <span class="ndot" style="background:${need ? need.color : "#94a3b8"}"></span>
      <span>
        <span class="r-name">${r.name.es || r.name.en}</span>
        <span class="r-time">${r.time}</span>
      </span>
      <span class="r-pill ${r.status}">${STATUS_LABEL[r.status] || r.status}</span>`;
    ul.appendChild(li);
  });
}

function renderAlerts(s) {
  const ul = $("#alertList");
  ul.innerHTML = "";
  if (!s.parentAlerts.length) {
    ul.innerHTML = `<li class="empty">Sin avisos por ahora — todo tranquilo.</li>`;
    return;
  }
  s.parentAlerts.forEach((a) => {
    const li = document.createElement("li");
    li.className = `r-row alert-${a.urgency}`;
    li.innerHTML = `
      <span class="r-alert-time">${a.at}</span>
      <span class="r-alert-text">${a.text}</span>
      <span class="r-pill urgency-${a.urgency}">${URGENCY_LABEL[a.urgency] || a.urgency}</span>`;
    ul.appendChild(li);
  });
}

async function poll() {
  try {
    const s = await api("/api/state");
    renderSummary(s);
    renderRoutines(s);
    renderAlerts(s);
  } catch (_) { /* server restarting */ }
}

async function init() {
  const data = await api("/api/routines");
  NEEDS = data.needs;
  poll();
  setInterval(poll, 2000);
}
init();
