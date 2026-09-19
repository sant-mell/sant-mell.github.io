/* ============================================================
   Rex emulator front end.
   - Polls /api/state and renders the device + parent panel.
   - Sends button presses and parent-panel actions to the API.
   - Sprite slots load web/sprites/<file>; if the PNG is missing
     they fall back to a labeled placeholder (the "spaces for the
     sprites"). Filenames come straight from the engine, which
     mirrors documentation/rex_sprite_prompts.txt.
   ============================================================ */

const $ = (sel) => document.querySelector(sel);
const api = async (path, body) => {
  if (window.RexLocalAPI) return window.RexLocalAPI(path, body || null);   // static build
  const opt = body
    ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    : {};
  const r = await fetch(path, opt);
  return r.json();
};

let anyMissing = false;
const SVER = "4";   // bump to force browsers to refetch updated sprite PNGs

/* ===================================================================
   SENSORY CUES (GDD §3.3, §5.3): sound (WebAudio, no asset files) +
   vibration (CSS shake) + light (CSS pulse, handled in render()).
   =================================================================== */
let actx = null;
function audio() {
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (actx && actx.state === "suspended") actx.resume();
  return actx;
}
function tone(freq, dur, type = "sine", gain = 0.14, when = 0) {
  const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq; o.connect(g); g.connect(a.destination);
  const t = a.currentTime + when;
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t); o.stop(t + dur);
}
function noise(dur, gain = 0.18, when = 0) {
  const a = audio(); if (!a) return;
  const buf = a.createBuffer(1, Math.max(1, a.sampleRate * dur), a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
  const s = a.createBufferSource(); s.buffer = buf;
  const g = a.createGain(); g.gain.value = gain; s.connect(g); g.connect(a.destination);
  s.start(a.currentTime + when);
}
const stomp = (w = 0) => { tone(90, 0.14, "sine", 0.25, w); tone(58, 0.18, "triangle", 0.2, w + 0.005); };
const splash = (w = 0) => noise(0.34, 0.18, w);
const chime = (f, w = 0) => { tone(f, 0.18, "sine", 0.15, w); tone(f * 1.5, 0.15, "sine", 0.09, w + 0.02); };

// per-need cue: sound + which shake pattern (GDD §5.3 knock/stomp rhythms)
const CUE = {
  tummy:   { sound: () => { stomp(0); stomp(0.2); }, shake: "shake2" },
  sparkle: { sound: () => { chime(720, 0); chime(820, 0.12); chime(940, 0.24); }, shake: "shake3" },
  fresh:   { sound: () => { splash(0); }, shake: "shakeLong" },
  sleepy:  { sound: () => { tone(300, 0.5, "sine", 0.13, 0); }, shake: "shakeLong" },
  health:  { sound: () => { tone(520, 0.28, "sine", 0.13, 0); tone(520, 0.28, "sine", 0.13, 0.32); }, shake: "shake2" },
  custom:  { sound: () => { stomp(0); stomp(0.2); }, shake: "shake2" },
};
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function fireCue(needKey) {
  const c = CUE[needKey] || CUE.custom;
  try { c.sound(); } catch (e) {}
  if (reduceMotion) return;
  const wrap = document.querySelector(".toy-wrap"); if (!wrap) return;
  wrap.classList.remove("shake2", "shake3", "shakeLong"); void wrap.offsetWidth;
  wrap.classList.add(c.shake);
  setTimeout(() => wrap.classList.remove(c.shake), 900);
}
const celebrateSound = () => { chime(600, 0); chime(760, 0.12); chime(920, 0.24); };
const levelupSound = () => { chime(520, 0); chime(660, 0.12); chime(820, 0.24); chime(1040, 0.38); };

const CONFETTI_COLORS = ["#ffce2e", "#34c759", "#22c3dd", "#ff7aa2", "#8b5cf6", "#ff8a00"];
function burstConfetti(n = 40) {
  const fx = $("#fx"); if (!fx || reduceMotion) return;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.className = "confetti";
    p.style.left = Math.random() * 100 + "%";
    p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    p.style.animationDuration = (0.9 + Math.random() * 0.8) + "s";
    p.style.animationDelay = (Math.random() * 0.25) + "s";
    fx.appendChild(p);
    setTimeout(() => p.remove(), 2200);
  }
}
function levelupBanner(text) {
  const fx = $("#fx"); if (!fx) return;
  const b = document.createElement("div");
  b.className = "levelup-banner"; b.textContent = text;
  fx.appendChild(b);
  setTimeout(() => b.remove(), 4000);
}

