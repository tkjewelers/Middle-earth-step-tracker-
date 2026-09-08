# Middle Earth Journey Tracker

## Project Overview
A 3D interactive map that tracks real-world walking progress through Middle Earth, following Frodo and Sam's journey from the Shire to Mordor and back. Users input weekly step/mile counts and watch two hobbit game pieces advance along the path with book-accurate story context.

**Challenge start date:** January 1, 2026
**Conversion rate:** 2,100 steps = 1 mile
**Canonical journey distance:** 1,779 miles (not the raw 2,043 segment sum — accounts for route overlap on return + Eagles transport)

### Current Progress (as of Feb 28, 2026)
- **Miles walked:** 170.0
- **Days on road:** 59
- **Overall daily avg:** 2.88 mi/day
- **Current segment:** #6 — Rivendell → West-gate of Moria (25% complete, ~10 mi into 40 mi segment)
- **Journey %:** 9.6% of 1,779 mi
- **Last milestone:** Rivendell (160 mi) reached ~Feb 23
- **Next milestone:** West-gate of Moria (200 mi), ~30 mi away

### Milestones Passed
| Milestone | Distance | Date Reached |
|-----------|----------|-------------|
| Bucklebury Ferry | 18 mi | ~Jan 8 |
| Tom Bombadil's House | 39 mi | ~Jan 16 |
| Bree | 60 mi | ~Jan 24 |
| Weathertop | 100 mi | ~Feb 7 |
| Rivendell | 160 mi | ~Feb 23 |

## Tech Stack
- **Framework:** React 18 + Vite
- **3D Engine:** Three.js with React Three Fiber (`@react-three/fiber`)
- **3D Helpers:** `@react-three/drei` (OrbitControls, Text, Billboard, etc.)
- **Styling:** Tailwind CSS
- **State:** Zustand (lightweight, persistent state)
- **Storage:** localStorage (progress persistence)
- **TypeScript:** Yes (strict mode)

## Project Structure
```
middle-earth-tracker/
├── public/
│   ├── textures/
│   ├── models/
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── three/          # 3D components
│   │   │   ├── Scene.tsx
│   │   │   ├── Terrain.tsx
│   │   │   ├── Water.tsx
│   │   │   ├── Forests.tsx
│   │   │   ├── JourneyPath.tsx
│   │   │   ├── LocationMarkers.tsx
│   │   │   ├── RegionLabels.tsx
│   │   │   ├── Hobbits.tsx
│   │   │   ├── MordorEffects.tsx
│   │   │   └── CameraController.tsx
│   │   ├── ui/
│   │   │   ├── Header.tsx
│   │   │   ├── ProgressInput.tsx
│   │   │   ├── CurrentLocation.tsx
│   │   │   ├── JourneyLog.tsx
│   │   │   └── QuickNav.tsx
│   │   └── layout/
│   │       └── AppLayout.tsx
│   ├── data/
│   │   ├── journey-segments.ts
│   │   ├── locations.ts
│   │   ├── regions.ts
│   │   └── terrain-config.ts
│   ├── stores/
│   │   └── journeyStore.ts
│   ├── hooks/
│   │   ├── useJourneyProgress.ts
│   │   └── useTerrainHeight.ts
│   ├── utils/
│   │   ├── interpolate.ts
│   │   ├── coordinates.ts
│   │   ├── noise.ts
│   │   └── storage.ts
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── README.md
```

## Terrain Coordinate System
- **World size:** 200 × 160 units
- **X axis:** West (-80) to East (100)
- **Z axis:** North (-60) to South (80)
- **Y axis:** Elevation (sea level 0, Mount Doom peak ~30)

### Key Location 3D Coordinates
| Location | X | Y | Z |
|----------|---|---|---|
| Bag End | -60 | 4 | -15 |
| Bucklebury Ferry | -50 | 2 | -10 |
| Tom Bombadil's House | -40 | 3 | -8 |
| Bree | -30 | 5 | -12 |
| Weathertop | -12 | 14 | -8 |
| Rivendell | 8 | 10 | -18 |
| West-gate of Moria | 14 | 6 | 2 |
| East-gate of Moria | 20 | 8 | 6 |
| Lothlórien | 28 | 4 | 18 |
| Amon Hen | 38 | 6 | 32 |
| Minas Tirith | 46 | 12 | 50 |
| Edoras | 30 | 10 | 42 |
| Isengard | 18 | 6 | 30 |
| Mount Doom | 70 | 30 | 35 |
| Morannon | 58 | 8 | 28 |

