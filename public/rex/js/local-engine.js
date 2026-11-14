/* ============================================================
   Rex — client-side engine for the STATIC build (GitHub Pages).
   A faithful JS port of rex_emulator/engine.py + data.py so the
   app runs with no Python backend. Persists parent tasks, toggles
   and custom animations in localStorage. Exposes window.RexLocalAPI
   so emulator.js / parent.js work unchanged.
   ============================================================ */
(function () {
  "use strict";

  // ---------------------------------------------------------------- data
  const NEEDS = {
    tummy:   { label: { en: "Tummy",   es: "Pancita" }, color: "#FF8A00", icon: "icon_need_tummy.png",   led: "orange", stomp: "stomp-stomp" },
    sparkle: { label: { en: "Sparkle", es: "Brillo" },  color: "#22C3DD", icon: "icon_need_sparkle.png", led: "cyan",   stomp: "stomp-stomp-stomp" },
    fresh:   { label: { en: "Fresh",   es: "Limpio" },  color: "#3B82F6", icon: "icon_need_fresh.png",   led: "blue",   stomp: "splaaash" },
    sleepy:  { label: { en: "Sleepy",  es: "Sueño" },   color: "#8B5CF6", icon: "icon_need_sleepy.png",  led: "purple", stomp: "stomp... stomp..." },
    health:  { label: { en: "Health",  es: "Salud" },   color: "#22C55E", icon: "icon_need_health.png",  led: "green",  stomp: "stomp-stomp (long)" },
    custom:  { label: { en: "Custom",  es: "Otro" },    color: "#F59E0B", icon: "icon_star.png",         led: "gold",   stomp: "stomp-stomp" },
  };

  // Canned AI-helper lines (GDD §11.3 offline fallback), keyed routine -> step.
  // Mirrors data.HELP_LINES on the Python side; both must stay in step.
  const HELP_LINES = {
    brush_teeth_am: {
      s3: { en: "Brush in tiny circles. Want to brush with a song?", es: "Cepilla en círculos. ¿Cepillamos con una canción?" },
      "*": { en: "Let's look at the picture together. Ready?", es: "Miremos el dibujo juntos. ¿Listo?" },
    },
    shower_pm: {
      s3: { en: "Soap your arms, then your tummy. Shall I show you?", es: "Jabona brazos y pancita. ¿Te muestro?" },
      "*": { en: "One step at a time. Want the next little step?", es: "Un paso a la vez. ¿Vamos al siguiente?" },
    },
    "*": { "*": { en: "You're doing great! Want to do it with me?", es: "¡Lo haces genial! ¿Lo hacemos juntos?" } },
  };
  function helpLine(routineId, stepId) {
    const r = HELP_LINES[routineId] || HELP_LINES["*"];
    return r[stepId] || r["*"] || HELP_LINES["*"]["*"];
  }
  const STEP_PICTOGRAMS = ["🦷","🍎","🚿","🌙","🧼","👕","🎒","🥤","🚽","🛏️","🧴","👟","📚","🧸","💊","🪥","🍽️","🧦","☀️","⭐"];

  // Alert pose per need (GDD §5.3): only the needs with drawn art are
  // listed — selectSprite() falls back to the generic talking pose
  // otherwise. Mirrors engine.py's NEED_ALERT_SPRITE.
  const NEED_ALERT_SPRITE = { tummy: "rex_kid_alert_tummy.png", sleepy: "rex_kid_alert_sleepy.png" };

  const step = (id, picto, sprite, en, es, timer_s) =>
    ({ id, pictogram: picto, sprite, text: { en, es }, timer_s: timer_s || null });

  const ROUTINES = [
    { id: "brush_teeth_am", name: { en: "Brush teeth", es: "Lavar dientes" }, need: "sparkle",
      schedule: { time: "08:20" }, heads_up_min: 5, confirmation: "child",
      snooze: { interval_s: 300, max: 3, notify_parent: true }, reward_stars: 1, steps: [
        step("s1","toothbrush","rex_kid_brush.png","Get your toothbrush","Toma tu cepillo"),
        step("s2","toothpaste","rex_kid_toothpaste.png","Add toothpaste","Pon pasta"),
        step("s3","brushing","rex_kid_brush.png","Brush!","¡A cepillar!",120),
        step("s4","rinse","rex_kid_rinse.png","Rinse","Enjuaga")] },
    { id: "breakfast", name: { en: "Breakfast", es: "Desayuno" }, need: "tummy",
      schedule: { time: "08:00" }, heads_up_min: 5, confirmation: "child",
      snooze: { interval_s: 300, max: 3, notify_parent: false }, reward_stars: 1, steps: [
        step("s1","washhands","rex_kid_washhands.png","Wash your hands","Lava tus manos"),
        step("s2","table","rex_kid_eat.png","Sit at the table","Siéntate a la mesa"),
        step("s3","eat","rex_kid_eat.png","Eat","A comer"),
        step("s4","water","rex_kid_drink.png","Drink water","Toma agua")] },
    { id: "shower_pm", name: { en: "Shower", es: "Baño" }, need: "fresh",
      schedule: { time: "19:00" }, heads_up_min: 5, confirmation: "child",
      snooze: { interval_s: 300, max: 3, notify_parent: true }, reward_stars: 1, steps: [
        step("s1","clothesoff","rex_kid_idle.png","Take clothes off","Quítate la ropa"),
        step("s2","wateron","rex_kid_bath.png","Water on","Abre el agua"),
        step("s3","soap","rex_kid_bath.png","Soap","Jabón"),
        step("s4","rinse","rex_kid_bath.png","Rinse","Enjuaga"),
        step("s5","towel","rex_kid_idle.png","Towel","Sécate")] },
    { id: "bedtime", name: { en: "Bedtime", es: "Dormir" }, need: "sleepy",
      schedule: { time: "20:30" }, heads_up_min: 10, confirmation: "child",
      snooze: { interval_s: 300, max: 3, notify_parent: false }, reward_stars: 1, steps: [
        step("s1","pajamas","rex_kid_pajamas.png","Put on pajamas","Ponte pijama"),
        step("s2","brush","rex_kid_brush.png","Brush teeth","Lava dientes"),
        step("s3","bathroom","rex_kid_idle.png","Bathroom","Al baño"),
        step("s4","lights","rex_kid_bedtime.png","Lights off","Apaga la luz")] },
    { id: "medicine", name: { en: "Medicine", es: "Medicina" }, need: "health",
      schedule: { time: "13:00" }, heads_up_min: 0, confirmation: "parent",
      snooze: { interval_s: 300, max: 5, notify_parent: true }, reward_stars: 1, enabled: false, steps: [
        step("s1","grownup","rex_kid_idle.png","Go to your grown-up","Ve con tu adulto"),
        step("s2","medicine","rex_kid_medicine.png","Take it together","Tómala juntos")] },
  ];

  const PROFILES = {
    default:       { label: { en: "Default", es: "Normal" }, buttons: ["help","yes","later"], any_button_ok: false, low_stim: false, high_contrast: false, language: "es" },
    high_contrast: { label: { en: "High contrast", es: "Alto contraste" }, buttons: ["help","yes","later"], any_button_ok: false, low_stim: false, high_contrast: true, language: "es" },
    low_stim:      { label: { en: "Low-stim (autism)", es: "Bajo estímulo" }, buttons: ["help","yes","later"], any_button_ok: false, low_stim: true, high_contrast: false, language: "es" },
    one_button:    { label: { en: "One button / motor", es: "Un botón" }, buttons: ["yes"], any_button_ok: true, low_stim: false, high_contrast: false, language: "es" },
  };

  const STAGES = [
    { idx: 0, name: "Bebé Rex", min: 0 }, { idx: 1, name: "Pequeño Rex", min: 5 },
    { idx: 2, name: "Grande Rex", min: 15 }, { idx: 3, name: "Súper Rex", min: 30 },
  ];
  const stageFor = (stars) => STAGES.reduce((a, s) => (stars >= s.min ? s : a), STAGES[0]);

  const MOOD = { home:"happy", night:"sleeping", headsup:"wants", alert:"wants", task:"focused",
    timer:"focused", celebrate:"proud", levelup:"proud", help_listening:"listening",
    help_thinking:"thinking", help_reply:"caring", snoozed:"waiting" };

  const hhmm = (t) => { const [h, m] = t.split(":"); return (+h) * 3600 + (+m) * 60; };
  const toHHMM = (s) => { s = Math.floor(s) % 86400; if (s < 0) s += 86400;
    return String(Math.floor(s / 3600)).padStart(2, "0") + ":" + String(Math.floor((s % 3600) / 60)).padStart(2, "0"); };
  const clone = (o) => JSON.parse(JSON.stringify(o));

  // -------------------------------------------------------- persistence
  const PKEY = "rex_persist_v1";
  function loadPersist() {
    try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch (e) { return {}; }
  }
  function savePersist(p) { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {} }

  // ------------------------------------------------------------- engine
  function Engine() { this.reset(); }
  Engine.prototype.reset = function () {
    this._vbase = hhmm("07:57"); this._rbase = Date.now() / 1000; this.speed = 60; this.day = 0;
    this.profile_key = "default"; this.stars = 0;
    const p = loadPersist();
    this.routines = clone(ROUTINES).concat(clone(p.custom || []));
    const enabled = p.enabled || {};
    this.routines.forEach((r) => { if (r.id in enabled) r.enabled = enabled[r.id]; });
    this.custom_sprites = Object.assign({}, p.sprites || {});
    this.status = {}; this.routines.forEach((r) => (this.status[r.id] = "pending"));
    this.snooze_until = {}; this.snooze_count = {}; this.headsup_shown = {};
    this.ai_enabled = true; this.online = true; this.parent_alerts = [];
    this.screen = "home"; this.active = null; this.step_index = 0; this.step_timer_end = null;
    this.message = null; this._return_screen = "home"; this.last_press = null; this._levelup = null; this._heard = "";
  };
  const BASE_IDS = new Set(ROUTINES.map((r) => r.id));

  Engine.prototype._persist = function () {
    const custom = this.routines.filter((r) => !BASE_IDS.has(r.id));
    const enabled = {}; this.routines.forEach((r) => (enabled[r.id] = r.enabled !== false));
    savePersist({ custom, enabled, sprites: this.custom_sprites });
  };

  Engine.prototype.vnow = function () { return this._vbase + (Date.now() / 1000 - this._rbase) * this.speed; };
  Engine.prototype.setSpeed = function (sp) { this._vbase = this.vnow(); this._rbase = Date.now() / 1000; this.speed = Math.max(0, +sp); };
  Engine.prototype.jumpNext = function () { const n = this._nextScheduled(); if (n != null) { this._vbase = n - 2; this._rbase = Date.now() / 1000; } };
  Engine.prototype._enabled = function () { return this.routines.filter((r) => r.enabled !== false); };
  Engine.prototype._nextScheduled = function () {
    const v = this.vnow() % 86400; const c = [];
    this._enabled().forEach((r) => { if (this.status[r.id] === "done") return; const t = hhmm(r.schedule.time); c.push(t >= v ? t : t + 86400); });
    return c.length ? this.vnow() + (Math.min.apply(null, c) - v) : null;
  };
  Object.defineProperty(Engine.prototype, "profile", { get() { return PROFILES[this.profile_key]; } });

  Engine.prototype.tick = function () {
    const v = this.vnow();
    if (Math.floor(v / 86400) > this.day) {
      this.day = Math.floor(v / 86400);
      this.status = {}; this.routines.forEach((r) => (this.status[r.id] = "pending"));
      this.snooze_until = {}; this.snooze_count = {}; this.headsup_shown = {};
    }
    // "headsup" is included so an unacknowledged heads-up still escalates
    // into the real (animated) alert on its own, instead of freezing on
    // that one static pose forever when nobody presses a button.
    if (["home", "night", "snoozed", "headsup"].includes(this.screen)) { this._maybeAlert(v); this._maybeNight(v); }
    return this;
  };
  Engine.prototype._maybeAlert = function (v) {
    const vday = v % 86400;
    for (const r of this._enabled()) {
      const rid = r.id; if (this.status[rid] === "done") continue;
      const due = hhmm(r.schedule.time);
      if (rid in this.snooze_until && v < this.snooze_until[rid]) continue;
      const hu = due - (r.heads_up_min || 0) * 60;
      if (r.heads_up_min && !this.headsup_shown[rid] && hu <= vday && vday < due) { this.headsup_shown[rid] = 1; this._open("headsup", rid); return; }
      if (vday >= due || rid in this.snooze_until) { this._open("alert", rid); return; }
    }
  };
  Engine.prototype._maybeNight = function (v) {
    const vday = v % 86400;
    const isNight = vday >= hhmm("21:00") || vday < hhmm("06:30");
    if (this.screen === "home" && isNight) this.screen = "night";
    // Wake up on its own once the night window ends — see engine.py's
    // _maybe_night for why (nothing else guarantees a way out of "night").
    else if (this.screen === "night" && !isNight) this.screen = "home";
  };
  Engine.prototype._open = function (screen, rid) { this.screen = screen; this.active = rid; this.step_index = 0; this.step_timer_end = null; this.message = null; };
  Engine.prototype._routine = function (rid) { rid = rid || this.active; return this.routines.find((r) => r.id === rid); };

  Engine.prototype.trigger = function (rid) { if (this.routines.some((r) => r.id === rid)) { this.status[rid] = "pending"; delete this.snooze_until[rid]; this._open("alert", rid); } };
  Engine.prototype.setOnline = function (o) { this.online = !!o; };
  Engine.prototype.setAi = function (e) { this.ai_enabled = !!e; };
  Engine.prototype.toggleRoutine = function (rid, en) { this.routines.forEach((r) => { if (r.id === rid) r.enabled = !!en; }); this._persist(); };

  // ----- button presses -----
  Engine.prototype.press = function (button) {
    this.tick();
    if (this.profile.any_button_ok && (button === "help" || button === "later")) button = "yes";
    this.last_press = button;
    const h = this["_press_" + this.screen]; if (h) h.call(this, button);
    return this;
  };
  Engine.prototype._press_home = function (b) {
    if (b === "help") this._startHelp();
    else if (b === "yes") { const n = this._nextScheduled(); if (n != null) this.message = { en: "Next: " + this._nextName() + " at " + toHHMM(n), es: "Sigue: " + this._nextName("es") + " a las " + toHHMM(n) }; }
  };
  Engine.prototype._press_night = function (b) { if (b === "help") this._startHelp(); else if (b === "yes") this.message = { en: "Nightlight on. Sweet dreams!", es: "Luz de noche. ¡Dulces sueños!" }; };
  Engine.prototype._press_headsup = function () { this.screen = "home"; this.active = null; };
  Engine.prototype._press_snoozed = function (b) { if (b === "help") this._startHelp(); };
  Engine.prototype._press_alert = function (b) { if (b === "help") this._startHelp(); else if (b === "yes") this._enterTask(); else if (b === "later") this._snooze(); };
  Engine.prototype._press_task = function (b) { if (b === "help") this._startHelp(); else if (b === "yes") this._advance(); else if (b === "later") this._snooze(); };
  Engine.prototype._press_timer = Engine.prototype._press_task;
  Engine.prototype._press_celebrate = function () {
    if (this._levelup) { this.screen = "levelup"; this.message = { en: "Level up! Now you're " + this._levelup + "!", es: "¡Subiste de nivel! ¡Ahora eres " + this._levelup + "!" }; }
    else { this.screen = "home"; this.active = null; this.message = null; }
  };
  Engine.prototype._press_levelup = function () { this._levelup = null; this.screen = "home"; this.active = null; this.message = null; };
  Engine.prototype._press_help_listening = function () { this._makeHelpReply(); };
  Engine.prototype._press_help_thinking = function () { this._makeHelpReply(); };
  Engine.prototype._press_help_reply = function (b) { if (b === "help") this._startHelp(); else { this.screen = this._return_screen; this.message = null; } };

  Engine.prototype._enterTask = function () {
    const r = this._routine();
    if (r.confirmation === "parent") this.message = { en: "Ask your grown-up to help.", es: "Pide ayuda a tu adulto." };
    this.screen = "task"; this.step_index = 0; this._enterStep();
  };
  Engine.prototype._enterStep = function () {
    const st = this._routine().steps[this.step_index];
    if (st.timer_s) { this.screen = "timer"; this.step_timer_end = this.vnow() + st.timer_s; } else { this.screen = "task"; this.step_timer_end = null; }
  };
  Engine.prototype._advance = function () { this.step_index++; if (this.step_index >= this._routine().steps.length) this._complete(); else this._enterStep(); };
  Engine.prototype._complete = function () {
    const r = this._routine(); this.status[r.id] = "done"; delete this.snooze_until[r.id];
    const before = this.stars; this.stars += r.reward_stars || 1;
    const o = stageFor(before), n = stageFor(this.stars); this._levelup = n.idx > o.idx ? n.name : null;
    this.screen = "celebrate"; this.message = { en: "We did it! You're amazing!", es: "¡Lo logramos! ¡Eres increíble!" };
  };
  Engine.prototype._snooze = function () {
    const r = this._routine(), rid = r.id, pol = r.snooze;
    this.snooze_count[rid] = (this.snooze_count[rid] || 0) + 1;
    this.snooze_until[rid] = this.vnow() + pol.interval_s; this.status[rid] = "snoozed";
    this.screen = "snoozed"; this.message = { en: "Okay! I'll ask again in a little bit.", es: "¡Está bien! Te pregunto en un ratito." };
    // === max, not >=: fires once at the threshold. See engine.py's
    // _snooze for why >= is wrong (re-notifies on every later snooze too).
    if (pol.notify_parent && this.snooze_count[rid] === pol.max) this._notify(r.name.es + " se pospuso " + this.snooze_count[rid] + " veces", "med");
    this.active = null;
  };
  Engine.prototype._startHelp = function () {
    if (!["help_listening", "help_thinking", "help_reply"].includes(this.screen)) this._return_screen = this.screen;
    if (!this.ai_enabled) { this.screen = "help_reply"; this.message = { en: "Let's look at the picture together!", es: "¡Miremos el dibujo juntos!" }; return; }
    this.screen = "help_listening"; this.message = { en: "I'm listening!", es: "¡Te escucho!" };
  };
  Engine.prototype._makeHelpReply = function () {
    const rid = this.active || "*";
    let stepId = "*";
    const r = this._routine();
    if (r && this.step_index < r.steps.length) stepId = r.steps[this.step_index].id;
    if (!this.online)
      this.message = { en: "No signal, but let's look at the picture together!",
                       es: "Sin señal, ¡pero miremos el dibujo juntos!" };
    else this.message = helpLine(rid, stepId);
    this.screen = "help_reply";
  };
  Engine.prototype.voiceHelp = function (text) {
    this._heard = text || ""; const t = (text || "").toLowerCase(); let reply;
    if (!this.online) reply = { en: "No signal, but let's look together!", es: "Sin señal, ¡pero miremos juntos!" };
    else if (/(mam[aá]|pap[aá]s?|adulto|cuidador)/.test(t)) { this.callGrownup(); return; }
    else if (/(triste|mal|lloro|miedo|dolor|enoj)/.test(t)) { this._notify("Rex detectó tristeza (el niño pidió ayuda por voz)", "high"); reply = { en: "I'm here. Breathe with me. Call a grown-up?", es: "Aquí estoy. Respira conmigo. ¿Llamo a un adulto?" }; }
    else if (/d[ií]a/.test(t)) reply = this._daySummary();
    else if (/(dient|cepill)/.test(t)) reply = { en: "Small circles, up and down. Ready?", es: "Círculos pequeños, arriba y abajo. ¿Listo?" };
    else if (/(pelo|cabello|bañ|duch|lavar)/.test(t)) reply = { en: "Wet, soap, rinse. Shall I show you?", es: "Moja, jabón y enjuaga. ¿Te muestro?" };
    else if (t.includes("no quiero")) reply = { en: "That's okay. Fast song or slow song?", es: "Está bien. ¿Canción rápida o lenta?" };
    else if (/sigue/.test(t)) reply = { en: "Next: " + this._nextName(), es: "Sigue: " + this._nextName("es") };
    else reply = { en: "You're doing great! Want to do it with me?", es: "¡Lo haces genial! ¿Lo hacemos juntos?" };
    this.message = reply; this.screen = "help_reply";
  };
  Engine.prototype.callGrownup = function () {
    this._notify("Rex pidió un adulto (presionaron AYUDA)", "high");
    this.message = { en: "I called your grown-up. They're coming!", es: "Llamé a tu adulto. ¡Ya viene!" }; this.screen = "help_reply";
  };
  Engine.prototype._notify = function (text, urgency) { this.parent_alerts.unshift({ text, urgency, at: toHHMM(this.vnow()) }); this.parent_alerts = this.parent_alerts.slice(0, 8); };
  Engine.prototype._nextName = function (lang) { lang = lang || "en"; const v = this.vnow() % 86400; let best = null, bt = null;
    this._enabled().forEach((r) => { if (this.status[r.id] === "done") return; let t = hhmm(r.schedule.time); t = t >= v ? t : t + 86400; if (bt == null || t < bt) { bt = t; best = r; } });
    return best ? best.name[lang] : "-"; };
  Engine.prototype._daySummary = function () {
    const routines = this._enabled();
    const done = routines.filter((r) => this.status[r.id] === "done");
    const total = routines.length;
    if (!done.length) return { en: "We haven't done any routines yet today. Start one?", es: "Aún no hemos hecho rutinas hoy. ¿Empezamos una?" };
    const namesEs = done.slice(0, 3).map((r) => r.name.es).join(", ");
    const namesEn = done.slice(0, 3).map((r) => r.name.en).join(", ");
    if (done.length === total) return { en: `Great day! You finished all ${total}: ${namesEn}. ${this.stars} stars!`, es: `¡Gran día! Hiciste las ${total} rutinas: ${namesEs}. ¡${this.stars} estrellas!` };
    return { en: `Today you did ${done.length} of ${total}: ${namesEn}. Nice job!`, es: `Hoy hiciste ${done.length} de ${total}: ${namesEs}. ¡Bien hecho!` };
  };

  // ----- parent CRUD -----
  Engine.prototype._buildRoutine = function (p, rid) {
    const name_en = (p.name_en || p.name || "New task").trim().slice(0, 40);
    const name_es = (p.name_es || name_en).trim().slice(0, 40);
    const need = NEEDS[p.need] ? p.need : "custom";
    let time = String(p.time || "09:00"); if (!/^\d{2}:\d{2}$/.test(time)) time = "09:00";
    const days = p.days && p.days.length ? p.days : ["mon","tue","wed","thu","fri","sat","sun"];
    let steps = (p.steps || []).filter((s) => (s.en || "").trim()).map((s, i) =>
      ({ id: "s" + (i + 1), pictogram: s.pictogram || "⭐", sprite: "rex_kid_idle.png", text: { en: s.en.trim().slice(0, 40), es: (s.es || s.en).trim().slice(0, 40) }, timer_s: s.timer_s ? +s.timer_s : null }));
    if (!steps.length) steps = [{ id: "s1", pictogram: "⭐", sprite: "rex_kid_idle.png", text: { en: "Do it with Rex!", es: "¡Hazlo con Rex!" }, timer_s: null }];
    if (!rid) rid = "custom_" + (name_en.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "task") + "_" + (Date.now() % 100000);
    return { id: rid, name: { en: name_en, es: name_es }, need, schedule: { time, days },
      heads_up_min: +(p.heads_up_min || 0), confirmation: p.parent_confirm ? "parent" : "child",
      snooze: { interval_s: 300, max: 3, notify_parent: p.notify_parent !== false },
      reward_stars: Math.max(1, +(p.reward_stars || 1)), enabled: p.enabled !== false, steps, custom: true };
  };
  Engine.prototype.addRoutine = function (p) { const r = this._buildRoutine(p); this.routines.push(r); this.status[r.id] = "pending"; this._persist(); return r.id; };
  Engine.prototype.updateRoutine = function (rid, p) {
    for (let i = 0; i < this.routines.length; i++) if (this.routines[i].id === rid) {
      if (BASE_IDS.has(rid)) this.routines[i].enabled = p.enabled !== false;
      else this.routines[i] = this._buildRoutine(p, rid);
      this._persist(); return true;
    } return false;
  };
  Engine.prototype.deleteRoutine = function (rid) {
    if (BASE_IDS.has(rid)) return false;
    delete this.custom_sprites[rid]; this.routines = this.routines.filter((r) => r.id !== rid); delete this.status[rid];
    if (this.active === rid) { this.screen = "home"; this.active = null; } this._persist(); return true;
  };
  Engine.prototype.setCustomSprite = function (rid, dataurl) { if (this.routines.some((r) => r.id === rid) && dataurl) { this.custom_sprites[rid] = dataurl; this._persist(); return true; } return false; };
  Engine.prototype.fullRoutines = function () {
    const out = this.routines.map((r) => ({ id: r.id, name: r.name, need: r.need, time: r.schedule.time,
      days: r.schedule.days || [], heads_up_min: r.heads_up_min || 0, confirmation: r.confirmation,
      reward_stars: r.reward_stars || 1, notify_parent: r.snooze.notify_parent !== false, enabled: r.enabled !== false,
      builtin: BASE_IDS.has(r.id), custom_sprite: this.custom_sprites[r.id] || null,
      steps: r.steps.map((s) => ({ pictogram: s.pictogram, en: s.text.en, es: s.text.es, timer_s: s.timer_s })) }));
    out.sort((a, b) => a.time.localeCompare(b.time)); return out;
  };

  // ----- sprite + buttons + snapshot -----
  Engine.prototype.selectSprite = function () {
    if (this.profile.high_contrast) return "rex_kid_idle_hc.png";
    if (["alert", "task", "timer"].includes(this.screen) && this.custom_sprites[this.active]) return this.custom_sprites[this.active];
    // Two celebration intensities (GDD §5.6): a plain win uses the everyday
    // pose; a win that also crosses a life-stage milestone gets the bigger
    // stomp-dance "proud" sprite right before the level-up screen.
    if (this.screen === "celebrate") return this._levelup ? "rex_kid_proud.png" : "rex_kid_celebrate.png";
    // Mid-routine Rex does the step himself, using that step's own art.
    if (this.screen === "task" || this.screen === "timer") {
      const r = this._routine();
      if (r && this.step_index < r.steps.length && r.steps[this.step_index].sprite)
        return r.steps[this.step_index].sprite;
    }
    // The alert pose names the need being asked about (GDD §5.3/§9.1),
    // e.g. tummy-patting for a hungry reminder, rather than one generic
    // "talking" pose for every kind of alert.
    if (this.screen === "alert") {
      const r = this._routine();
      const sprite = r && NEED_ALERT_SPRITE[r.need];
      if (sprite) return sprite;
    }
    const m = { home:"rex_kid_idle.png", night:"rex_kid_sleeping.png", snoozed:"rex_kid_idle.png",
      headsup:"rex_kid_talking.png", alert:"rex_kid_talking.png", task:"rex_kid_idle.png", timer:"rex_kid_idle.png",
      levelup:"rex_evolve.png", help_listening:"rex_kid_listen.png",
      help_thinking:"rex_kid_listen.png", help_reply:"rex_kid_talking.png" };
    return m[this.screen] || "rex_kid_idle.png";
  };
  // Cosmetic reward preview for the level-up screen (GDD §7: accessories
  // unlock at star milestones — the same thresholds as the life stages).
  Engine.prototype.unlockedAccessory = function () {
    return (this.screen === "levelup" && this._levelup) ? "rex_kid_hat_party.png" : null;
  };
  Engine.prototype._buttons = function () {
    const prof = this.profile, allowed = prof.buttons;
    const L = (help_, yes, later) => {
      const out = {};
      if (allowed.includes("help") && help_) out.help = help_;
      if (allowed.includes("yes") && yes) out.yes = yes;
      if (allowed.includes("later") && later) out.later = later;
      if (prof.any_button_ok) { const prim = yes || help_ || later; return prim ? { yes: prim } : {}; }
      return out;
    };
    const maps = {
      home: L("Habla con Rex", "¿Qué sigue?", null), night: L("Habla", "Luz", null), headsup: L(null, "Bien", null),
      alert: L("Ayuda", "Empezar", "Después"), task: L("Ayuda", "Listo", "Pausa"), timer: L("Ayuda", "Listo", "Pausa"),
      celebrate: L(null, "Seguir", null), levelup: L(null, "¡Genial!", null), snoozed: L("Habla con Rex", null, null),
      help_listening: prof.any_button_ok ? L(null, "Responder", null) : L("Parar", "Responder", "Cancelar"),
      help_thinking: L(null, "Responder", null), help_reply: L("Otra vez", "Sí", "No"),
    };
    return maps[this.screen] || {};
  };
  Engine.prototype.snapshot = function () {
    this.tick();
    const r = this._routine(), v = this.vnow();
    const need = r ? NEEDS[r.need] : null; const needKey = r ? r.need : null;
    let stepText = null, stepInfo = null;
    if (["task", "timer"].includes(this.screen) && r) {
      const st = r.steps[this.step_index]; stepText = st.text;
      stepInfo = { index: this.step_index, count: r.steps.length, pictogram: st.pictogram, timer_s: st.timer_s };
    } else if (this.screen === "alert" && r) stepText = { en: r.name.en + "?", es: r.name.es + "?" };
    else if (this.screen === "headsup" && r) { const m = r.heads_up_min || 5; stepText = { en: "Soon: " + r.name.en + " (in " + m + " min)", es: "Pronto: " + r.name.es + " (en " + m + " min)" }; }

    let timer = null;
    if (this.screen === "timer" && this.step_timer_end) {
      const total = r.steps[this.step_index].timer_s, remain = Math.max(0, this.step_timer_end - v);
      timer = { remaining_s: Math.round(remain * 10) / 10, total_s: total, pct: total ? Math.round(100 * (1 - remain / total)) : 100 };
      if (remain <= 0) { this._advance(); return this.snapshot(); }
    }
    const meters = {};
    Object.keys(NEEDS).forEach((k) => {
      const due = this.routines.some((rr) => rr.need === k && this.status[rr.id] !== "done" &&
        ["alert", "task", "timer", "headsup"].includes(this.screen) && this.active === rr.id);
      meters[k] = due ? 1 : 3;
    });
    const timeline = this.routines.map((rr) => ({ id: rr.id, name: rr.name, time: rr.schedule.time, need: rr.need,
      status: this.status[rr.id], enabled: rr.enabled !== false, confirmation: rr.confirmation }));
    timeline.sort((a, b) => a.time.localeCompare(b.time));

    return {
      screen: this.screen, mood: MOOD[this.screen] || "happy", sprite: this.selectSprite(),
      need: need ? Object.assign({ key: needKey }, need) : null, needMeters: meters,
      message: this.message, stepText, step: stepInfo, timer, buttons: this._buttons(), lastPress: this.last_press,
      stars: this.stars, stage: stageFor(this.stars), levelup: this._levelup, accessory: this.unlockedAccessory(),
      clock: { time: toHHMM(v), speed: this.speed }, profile: Object.assign({ key: this.profile_key }, this.profile),
      ai: { enabled: this.ai_enabled, online: this.online }, activeRoutine: r ? r.name : null,
      parentAlerts: this.parent_alerts, timeline,
      routines: this.routines.map((rr) => ({ id: rr.id, name: rr.name, enabled: rr.enabled !== false })),
    };
  };

  // -------------------------------------------------- the local "API"
  const engine = new Engine();
  window.RexLocalAPI = function (path, body) {
    body = body || {};
    let res;
    switch (path) {
      case "/api/state": res = engine.snapshot(); break;
      case "/api/routines": res = { routines: engine.fullRoutines(), needs: NEEDS, pictograms: STEP_PICTOGRAMS }; break;
      case "/api/press": engine.press(body.button || "yes"); res = engine.snapshot(); break;
      case "/api/trigger": engine.trigger(body.id); res = engine.snapshot(); break;
      case "/api/clock": if (body.jump) engine.jumpNext(); if ("speed" in body) engine.setSpeed(body.speed); res = engine.snapshot(); break;
      case "/api/profile": if (PROFILES[body.key]) engine.profile_key = body.key; res = engine.snapshot(); break;
      case "/api/ai": if ("enabled" in body) engine.setAi(body.enabled); if ("online" in body) engine.setOnline(body.online); res = engine.snapshot(); break;
      case "/api/routine": engine.toggleRoutine(body.id, body.enabled !== false); res = engine.snapshot(); break;
      case "/api/routine/add": { const id = engine.addRoutine(body); res = { ok: true, id, routines: engine.fullRoutines() }; break; }
      case "/api/routine/update": res = { ok: engine.updateRoutine(body.id, body), routines: engine.fullRoutines() }; break;
      case "/api/routine/delete": res = { ok: engine.deleteRoutine(body.id), routines: engine.fullRoutines() }; break;
      case "/api/routine/upload_sprite": { const ok = engine.setCustomSprite(body.id, body.dataurl); res = { ok, sprite: body.dataurl, routines: engine.fullRoutines() }; break; }
      case "/api/grownup": engine.callGrownup(); res = engine.snapshot(); break;
      case "/api/help_voice": engine.voiceHelp(body.text || ""); res = engine.snapshot(); break;
      case "/api/reset": engine.reset(); res = engine.snapshot(); break;
      default: res = { error: "unknown " + path };
    }
    return Promise.resolve(res);
  };
})();