let prevScreen = null;   // for one-shot cue transitions

/* Resolve a sprite slot: try the PNG, else show a dashed labeled box. */
function paintSprite(el, file) {
  if (!file) { el.hidden = true; return; }
  el.hidden = false;
  if (el.dataset.loaded === file) return;         // already correct
  el.dataset.sprite = file;
  const url = file.startsWith("data:") ? file : `sprites/${file}?v=${SVER}`;
  const img = new Image();
  img.onload = () => {
    el.classList.remove("placeholder");
    el.style.backgroundImage = `url("${url}")`;
    el.textContent = "";
    el.dataset.loaded = file;
  };
  img.onerror = () => {
    el.classList.add("placeholder");
    el.style.backgroundImage = "none";
    el.textContent = file;
    el.dataset.loaded = file;
    anyMissing = true;
    $("#missingBanner").hidden = false;
  };
  img.src = url;
}

/* -------------------------------------------------- rendering --- */
function render(s) {
  const device = $("#device");
  device.dataset.mood = s.mood;
  device.dataset.need = s.need ? s.need.key : "none";
  // light cue: pulse LED / bezel / buttons in the need colour while alerting
  device.dataset.alerting = (s.screen === "alert" || s.screen === "headsup") ? "1" : "";
  document.body.dataset.profile = s.profile.key;

  // one-shot cues on screen transitions (sound + vibration + confetti)
  if (s.screen !== prevScreen) {
    const need = s.need ? s.need.key : null;
    if ((s.screen === "alert" || s.screen === "headsup") && need) fireCue(need);
    else if (s.screen === "celebrate") { celebrateSound(); burstConfetti(24); }
    else if (s.screen === "levelup") {
      levelupSound(); burstConfetti(60);
      levelupBanner("¡SUBISTE DE NIVEL!");
    }
    prevScreen = s.screen;
  }

  // status row
  $("#clock").textContent = s.clock.time;
  $("#miniStars").textContent = s.stars;
  const sc = $("#starCount"); if (sc) sc.textContent = s.stars;
  $("#signal").classList.toggle("off", !s.ai.online);

  // Rex + need bubble
  paintSprite($("#rexSprite"), s.sprite);
  const needBubble = $("#needBubble");
  const showBubble = s.need && ["alert", "headsup", "task", "timer"].includes(s.screen);
  needBubble.hidden = !showBubble;
  if (showBubble) paintSprite(needBubble.querySelector(".need-icon"), s.need.icon);

  // accessory reward preview (GDD §7): flashes at Rex's feet on level-up
  const accBadge = $("#accessoryBadge");
  if (accBadge) {
    accBadge.hidden = !s.accessory;
    if (s.accessory) paintSprite(accBadge.querySelector(".accessory-icon"), s.accessory);
  }

  // message / step text
  const say = $("#say");
  const line = s.message || s.stepText;
  say.textContent = line ? (line[s.profile.language] || line.en) : "";

  // progress dots + timer
  const progress = $("#progress");
  if (s.step) {
    progress.hidden = false;
    const dots = $("#dots");
    dots.innerHTML = "";
    for (let i = 0; i < s.step.count; i++) {
      const d = document.createElement("span");
      if (i < s.step.index) d.className = "done";
      else if (i === s.step.index) d.className = "on";
      dots.appendChild(d);
    }
    const ring = $("#timerRing");
    if (s.timer) {
      ring.hidden = false;
      const off = 119 * (1 - s.timer.pct / 100);
      $("#timerFill").style.strokeDashoffset = off;
      const r = Math.max(0, Math.round(s.timer.remaining_s));
      $("#timerText").textContent = `${Math.floor(r / 60)}:${String(r % 60).padStart(2, "0")}`;
    } else ring.hidden = true;
  } else {
    progress.hidden = true;
  }

  // three buttons: lit/labels/suggestion
  renderButtons(s);

  // parent panel
  renderTimeline(s);
  renderAlerts(s.parentAlerts);
  syncControls(s);
}

