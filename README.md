# Middle-earth Step Tracker

An interactive walking adventure with animated Frodo and Sam, 25 journey milestones, a route map, chapter stories, and locally saved step/mile logging.

The editable application now lives in [`middle-earth-tracker/`](./middle-earth-tracker/). The original ZIP is retained as an archive; use the source folder for the latest version.

## Run locally

```sh
cd middle-earth-tracker
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:3000).

## Explore

- **Log a walk** adds steps or miles to your real progress.
- Click a chapter or a named map location to explore its scene and story.
- **Play the journey** tours all 25 stops; **Pause tour** stops at the current chapter.
- **Return to my journey** brings you back to your saved walking position.
- Drag the 3D scene to orbit and scroll/pinch to zoom.

Existing progress uses the same `middle-earth-journey` localStorage key and is not reset. Browser storage is origin-specific: use the same deployed hostname as before to retain existing saves. New browsers keep the original 170-mile starting total and historical log. Previewing chapters never changes mileage or unlocks milestones.

Distances represent the original app's **1,779-mile adapted challenge**, not canonical geographic mileage. Outward milestones through Mount Doom remain unchanged. The return legs are scaled proportionally so the tracker finishes at Bag End at 1,779 miles; the Eagles leg costs no walking miles. Scenes are stylized regional dioramas, not geographically exact reconstructions.

## Checks

```sh
cd middle-earth-tracker
npm test
npm run typecheck
npm run lint
npm run build
```

Five automated tests cover route continuity, existing progress, milestone coordinates, the Eagle transition, and end-of-journey/invalid input boundaries. Browser verification covers desktop/mobile layouts, chapter exploration, tour playback/pause, step and mile entry, milestone unlocking, and persistence after reload.

The 3D view requires WebGL; the route map, chapter explorer, and logging remain usable without it. The interface honors reduced-motion preferences. Data stays on the current browser/device; there is no account sync or automatic step-counter integration.
