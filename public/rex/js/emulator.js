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
const SVER = "5";   // bump to force browsers to refetch updated sprite PNGs

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
/* Each need has its own stomp rhythm (GDD §5.3). `buzz` plays that same
   rhythm on the phone's real vibration motor as [on, off, on, ...] ms, so a
   child holding the device feels the reminder even without looking or
   hearing it — on the real hardware this is the vibration motor. */
const CUE = {
  tummy:   { sound: () => { stomp(0); stomp(0.2); }, shake: "shake2",
             buzz: [130, 90, 130] },                                  // stomp-stomp
  sparkle: { sound: () => { chime(720, 0); chime(820, 0.12); chime(940, 0.24); }, shake: "shake3",
             buzz: [90, 70, 90, 70, 90] },                            // stomp-stomp-stomp
  fresh:   { sound: () => { splash(0); }, shake: "shakeLong",
             buzz: [420] },                                           // splaaash
  sleepy:  { sound: () => { tone(300, 0.5, "sine", 0.13, 0); }, shake: "shakeLong",
             buzz: [110, 300, 110] },                                 // stomp... stomp...
  health:  { sound: () => { tone(520, 0.28, "sine", 0.13, 0); tone(520, 0.28, "sine", 0.13, 0.32); }, shake: "shake2",
             buzz: [220, 120, 220] },                                 // stomp-stomp (long)
  custom:  { sound: () => { stomp(0); stomp(0.2); }, shake: "shake2",
             buzz: [130, 90, 130] },
};
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Real haptics. Browsers ignore this until the page has been interacted with,
   and iOS Safari has no Vibration API at all, so it must never be the only
   channel — sound and the on-screen shake always play too. */
let buzzOn = localStorage.getItem("rexBuzz") !== "off";
let userTapped = false;
["pointerdown", "keydown", "touchstart"].forEach((ev) =>
  addEventListener(ev, () => { userTapped = true; }, { once: true, passive: true }));

function buzz(pattern) {
  if (!buzzOn || !pattern) return;
  if (!("vibrate" in navigator)) return;
  // Browsers reject (and log) vibration before the page has been tapped.
  if (!userTapped) return;
  // Low-stim profile is a request for gentler input, so halve the durations.
  const p = document.body.dataset.profile === "low_stim"
    ? pattern.map((ms, i) => (i % 2 === 0 ? Math.round(ms * 0.5) : ms))
    : pattern;
  try { navigator.vibrate(p); } catch (e) {}
}

function fireCue(needKey) {
  const c = CUE[needKey] || CUE.custom;
  try { c.sound(); } catch (e) {}
  buzz(c.buzz);                       // haptics are not screen motion, so this
                                      // runs even under prefers-reduced-motion
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

/* Resolve a sprite slot: try the PNG, fall back to Rex's idle pose, and only
   show the dashed labeled box if even that is missing. A routine step whose
   art hasn't been drawn yet should still show a dinosaur, not a broken box. */
const SPRITE_FALLBACK = "rex_kid_idle.png";
function paintSprite(el, file, isFallback) {
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
    if (!isFallback && el.classList.contains("rex") && file !== SPRITE_FALLBACK) {
      paintSprite(el, SPRITE_FALLBACK, true);     // missing pose: still a dino
      return;
    }
    el.classList.add("placeholder");
    el.style.backgroundImage = "none";
    el.textContent = file;
    el.dataset.loaded = file;
    anyMissing = true;
    $("#missingBanner").hidden = false;
  };
  img.src = url;
}

/* =====================================================================
   FRAME ANIMATION (GDD §5: Rex is never a still picture)
   The art sheets ship several drawn frames per action, so any pose with a
   frame set below is played as a loop instead of a single static PNG.
   ===================================================================== */