function renderButtons(s) {
  const map = s.buttons || {};
  const suggest = s.screen === "alert" || s.screen === "task" || s.screen === "timer"
    ? "yes" : (s.screen === "celebrate" || s.screen === "headsup" ? "yes" : null);
  ["help", "yes", "later"].forEach((b) => {
    const el = document.querySelector(`.btn.${b}`);
    const label = map[b];
    const lit = !!label;
    el.classList.toggle("lit", lit);
    el.classList.toggle("suggest", lit && b === suggest);
    el.disabled = !lit;
    el.querySelector(".lbl").textContent = label || { help: "Ayuda", yes: "Sí", later: "Después" }[b];
  });
}

const NEED_COLOR = { tummy:"#ff8a00", sparkle:"#22c3dd", fresh:"#3b82f6", sleepy:"#8b5cf6", health:"#22c55e" };
const STATUS_LABEL = { done: "✅ hecho", pending: "⏳ pendiente", snoozed: "💤 después" };

function renderTimeline(s) {
  const ul = $("#timeline");
  ul.innerHTML = "";
  s.timeline.forEach((r) => {
    const li = document.createElement("li");
    if (!r.enabled) li.classList.add("disabled");
    const parent = r.confirmation === "parent";
    li.innerHTML = `
      <span class="t-time">${r.time}</span>
      <span class="t-dot" style="background:${NEED_COLOR[r.need] || "#94a3b8"}"></span>
      <span class="t-name">${r.name.es} ${parent ? "<small>· adulto</small>" : ""}</span>`;
    const right = document.createElement("span");
    if (r.enabled) {
      const st = document.createElement("span");
      st.className = "t-status st-" + r.status;
      st.textContent = STATUS_LABEL[r.status] || r.status;
      const btn = document.createElement("button");
      btn.className = "trigger";
      btn.textContent = "Probar";
      btn.title = "Activar ahora (demostración)";
      btn.onclick = () => api("/api/trigger", { id: r.id }).then(render);
      li.appendChild(st);
      li.appendChild(btn);
    } else {
      const btn = document.createElement("button");
      btn.className = "ghost";
      btn.textContent = "Activar";
      btn.onclick = () => api("/api/routine", { id: r.id, enabled: true }).then(render);
      li.appendChild(document.createElement("span"));
      li.appendChild(btn);
    }
    ul.appendChild(li);
  });
}

function renderAlerts(alerts) {
  const ul = $("#alerts");
  ul.innerHTML = "";
  if (!alerts.length) {
    ul.innerHTML = `<li class="empty">Sin avisos por ahora.</li>`;
    return;
  }
  alerts.forEach((a) => {
    const li = document.createElement("li");
    if (a.urgency === "high") li.classList.add("high");
    li.innerHTML = `${a.text} <span class="at">· ${a.at}</span>`;
    ul.appendChild(li);
  });
}

function syncControls(s) {
  $("#profiles").querySelectorAll("button").forEach((b) =>
    b.classList.toggle("on", b.dataset.profileKey === s.profile.key));
  $("#speeds").querySelectorAll("button").forEach((b) =>
    b.classList.toggle("on", Number(b.dataset.speed) === s.clock.speed));
  $("#aiToggle").checked = s.ai.enabled;
  $("#onlineToggle").checked = s.ai.online;
}

/* ---------------------------------------------------- wiring ---- */
/* press a button; if it opens the listening screen, start voice capture */
function doPress(button) {
  audio();   // unlock WebAudio on a user gesture
  return api("/api/press", { button }).then((s) => {
    render(s);
    if (button === "help" && s.screen === "help_listening") startSTT();
    return s;
  });
}

/* ---- Speech-to-text via the native Web Speech API (mock fallback) ---- */
let recognizing = false;
function startSTT() {
  if (recognizing) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { mockSTT(); return; }
  let rec;
  try { rec = new SR(); } catch (e) { mockSTT(); return; }
  rec.lang = "es-MX"; rec.interimResults = false; rec.maxAlternatives = 1;
  recognizing = true;
  let got = false;
  const to = setTimeout(() => { try { rec.stop(); } catch (e) {} }, 6000);
  rec.onresult = (e) => { got = true; onHeard(e.results[0][0].transcript); };
  rec.onerror = () => { if (!got) mockSTT(); };
  rec.onend = () => { clearTimeout(to); recognizing = false; if (!got) mockSTT(); };
  try { rec.start(); } catch (e) { recognizing = false; mockSTT(); }
}
function mockSTT() {   // no mic / permission denied: simulate a spoken phrase
  if (mockSTT.done) return; mockSTT.done = true; setTimeout(() => (mockSTT.done = false), 500);
  const phrases = ["¿cómo lavo mis dientes?", "no quiero", "me siento triste", "¿qué sigue?"];
  onHeard(phrases[Math.floor(Math.random() * phrases.length)]);
}
function onHeard(text) {
  const say = $("#say");
  if (say) say.textContent = "🗣️ " + text;     // show the transcript briefly
  setTimeout(() => api("/api/help_voice", { text }).then((s) => { render(s); speakReply(s); }), 900);
}

