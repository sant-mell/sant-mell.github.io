/* ============================================================
   Rex · Parent Dashboard — add / edit / delete tasks.
   Talks to the same engine as the device via /api/routines and
   /api/routine/{add,update,delete}. Built-in routines can be
   enabled/disabled; parent-created tasks are fully editable.
   ============================================================ */
const $ = (s) => document.querySelector(s);
const api = async (path, body) => {
  if (window.RexLocalAPI) return window.RexLocalAPI(path, body || null);   // static build
  const opt = body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {};
  return (await fetch(path, opt)).json();
};

// built-in step pictograms are keywords; show a friendly emoji for them
const PICTO_MAP = {
  toothbrush: "🪥", toothpaste: "🧴", brushing: "🦷", brush: "🦷", rinse: "💧",
  washhands: "🧼", table: "🍽️", eat: "🍎", water: "🥤", clothesoff: "👕",
  wateron: "🚿", soap: "🧼", towel: "🧺", pajamas: "🌙", bathroom: "🚽",
  lights: "💡", grownup: "🧑", medicine: "💊",
};
const pic = (p) => PICTO_MAP[p] || p;

const DAYS = [["mon", "L"], ["tue", "M"], ["wed", "M"], ["thu", "J"], ["fri", "V"], ["sat", "S"], ["sun", "D"]];
const DAY_FULL = { mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom" };
let NEEDS = {}, PICTOS = [], selectedNeed = "custom", editingId = "";
let stagedAnim = null;   // dataURL of a pending custom animation upload

/* ---------------------------------------------------- pickers --- */
function buildNeedPicker() {
  const box = $("#needPicker");
  box.innerHTML = "";
  Object.entries(NEEDS).forEach(([key, n]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "need-chip" + (key === selectedNeed ? " on" : "");
    b.style.setProperty("--c", n.color);
    b.innerHTML = `<span class="dot" style="background:${n.color}"></span>${n.label.es}`;
    b.onclick = () => { selectedNeed = key; buildNeedPicker(); };
    box.appendChild(b);
  });
}

function buildDaysPicker(active) {
  const box = $("#daysPicker");
  box.innerHTML = "";
  DAYS.forEach(([key, letter], i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "day-chip" + (active.includes(key) ? " on" : "");
    b.textContent = letter;
    b.dataset.day = key;
    b.title = DAY_FULL[key];
    b.onclick = () => b.classList.toggle("on");
    box.appendChild(b);
  });
}
const selectedDays = () => [...document.querySelectorAll(".day-chip.on")].map((b) => b.dataset.day);

/* --------------------------------------------------- steps ----- */
function pictoOptions(sel) {
  return PICTOS.map((p) => `<option value="${p}" ${p === sel ? "selected" : ""}>${p}</option>`).join("");
}
function addStepRow(step = {}) {
  const row = document.createElement("div");
  row.className = "step-row";
  row.innerHTML = `
    <select class="s-picto">${pictoOptions(step.pictogram || "⭐")}</select>
    <input class="s-text" type="text" maxlength="40" placeholder="Qué hacer (p. ej. Poner pasta)" value="${(step.en || "").replace(/"/g, "&quot;")}">
    <button type="button" class="del-step" title="Quitar paso">✕</button>`;
  row.querySelector(".del-step").onclick = () => row.remove();
  $("#steps").appendChild(row);
}
function collectSteps() {
  return [...document.querySelectorAll(".step-row")].map((r) => ({
    pictogram: r.querySelector(".s-picto").value,
    en: r.querySelector(".s-text").value.trim(),
  })).filter((s) => s.en);
}

/* --------------------------------------------------- form ------ */
function resetForm() {
  editingId = "";
  $("#editingId").value = "";
  $("#formTitle").textContent = "Agregar una tarea";
  $("#saveBtn").textContent = "Agregar tarea";
  $("#nameEn").value = "";
  $("#time").value = "09:00"; $("#headsUp").value = "5"; $("#reward").value = "1";
  $("#parentConfirm").checked = false; $("#notifyParent").checked = true;
  selectedNeed = "custom"; buildNeedPicker();
  buildDaysPicker(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);
  $("#steps").innerHTML = ""; addStepRow();
  $("#nameEn").removeAttribute("disabled");
  clearAnim();
  $("#formMsg").textContent = "";
}

function clearAnim() {
  stagedAnim = null;
  const f = $("#animFile"); if (f) f.value = "";
  const pv = $("#animPreview"); if (pv) { pv.hidden = true; pv.removeAttribute("src"); }
  const cl = $("#animClear"); if (cl) cl.hidden = true;
}
function showAnimPreview(src) {
  const pv = $("#animPreview"); if (pv) { pv.src = src; pv.hidden = false; }
  const cl = $("#animClear"); if (cl) cl.hidden = false;
}

function loadIntoForm(t) {
  editingId = t.id;
  $("#editingId").value = t.id;
  $("#formTitle").textContent = t.builtin ? "Tarea del sistema" : "Editar tarea";
  $("#saveBtn").textContent = "Guardar cambios";
  $("#nameEn").value = t.name.es || t.name.en;
  $("#time").value = t.time; $("#headsUp").value = t.heads_up_min;
  $("#reward").value = t.reward_stars;
  $("#parentConfirm").checked = t.confirmation === "parent";
  $("#notifyParent").checked = t.notify_parent;
  selectedNeed = t.need; buildNeedPicker();
  buildDaysPicker(t.days || []);
  $("#steps").innerHTML = "";
  (t.steps.length ? t.steps : [{}]).forEach(addStepRow);
  clearAnim();
  if (t.custom_sprite) showAnimPreview(t.custom_sprite.startsWith("data:") ? t.custom_sprite : "sprites/" + t.custom_sprite + "?v=" + Date.now());
  // Built-in routines: only enable/disable is editable, so lock the fields.
  const lock = t.builtin;
  ["nameEn", "time", "headsUp", "reward", "parentConfirm", "notifyParent"].forEach((id) => {
    $("#" + id).disabled = lock;
  });
  document.querySelectorAll(".need-chip, .day-chip, .step-row select, .step-row input, .del-step, #addStep")
    .forEach((el) => { el.disabled = lock; el.style.pointerEvents = lock ? "none" : ""; });
  $("#formMsg").textContent = lock ? "Las tareas del sistema se activan o desactivan en la lista, pero no se editan." : "";
  $("#formMsg").className = "form-msg";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function submitForm(e) {
  e.preventDefault();
  const name = $("#nameEn").value.trim();
  if (!name) return;
  const payload = {
    id: editingId || undefined,
    name_en: name,
    need: selectedNeed, time: $("#time").value,
    days: selectedDays(),
    heads_up_min: Number($("#headsUp").value) || 0,
    reward_stars: Number($("#reward").value) || 1,
    parent_confirm: $("#parentConfirm").checked,
    notify_parent: $("#notifyParent").checked,
    steps: collectSteps(),
    enabled: true,
  };
  const path = editingId ? "/api/routine/update" : "/api/routine/add";
  const res = await api(path, payload);
  if (res.ok) {
    const targetId = editingId || res.id;
    if (stagedAnim && targetId) {
      const up = await api("/api/routine/upload_sprite", { id: targetId, dataurl: stagedAnim });
      if (up.routines) res.routines = up.routines;
    }
    const msg = $("#formMsg");
    msg.textContent = editingId ? "✓ Tarea guardada." : `✓ "${name}" agregada — Rex la recordará.`;
    msg.className = "form-msg ok";
    renderList(res.routines);
    resetForm();
  }
}

/* --------------------------------------------------- list ------ */
function renderList(routines) {
  const ul = $("#taskList");
  $("#taskCount").textContent = `(${routines.length})`;
  ul.innerHTML = "";
  if (!routines.length) { ul.innerHTML = `<li class="empty">Aún no hay tareas. ¡Agrega una a la izquierda!</li>`; return; }
  routines.forEach((t) => {
    const n = NEEDS[t.need] || { color: "#999" };
    const days = (t.days && t.days.length === 7) ? "Todos los días" : (t.days || []).map((d) => DAY_FULL[d]).join(" ");
    const li = document.createElement("li");
    li.className = "task-item" + (t.enabled ? "" : " off");
    li.innerHTML = `
      <span class="task-time">${t.time}</span>
      <div class="task-main">
        <div class="task-name">
          <span class="ndot" style="background:${n.color}"></span>${t.name.es || t.name.en}
          ${t.builtin ? '<span class="tag">sistema</span>' : ""}
          ${t.confirmation === "parent" ? '<span class="tag">adulto</span>' : ""}
          ${t.custom_sprite ? '<span class="task-anim" title="Tiene animación personalizada">🎬</span>' : ""}
        </div>
        <div class="task-meta">${days} · ⭐${t.reward_stars} · ${t.steps.length} paso${t.steps.length === 1 ? "" : "s"}</div>
        <div class="task-steps">${t.steps.map((s) => pic(s.pictogram)).join(" ")}</div>
      </div>`;
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const sw = document.createElement("label");
    sw.className = "switch"; sw.title = t.enabled ? "Activa" : "Inactiva";
    sw.innerHTML = `<input type="checkbox" ${t.enabled ? "checked" : ""}><span class="slider"></span>`;
    sw.querySelector("input").onchange = (e) =>
      api("/api/routine", { id: t.id, enabled: e.target.checked }).then((r) => renderList(r.routines || routines));

    const edit = document.createElement("button");
    edit.className = "icon-btn"; edit.title = "Editar"; edit.textContent = "✏️";
    edit.onclick = () => loadIntoForm(t);

    const del = document.createElement("button");
    del.className = "icon-btn del"; del.title = t.builtin ? "Las tareas del sistema no se pueden eliminar" : "Eliminar"; del.textContent = "🗑";
    del.disabled = t.builtin;
    del.onclick = () => {
      if (confirm(`¿Eliminar "${t.name.es || t.name.en}"?`))
        api("/api/routine/delete", { id: t.id }).then((r) => { renderList(r.routines); if (editingId === t.id) resetForm(); });
    };

    actions.append(sw, edit, del);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

/* --------------------------------------------------- init ------ */
async function init() {
  const data = await api("/api/routines");
  NEEDS = data.needs; PICTOS = data.pictograms;
  resetForm();
  renderList(data.routines);
  $("#taskForm").addEventListener("submit", submitForm);
  $("#addStep").addEventListener("click", () => addStepRow());
  $("#clearBtn").addEventListener("click", resetForm);
  $("#animClear").addEventListener("click", clearAnim);
  $("#animFile").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { alert("La imagen es muy grande (máx 4MB)."); e.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => { stagedAnim = reader.result; showAnimPreview(reader.result); };
    reader.readAsDataURL(file);
  });
}
init();