const FRAME_SETS = {
  "rex_kid_brush.png":   { frames: ["rex_kid_brush.png", "rex_kid_brush2.png",
                                    "rex_kid_brush3.png", "rex_kid_brush4.png"], ms: 360 },
  // No frame set for the celebrate/proud poses on purpose: they're the only
  // art holding the reward star, and the cheer pose has none, so alternating
  // them yanked the star away at the exact moment the child earned it. The
  // celebration is carried by the confetti burst and the CSS bounce instead.
  "rex_kid_listen.png":    { frames: ["rex_kid_listen.png", "rex_kid_listen2.png"], ms: 480 },
  "rex_kid_wave.png":      { frames: ["rex_kid_wave.png", "rex_kid_wave2.png"], ms: 400 },
  "rex_kid_idle_hc.png":   { frames: ["rex_kid_idle_hc.png", "rex_kid_idle_hc2.png",
                                      "rex_kid_idle_hc3.png", "rex_kid_idle_hc4.png"], ms: 620 },
  "rex_kid_eat.png":      { frames: ["rex_kid_eat.png", "rex_kid_eat2.png",
                                     "rex_kid_eat3.png", "rex_kid_eat4.png"], ms: 420 },
  "rex_kid_bath.png":     { frames: ["rex_kid_bath.png", "rex_kid_bath2.png",
                                     "rex_kid_bath3.png", "rex_kid_bath4.png"], ms: 420 },
  "rex_kid_bedtime.png":  { frames: ["rex_kid_bedtime.png", "rex_kid_bedtime2.png",
                                     "rex_kid_bedtime3.png", "rex_kid_bedtime4.png"], ms: 480 },
  "rex_kid_medicine.png": { frames: ["rex_kid_medicine.png", "rex_kid_medicine2.png"], ms: 700 },
  "rex_kid_washhands.png": { frames: ["rex_kid_washhands.png", "rex_kid_washhands2.png",
                                       "rex_kid_washhands3.png", "rex_kid_washhands4.png"], ms: 380 },
  "rex_kid_drink.png":     { frames: ["rex_kid_drink.png", "rex_kid_drink2.png"], ms: 650 },
  "rex_kid_pajamas.png":   { frames: ["rex_kid_pajamas.png", "rex_kid_pajamas2.png"], ms: 650 },
  "rex_kid_sleepy.png":    { frames: ["rex_kid_sleepy.png", "rex_kid_sleepy2.png",
                                      "rex_kid_sleepy3.png", "rex_kid_sleepy4.png"], ms: 450 },
  "rex_kid_sleeping.png":  { frames: ["rex_kid_sleeping.png", "rex_kid_sleeping2.png"], ms: 900 },
  "rex_kid_alert_tummy.png":  { frames: ["rex_kid_alert_tummy.png", "rex_kid_alert_tummy2.png"], ms: 650 },
  "rex_kid_alert_sleepy.png": { frames: ["rex_kid_alert_sleepy.png", "rex_kid_alert_sleepy2.png"], ms: 650 },
  "rex_kid_wakeup.png": { frames: ["rex_kid_wakeup.png", "rex_kid_wakeup2.png",
                                    "rex_kid_wakeup3.png", "rex_kid_wakeup4.png"], ms: 450 },
};

let animBase = null, animSet = null, animIdx = 0, animNext = 0, fidgetUntil = 0;

/* Everything that draws Rex goes through here so the animator stays in
   charge of the slot; render() must never paint him directly. */
function setRexSprite(base) {
  if (base === animBase) return;          // unchanged — any running fidget continues
  fidgetUntil = 0;                        // a real state change outranks a fidget
  animBase = base;
  animSet = FRAME_SETS[base] || null;
  animIdx = 0;
  animNext = performance.now() + (animSet ? animSet.ms : 0);
  paintSprite($("#rexSprite"), animSet ? animSet.frames[0] : base);
}

