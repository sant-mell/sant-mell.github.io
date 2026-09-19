# Sprites

These PNGs were extracted from the source sprite sheets, background-keyed to
transparency, and **crisp-pixelated** (LANCZOS downscale + palette quantize +
hard alpha edge; the UI upscales them with `image-rendering: pixelated`, so
they stay sharp pixel-art instead of blurry/AI-esque). Filenames follow
`documentation/rex_sprite_prompts.txt`.

## Shipped now
Rex poses (green):
- `rex_kid_idle.png` — home / steps / waiting
- `rex_kid_talking.png` — alerts, heads-up, AI helper (expressive bust)
- `rex_kid_celebrate.png` — routine complete (arms up + star)
- `rex_kid_proud.png` — bigger celebration when a routine win also crosses a
  life-stage star milestone (shown instead of `rex_kid_celebrate.png` right
  before the level-up screen)
- `rex_kid_hat_party.png` — accessory-unlocked badge shown at Rex's feet on
  the level-up screen (GDD §7: cosmetics unlock at star milestones)
- `rex_evolve.png` — life-stage evolution (spin ball)

Routine activities (frame sets looped via `FRAME_SETS` in
`web/js/emulator.js`, same pattern as `rex_kid_brush.png`):
- `rex_kid_eat.png` (+2/3/4) — breakfast routine, steps "table"/"eat"
- `rex_kid_bath.png` (+2/3/4) — shower routine, steps "wateron"/"soap"/"rinse"
- `rex_kid_bedtime.png` (+2/3/4) — bedtime routine, step "lights"
- `rex_kid_medicine.png` (+2, 2-frame loop) — medicine routine, step "medicine"
- `rex_kid_washhands.png` (+2/3/4) — breakfast routine, step "washhands"
- `rex_kid_drink.png` (+2, 2-frame loop) — breakfast routine, step "water"
- `rex_kid_pajamas.png` (+2, 2-frame loop) — bedtime routine, step "pajamas"

Alert poses (per-need, `engine.py → NEED_ALERT_SPRITE`, falls back to
`rex_kid_talking.png` for needs without drawn art):
- `rex_kid_alert_tummy.png` (+2) — hungry reminder
- `rex_kid_alert_sleepy.png` (+2) — bedtime reminder

Night/sleep:
- `rex_kid_sleeping.png` (+2, 2-frame breathing loop) — replaces the old
  static `rex_kid_sleep.png` for the passive `night` screen
  (`engine.py → select_sprite()`)

Extracted, not yet wired (no existing hook — would need new engine
behavior, not just a mapping entry):
- `rex_kid_wakeup.png` (+2/3/4) — needs a night→home wake transition, which
  the engine doesn't have yet (`night` never auto-reverts to `home`)
- `rex_kid_sleepy.png` (+2/3/4) — a pre-alert "sleepy mood" state on the
  home screen doesn't exist yet; the engine's mood system is screen-based,
  not a continuous per-need countdown
- `rex_kid_lightsoff.png` (+2) — frame 2's source art was a shaded "room at
  night" mockup (gradient background, not a clean sprite), so frame 2 is
  currently just a duplicate of frame 1

High-contrast:
- `rex_kid_idle_hc.png` — yellow-on-black Rex, used for all screens when the
  High-contrast profile is on.

Need icons (transparent):
- `icon_need_tummy.png` `icon_need_sparkle.png` `icon_need_fresh.png`
  `icon_need_sleepy.png` `icon_need_health.png` `icon_star.png`
  `icon_star_shine.png` (unused extra — shining variant)
- `icon_caring_heart.png` (unused extra — matches the "caring" mood on
  `help_reply`, not wired to anything yet)

Backgrounds — wired into `#caveBg` (`web/js/emulator.js`), shown only on the
resting `home`/`night` screens so the mood-color gradient still carries the
accessibility state everywhere else:
- `bg_cave_home.png` `bg_cave_night.png`

Props — wired:
- `ui_signal_rexnet_full.png` — replaces the old CSS bar graphic in the
  status row; dims to gray via CSS when offline (no separate "off" art).
- `ui_listening_ear.png` — badge next to Rex during `help_listening` only.

Props — extracted, not yet wired (nice-to-have, GDD §11):
- `ui_speech_bubble.png`, `ui_offer_help_hand.png`
- `deco_lamp.png` `deco_plant.png` `deco_volcano_nightlight.png`
  `deco_nest_bed.png` — cave decorations meant to composite over the
  background; the shipped `bg_cave_*` art already bakes in a nest, so these
  are for a future "decorate your cave" feature, not required for the demo.
- `ui_signal_rexnet_weak.png` (the engine only tracks online/offline, no
  mid-tier signal, so this has no driver yet)

## Sprite selection
The engine maps every device screen to one of these files in
`rex_emulator/engine.py → Engine.select_sprite()`. Poses not yet drawn
(per-step brushing/bath art, sleepy, listening, etc.) fall back to the
closest shipped sprite. Add a new PNG here and point the mapping at it — no
other change needed.
