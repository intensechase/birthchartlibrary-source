// Redesign stage switches. The redesign lives in the same code as the live
// site; each rebuilt page checks its stage and renders the new design only
// when that stage is on. Shipping a stage = turning it on in the build.
// Rolling back = turning it off.
//
// Set at BUILD time (pages are prerendered), via the Docker build arg
// NEXT_PUBLIC_REDESIGN: a comma list of stages, or "all".
//   live site:  unset (nothing on) until a stage ships
//   preview:    all
// Stages follow the build list's rollout order.
export const STAGES = ['celeb', 'home', 'mine', 'library', 'placement', 'hubs', 'tools', 'compare', 'finish'] as const
export type Stage = (typeof STAGES)[number]

const raw = (process.env.NEXT_PUBLIC_REDESIGN ?? '').trim().toLowerCase()
const on = new Set(raw === 'all' ? STAGES : raw.split(',').map((s) => s.trim()).filter(Boolean))

export function redesignOn(stage: Stage): boolean {
  return on.has(stage)
}

// True when any stage is on: turns on the site wide owner rules (html.rd).
export const REDESIGN_ANY = STAGES.some((s) => on.has(s))
