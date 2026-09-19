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
- `rex_kid_proud.png` — big celebration (confetti + thumbs up)
- `rex_kid_hat_party.png` — party-hat accessory
- `rex_evolve.png` — life-stage evolution (spin ball)

High-contrast:
- `rex_kid_idle_hc.png` — yellow-on-black Rex, used for all screens when the
  High-contrast profile is on.

Need icons (transparent):
- `icon_need_tummy.png` `icon_need_sparkle.png` `icon_need_fresh.png`
  `icon_need_sleepy.png` `icon_need_health.png` `icon_star.png`

Backgrounds (available, not yet wired into the screen):
- `bg_cave_home.png` `bg_cave_night.png`

## Sprite selection
The engine maps every device screen to one of these files in
`rex_emulator/engine.py → Engine.select_sprite()`. Poses not yet drawn
(per-step brushing/bath art, sleepy, listening, etc.) fall back to the
closest shipped sprite. Add a new PNG here and point the mapping at it — no
other change needed.