function animTick() {
  const now = performance.now();
  if (fidgetUntil) {
    if (now < fidgetUntil) return;
    fidgetUntil = 0;                              // fidget over: back to the pose
    paintSprite($("#rexSprite"), animSet ? animSet.frames[animIdx] : animBase);
    return;
  }
  if (!animSet || now < animNext) return;
  animIdx = (animIdx + 1) % animSet.frames.length;
  animNext = now + animSet.ms;
  paintSprite($("#rexSprite"), animSet.frames[animIdx]);
}
setInterval(animTick, 90);

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
    else if (s.screen === "celebrate") { celebrateSound(); burstConfetti(24); buzz([90, 60, 90]); }
    else if (s.screen === "levelup") {
      levelupSound(); burstConfetti(60); buzz([80, 60, 80, 60, 80, 60, 260]);
      levelupBanner("¡SUBISTE DE NIVEL!");
    }
    prevScreen = s.screen;
  }

  // cave background: only the resting home/night screens get the cave scene
  // behind Rex — every other screen keeps the flat mood-color gradient so
  // that accessibility-critical color coding is never fighting a picture
  const caveBg = $("#caveBg");
  if (caveBg) paintSprite(caveBg, ["home", "night"].includes(s.screen) ? `bg_cave_${s.screen}.png` : null);

  // status row
  $("#clock").textContent = s.clock.time;
  $("#miniStars").textContent = s.stars;
  const sc = $("#starCount"); if (sc) sc.textContent = s.stars;
  $("#signal").classList.toggle("off", !s.ai.online);

  // listening overlay: only while Rex is actually listening for the child's
  // voice (help_listening), same badge pattern as the need bubble
  const listenBadge = $("#listenBadge");
  if (listenBadge) listenBadge.hidden = s.screen !== "help_listening";

  // Rex + need bubble
  setRexSprite(s.sprite);
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

  // message / step text — but not while onHeard() is holding the "what Rex
  // heard" transcript on screen: the poll loop runs every 500ms regardless,
  // and would otherwise stomp that text with the server's current message
  // well before there was time to read it.
  const say = $("#say");
  if (performance.now() >= transcriptUntil) {
    const line = s.message || s.stepText;
    say.textContent = line ? (line[s.profile.language] || line.en) : "";

    // read it out loud: the child this is built for may not read yet, so
    // every new prompt/step is spoken once (deduped by lastSpoken below).
    if (line && voiceOn && SPOKEN_SCREENS.includes(s.screen))
      speakReply({ message: line, profile: s.profile, screen: s.screen });
  }

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
/* Browsers only allow speech after a real user gesture; the first button
   press warms the synth up with an empty utterance so the first real line
   isn't swallowed. */
let speechUnlocked = false;
function unlockSpeech() {
  if (speechUnlocked || !synth) return;
  speechUnlocked = true;
  try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; synth.speak(u); } catch (e) {}
  loadVoices();
}

/* press a button; if it opens the listening screen, start voice capture */
function doPress(button) {
  audio();   // unlock WebAudio on a user gesture
  unlockSpeech();
  return api("/api/press", { button }).then((s) => {
    render(s);
    if (button === "help" && s.screen === "help_listening") startSTT();
    return s;
  });
}

/* ---- Speech-to-text via the native Web Speech API (mock fallback) ---- */
let recognizing = false;
let transcriptUntil = 0;   // performance.now() deadline; see render()'s say-text guard
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
  // Give the caregiver/child time to actually read the question before it's
  // replaced by Rex's reply — scales with length so a longer phrase isn't
  // cut off, with a floor long enough for the shortest ones ("no quiero").
  // transcriptUntil also tells render()'s poll-driven update (every 500ms)
  // to leave this text alone until the deadline passes.
  const readMs = Math.max(2200, text.length * 110);
  transcriptUntil = performance.now() + readMs;
  if (say) say.textContent = "🗣️ " + text;     // show what Rex heard
  setTimeout(() => api("/api/help_voice", { text }).then((s) => { render(s); speakReply(s); }), readMs);
}

/* ------------------------------------------------ text-to-speech ---
   Rex reads his line out loud. Children who can't read yet are the whole
   point of the device, so this is a feature, not a nicety. Chrome needs
   three workarounds: voices load async, an utterance that isn't referenced
   somewhere gets garbage-collected mid-sentence, and a long utterance gets
   silently paused unless it's nudged. */
const synth = window.speechSynthesis || null;
const SPOKEN_SCREENS = ["headsup", "alert", "task", "timer", "celebrate", "levelup",
                        "help_reply", "help_listening", "snoozed", "night"];
let voiceOn = localStorage.getItem("rexVoice") !== "off";
let voices = [];
let liveUtterance = null;        // GC guard: Chrome drops unreferenced utterances
let speakWatchdog = null;
let lastSpoken = "";

function loadVoices() { try { voices = synth ? synth.getVoices() || [] : []; } catch (e) { voices = []; } }
if (synth) {
  loadVoices();
  synth.addEventListener ? synth.addEventListener("voiceschanged", loadVoices)
                         : (synth.onvoiceschanged = loadVoices);
}

function pickVoice(lang) {
  if (!voices.length) loadVoices();
  const want = lang === "es" ? "es" : "en";
  return voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(want + "-"))
      || voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(want))
      || null;
}

function stopTalking() {
  clearTimeout(speakWatchdog); speakWatchdog = null;
  const device = $("#device"); if (device) device.classList.remove("rex-talking");
}