/* Speak Rex's reply out loud (Web Speech API) and hold the talking pose
   for as long as the utterance actually takes, so mouth/voice line up. */
function speakReply(s) {
  const line = s.message; if (!line) return;
  const text = line[s.profile.language] || line.en;
  if (!text || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();   // don't stack replies
    const u = new SpeechSynthesisUtterance(text);
    u.lang = s.profile.language === "es" ? "es-MX" : "en-US";
    u.rate = 0.95; u.pitch = 1.15;   // a touch higher/slower: friendly, easy to follow
    const device = $("#device");
    device.classList.add("rex-talking");
    u.onend = u.onerror = () => device.classList.remove("rex-talking");
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

function wire() {
  document.querySelectorAll(".btn").forEach((el) =>
    el.addEventListener("click", () => { if (!el.disabled) doPress(el.dataset.btn); }));

  document.addEventListener("keydown", (e) => {
    const key = { ArrowLeft: "help", " ": "yes", Enter: "yes", ArrowRight: "later" }[e.key];
    if (key) { e.preventDefault(); doPress(key); }
  });

  $("#profiles").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    api("/api/profile", { key: b.dataset.profileKey }).then(render);
  });
  $("#speeds").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    api("/api/clock", { speed: Number(b.dataset.speed) }).then(render);
  });
  $("#jumpBtn").addEventListener("click", () => api("/api/clock", { jump: true }).then(render));
  $("#aiToggle").addEventListener("change", (e) => api("/api/ai", { enabled: e.target.checked }).then(render));
  $("#onlineToggle").addEventListener("change", (e) => api("/api/ai", { online: e.target.checked }).then(render));
  $("#resetBtn").addEventListener("click", () => api("/api/reset", {}).then(render));

  // link to the full parent dashboard (add / manage tasks) — injected so it
  // survives the page's own restyle of the drawer markup.
  const tCard = $("#timeline") && $("#timeline").closest(".card");
  if (tCard && !tCard.querySelector(".manage-link")) {
    const a = document.createElement("a");
    a.className = "manage-link ghost";
    a.href = "parent.html";
    a.textContent = "＋ Agregar / administrar tareas";
    a.style.cssText = "display:inline-block;margin-top:10px;text-decoration:none;text-align:center;width:100%;";
    tCard.appendChild(a);
  }

  // parent drawer (hidden ⚙ menu)
  const openDrawer = () => { $("#drawer").hidden = false; $("#backdrop").hidden = false; };
  const closeDrawer = () => { $("#drawer").hidden = true; $("#backdrop").hidden = true; };
  $("#gearBtn").addEventListener("click", openDrawer);
  $("#closeDrawer").addEventListener("click", closeDrawer);
  $("#backdrop").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
}

/* ------------------------------------------ idle liveliness ---- */
/* Randomly alternates small fidgets (look around / blink / hop) on top of
   whatever mood animation is already playing, every 3-7s, so Rex reads as
   alive even when nothing is happening. Skipped while asleep or mid-speech. */
const FIDGETS = ["fidget-look", "fidget-blink", "fidget-hop"];
const FIDGET_MS = { "fidget-look": 600, "fidget-blink": 500, "fidget-hop": 500 };
function scheduleFidget() {
  const delay = 3000 + Math.random() * 4000;
  setTimeout(() => {
    const device = $("#device"), rex = $("#rexSprite");
    if (device && rex && device.dataset.mood !== "sleeping" && !device.classList.contains("rex-talking")) {
      const cls = FIDGETS[Math.floor(Math.random() * FIDGETS.length)];
      rex.classList.add(cls);
      setTimeout(() => rex.classList.remove(cls), FIDGET_MS[cls]);
    }
    scheduleFidget();
  }, delay);
}

/* ------------------------------------------------- main loop ---- */
async function poll() {
  try { render(await api("/api/state")); } catch (_) { /* server restarting */ }
}
wire();
poll();
setInterval(poll, 500);
scheduleFidget();