### Terrain Regions
- **Shire:** x < -35, z < 5 — gentle rolling hills, green
- **Old Forest:** x: -45 to -30, z: -12 to 2 — dense, dark green
- **Weather Hills:** around (-12, -8) — rocky elevation
- **Trollshaws:** x: -10 to 10, z: -25 to -5 — ancient forest
- **Misty Mountains:** x ≈ 16, z: -25 to 15 — major mountain chain (y up to 25)
- **Eregion/Hollin:** x: 0 to 20, z: -5 to 15 — open, grassy
- **Lothlórien:** around (28, 18) — golden forest
- **Rohan:** x: 20 to 42, z: 35 to 55 — grassland/steppe
- **Gondor/White Mountains:** z ≈ 52, x: 25 to 55 — mountain chain
- **Mordor:** around (65, 35) — ring of mountains, ash-brown interior, Mount Doom peak
- **Dead Marshes:** x: 42 to 60, z: 28 to 40 — flat, swampy
- **Ithilien:** x: 48 to 60, z: 36 to 48 — green woodland

## Styling Guidelines

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| bg-dark | #0a0806 | Body background |
| parchment | #1a1510 | Card backgrounds |
| parchment-border | #3d3425 | Borders, dividers |
| gold-primary | #c9a84c | Headings, stats, progress |
| gold-dim | #6b5a3e | Labels, subtle text |
| text-body | #b8a88e | Narrative text |
| text-muted | #5a4e3a | Secondary info |
| shire-green | #4a6741 | Shire, completed path start |
| path-green | #6b8f3c | Progress indicators |
| elven-teal | #5aaa8a | Rivendell, hope elements |
| danger-red | #c94c4c | Weathertop, Mordor danger |
| danger-orange | #c97a5a | Morgul wound, warnings |
| river-blue | #4a9aaa | Water features |

### Typography
- **Headers:** Cinzel Decorative (400, 700, 900)
- **Labels/UI:** Cinzel (400, 600, 700)
- **Body/Narrative:** Crimson Text (400, 600, italic)
- **Fallback:** Georgia, serif

### Design Aesthetic
- Dark parchment, not bright/cartoonish
- Completed path: bright gradient (green → gold → teal)
- Remaining path: dim dotted line
- Passed waypoints: teal checkmark badges
- Current position: animated bobbing hobbit figures with golden glow
- Region labels: large, low-opacity text beneath terrain
- Mordor: red glow, smoke particles, Eye of Sauron
- Context-appropriate effects (wound glow, elven glow, fire scars)

## Hobbit Figures
- **Frodo:** grey-blue cloak, smaller build. Currently healed (past Rivendell).
- **Sam:** brown cloak, walking stick, backpack silhouette. Loyal and sturdy.
- **Companions:** Change per segment. Currently the full Fellowship of 9 (segment 6).

## Development Phases
1. ✅ Project Setup — files, deps, data structures
2. **Basic 3D Scene** — R3F canvas, OrbitControls, flat terrain plane, lighting
3. **Terrain System** — procedural heightmap, vertex coloring by region, mountain ranges
4. **Geographic Features** — water (sea, Anduin), instanced forests, mountain peaks
5. **Journey Elements** — CatmullRomCurve3 path, completed/remaining visualization, markers
6. **Hobbit Characters** — two hobbit models, position interpolation, walking animation, glow
7. **Labels & UI Integration** — billboard text labels, region names, settlement names
8. **Mordor Effects** — Mount Doom volcano, Barad-dûr, Eye of Sauron, ash particles
9. **UI Components** — progress input, current location card, journey log, stats
10. **Polish** — localStorage save/load, camera fly-to animations, mobile, performance

## Performance Considerations
- Use `InstancedMesh` for trees (thousands of instances)
- `useMemo` for expensive geometry calculations
- Frustum culling enabled
- Limit draw calls
- Target 60fps on mid-range hardware
- Desktop-first, mobile secondary

## Key Rules
- Always preserve existing journey progress when making changes
- Terrain generation must be deterministic (seeded random)
- All book references must be accurate to Tolkien's text
- Two hobbits must be visually distinct (cloak colors)
- 1,779 miles canonical distance
- 2,100 steps/mile conversion rate

## Commands
```bash
npm run dev        # Development server (port 3000)
npm run build      # Production build
npm run preview    # Preview production build
npm run typecheck  # Type check
npm run lint       # Lint
```