function speak(text, lang, talkPose) {
  if (!synth || !text) return;
  try {
    if (synth.speaking || synth.pending) synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    liveUtterance = u;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.lang = lang === "es" ? "es-MX" : "en-US";
    u.rate = 0.95; u.pitch = 1.15;   // slightly higher and slower: friendly, easy to follow
    const device = $("#device");
    // Only force the talking pose when Rex is actually holding a conversation;
    // during a routine step his own step art must stay on screen.
    if (device && talkPose) device.classList.add("rex-talking");
    u.onend = u.onerror = stopTalking;
    // Never let a failed/ignored utterance freeze Rex in the talking pose:
    // fall back on a rough reading-time estimate.
    clearTimeout(speakWatchdog);
    speakWatchdog = setTimeout(stopTalking, 1200 + text.length * 90);
    // Chrome pauses long utterances unless nudged right after speak().
    synth.speak(u);
    setTimeout(() => { try { if (synth.paused) synth.resume(); } catch (e) {} }, 120);
  } catch (e) { stopTalking(); }
}

/* Speak whatever Rex is currently saying, once per new line. */
function speakReply(s) {
  const line = s && s.message; if (!line) return;
  const lang = (s.profile && s.profile.language) || "es";
  const text = line[lang] || line.en;
  if (!text || text === lastSpoken) return;
  lastSpoken = text;
  speak(text, lang, String(s.screen || "").indexOf("help_") === 0);
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
  const bt = $("#buzzToggle");
  if (bt) {
    bt.checked = buzzOn;
    bt.addEventListener("change", (e) => {
      buzzOn = e.target.checked;
      localStorage.setItem("rexBuzz", buzzOn ? "on" : "off");
      if (buzzOn) buzz([60]);          // confirm it works on this phone
      else if ("vibrate" in navigator) { try { navigator.vibrate(0); } catch (err) {} }
    });
  }

  const vt = $("#voiceToggle");
  if (vt) {
    vt.checked = voiceOn;
    vt.addEventListener("change", (e) => {
      voiceOn = e.target.checked;
      localStorage.setItem("rexVoice", voiceOn ? "on" : "off");
      if (!voiceOn) { try { synth && synth.cancel(); } catch (err) {} stopTalking(); }
      else unlockSpeech();
    });
  }
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
/* Every 3-7s an idle Rex does something: a drawn pose from the sheets
   (wave / hop / walk / run) or a quick CSS fidget (look around, blink).
   Alternating the two kinds is what keeps him from looking like a loop. */
const POSE_FIDGETS = [
  { sprite: "rex_kid_wave.png",  ms: 1100 },
  { sprite: "rex_kid_hop.png",   ms: 700 },
  { sprite: "rex_kid_walk.png",  ms: 900 },
  { sprite: "rex_kid_run.png",   ms: 800 },
  { sprite: "rex_kid_cheer.png", ms: 900 },   // no star in this pose, so idle-only
];
const CSS_FIDGETS = ["fidget-look", "fidget-blink", "fidget-hop"];
const FIDGET_MS = { "fidget-look": 600, "fidget-blink": 500, "fidget-hop": 500 };

function scheduleFidget() {
  const delay = 3000 + Math.random() * 4000;
  setTimeout(() => {
    const device = $("#device"), rex = $("#rexSprite");
    const profile = document.body.dataset.profile;
    // Low-stim exists to reduce movement, and reduced-motion is the same ask
    // from the OS — neither should get random extra animation.
    const mayFidget = device && rex && !reduceMotion && profile !== "low_stim"
                      && device.dataset.mood !== "sleeping"
                      && !device.classList.contains("rex-talking");
    // The drawn fidget poses only exist in the normal green art, so swapping
    // one in during high-contrast would drop the child out of their profile.
    const mayChangePose = mayFidget && profile !== "high_contrast"
                          && (device.dataset.mood === "happy" || device.dataset.mood === "waiting");
    if (mayChangePose && Math.random() < 0.6) {
      const f = POSE_FIDGETS[Math.floor(Math.random() * POSE_FIDGETS.length)];
      fidgetUntil = performance.now() + f.ms;
      paintSprite(rex, f.sprite);
    } else if (mayFidget) {
      const cls = CSS_FIDGETS[Math.floor(Math.random() * CSS_FIDGETS.length)];
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
