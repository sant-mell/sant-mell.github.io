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

/* ------------------------------------------------ example data ---
   Drives the same engine through a realistic day via the real API
   (reset, complete a few routines, snooze one into an alert, call a
   grown-up once) so the report shows genuine, varied state instead
   of a freshly-reset all-zeros page. Same idea as the "Reiniciar
   demostración" button elsewhere — a demo action, not fake data. */
async function pressUntilHome(maxPresses) {
  for (let i = 0; i < maxPresses; i++) {
    const s = await api("/api/press", { button: "yes" });
    if (s.screen === "home") return s;
  }
}
async function completeRoutine(id) {
  await api("/api/trigger", { id });
  await pressUntilHome(10);
}
async function waitForScreen(screen, timeoutMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const s = await api("/api/state");
    if (s.screen === screen) return s;
    await new Promise((r) => setTimeout(r, 150));
  }
}
// "Later" only does anything from the "alert" screen — once snoozed, Rex
// waits out snooze.interval_s before asking again on his own. To rack up
// the 3 postponements that trigger the parent alert without actually
// waiting minutes in real time, fast-forward the demo clock between them.
async function snoozeRepeatedly(id, times) {
  await api("/api/trigger", { id });
  const prevSpeed = (await api("/api/state")).clock.speed;
  await api("/api/clock", { speed: 4000 });
  for (let i = 0; i < times; i++) {
    await api("/api/press", { button: "later" });
    if (i < times - 1) await waitForScreen("alert", 4000);
  }
  await api("/api/clock", { speed: prevSpeed });
}

async function loadExample() {
  const btn = $("#loadExampleBtn");
  btn.disabled = true;
  btn.textContent = "Cargando…";
  try {
    await api("/api/reset", {});
    await completeRoutine("brush_teeth_am");
    await completeRoutine("breakfast");
    await completeRoutine("bedtime");
    // shower_pm: postpone it 3 times instead of finishing it — this is what
    // generates the "se pospuso 3 veces" entry in Avisos importantes.
    await snoozeRepeatedly("shower_pm", 3);
    // a second, higher-urgency kind of avisos entry.
    await api("/api/grownup", {});
    await poll();
  } finally {
    btn.disabled = false;
    btn.textContent = "✨ Cargar ejemplo";
  }
}

async function init() {
  const data = await api("/api/routines");
  NEEDS = data.needs;
  $("#loadExampleBtn").addEventListener("click", loadExample);
  await loadExample();   // show a populated report right away, not all zeros
  setInterval(poll, 2000);
}
init();
