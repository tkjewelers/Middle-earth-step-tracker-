import { FormEvent, useEffect, useRef, useState } from "react";
import JourneyScene, { landscapeFor } from "@/components/three/JourneyScene";
import { useJourneyStore } from "@/stores/journeyStore";
import { JOURNEY_SEGMENTS, TOTAL_JOURNEY_MILES } from "@/data/journey-segments";
import { LOCATIONS } from "@/data/locations";
import { getPositionOnPath } from "@/utils/interpolate";

const stops = [
  { name: "Bag End", miles: 0, segment: null },
  ...JOURNEY_SEGMENTS.map((segment) => ({
    name: segment.to,
    miles: segment.cumulative,
    segment,
  })),
];
const number = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 1 });
const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
function RouteMap({
  miles,
  selected,
  onSelect,
}: {
  miles: number;
  selected: number | null;
  onSelect: (i: number) => void;
}) {
  const point = (name: string) => {
    const l = LOCATIONS[name];
    return [35 + (l.x + 60) * 2.35, 35 + (l.z + 18) * 2.65];
  };
  const position = getPositionOnPath(miles).worldPosition;
  const x = 35 + (position.x + 60) * 2.35,
    y = 35 + (position.z + 18) * 2.65;
  const [fx, fy] = selected === null ? [x, y] : point(stops[selected].name);
  return (
    <svg
      className="route-map"
      viewBox="0 0 400 250"
      role="group"
      aria-label="Middle-earth route map. Gold marks your current position. Use the chapter buttons to explore each stop."
    >
      <defs>
        <radialGradient id="mapGlow">
          <stop stopColor="#78957a" stopOpacity=".15" />
          <stop offset="1" stopColor="#78957a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="250" fill="url(#mapGlow)" />
      <path
        d="M205 10 Q198 70 237 112 T247 229"
        fill="none"
        stroke="#496360"
        strokeWidth="3"
        opacity=".5"
      />
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={`M${190 + i * 4} ${15 + i * 14}l8 -15 10 16`}
          fill="none"
          stroke="#78776a"
          opacity=".35"
        />
      ))}
      <text x="36" y="17">
        THE SHIRE
      </text>
      <text x="95" y="151">
        ERIADOR
      </text>
      <text x="207" y="226">
        ROHAN
      </text>
      <text x="304" y="211">
        MORDOR
      </text>
      {JOURNEY_SEGMENTS.map((s) => (
        <path
          key={s.id}
          d={`M${point(s.from).join(" ")} L${point(s.to).join(" ")}`}
          stroke={miles >= s.cumulative ? "#c5b478" : "#6f7568"}
          strokeWidth={s.id > 19 ? 1 : 1.6}
          strokeDasharray={miles >= s.cumulative ? "0" : "3 4"}
          fill="none"
          opacity={s.id > 19 ? 0.5 : 1}
        />
      ))}
      {stops.slice(0, 19).map((stop, i) => {
        const [px, py] = point(stop.name);
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={selected === i ? 6 : 3}
            fill={miles >= stop.miles ? "#d5c38b" : "#343c33"}
            stroke="#a7ab8d"
          />
        );
      })}
      <circle cx={x} cy={y} r="9" fill="#e9c978" opacity=".18" />
      <circle cx={x} cy={y} r="4" fill="#eed694" stroke="#fff1c8" />
      {selected !== null && (
        <circle
          cx={point(stops[selected].name)[0]}
          cy={point(stops[selected].name)[1]}
          r="8"
          fill="none"
          stroke="#eee3ba"
          strokeDasharray="3 2"
        />
      )}
      {[0, 3, 5, 8, 18].map((i) => {
        const [px, py] = point(stops[i].name);
        return (
          <g
            key={i}
            onClick={() => onSelect(i)}
            role="button"
            tabIndex={0}
            aria-label={`Explore ${stops[i].name}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(i);
              }
            }}
            className="map-stop"
          >
            <rect
              x={px - 10}
              y={py - 10}
              width="65"
              height="30"
              fill="transparent"
            />
            <text x={px + 7} y={py - 7} className="map-name">
              {stops[i].name}
            </text>
          </g>
        );
      })}
      <g
        className="map-companions"
        style={{ transform: `translate(${fx}px, ${fy - 15}px)` }}
        aria-label={
          selected === null
            ? "Frodo and Sam at your walking position"
            : "Frodo and Sam at the explored milestone"
        }
      >
        <circle cx="-7" cy="0" r="7" fill="#66868b" stroke="#d8e0cb" />
        <text x="-7" y="3" textAnchor="middle" className="companion-letter">
          F
        </text>
        <circle cx="7" cy="0" r="7" fill="#8b6442" stroke="#d8e0cb" />
        <text x="7" y="3" textAnchor="middle" className="companion-letter">
          S
        </text>
      </g>
      <text x="359" y="28" className="compass">
        N ↑
      </text>
    </svg>
  );
}
export default function App() {
  const { milesTraveled, journeyLog, addProgress, stepsPerMile } =
    useJourneyStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [tour, setTour] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [walkOpen, setWalkOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("steps");
  const [date, setDate] = useState(localDate());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [walking, setWalking] = useState(false);
  const logRef = useRef<HTMLDialogElement>(null);
  const walkButton = useRef<HTMLButtonElement>(null);
  const chapterStrip = useRef<HTMLDivElement>(null);
  const actual = getPositionOnPath(milesTraveled);
  const complete = milesTraveled >= TOTAL_JOURNEY_MILES;
  const currentIndex = complete ? stops.length - 1 : actual.segment.id;
  const sceneIndex = selected ?? currentIndex;
  const stop = stops[sceneIndex];
  const segment = stop.segment;
  const location = LOCATIONS[stop.name];
  const next = stops.find((s) => s.miles > milesTraveled);
  const percent = Math.min(100, (milesTraveled / TOTAL_JOURNEY_MILES) * 100);
  const unlocked = stops.filter((s) => s.miles <= milesTraveled).length;
  const explore = (i: number) => {
    setTour(false);
    setSelected(i);
  };
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = () => setReduced(q.matches);
    q.addEventListener("change", listener);
    return () => q.removeEventListener("change", listener);
  }, []);
  useEffect(() => {
    if (!tour) return;
    const timer = window.setInterval(() => {
      setSelected((i) => {
        const n = (i ?? 0) + 1;
        if (n >= stops.length) {
          setTour(false);
          return stops.length - 1;
        }
        return n;
      });
    }, 5500);
    return () => clearInterval(timer);
  }, [tour]);
  useEffect(() => {
    const strip = chapterStrip.current;
    const item = strip?.querySelector<HTMLElement>('[aria-current="step"]');
    if (strip && item) {
      const left =
        strip.scrollLeft +
        item.getBoundingClientRect().left -
        strip.getBoundingClientRect().left -
        strip.clientWidth / 2 +
        item.clientWidth / 2;
      strip.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
    }
  }, [sceneIndex, reduced]);
  useEffect(() => {
    if (walkOpen) logRef.current?.showModal();
    else logRef.current?.close();
  }, [walkOpen]);
  useEffect(() => {
    if (!walking) return;
    const timer = setTimeout(() => setWalking(false), 6500);
    return () => clearTimeout(timer);
  }, [walking]);
  const closeDialog = () => {
    setWalkOpen(false);
    walkButton.current?.focus();
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = Number(amount);
    const steps = unit === "steps" ? value : Math.round(value * stepsPerMile);
    if (
      !Number.isFinite(value) ||
      value <= 0 ||
      !Number.isSafeInteger(steps) ||
      steps <= 0
    ) {
      setError(
        "Enter a positive number of whole steps, or a distance in miles.",
      );
      return;
    }
    if (!date || date > localDate() || !Number.isFinite(Date.parse(date))) {
      setError("Choose today or an earlier date.");
      return;
    }
    const added = +(steps / stepsPerMile).toFixed(2);
    if (added <= 0) {
      setError("Enter at least 11 steps (0.01 miles).");
      return;
    }
    const crossed = stops.filter(
      (s) => s.miles > milesTraveled && s.miles <= milesTraveled + added,
    );
    addProgress(steps, date);
    setSelected(null);
    setTour(false);
    setWalking(true);
    setAmount("");
    setError("");
    closeDialog();
    setMessage(
      crossed.length
        ? `${number(added)} miles added. Milestone reached: ${crossed.map((s) => s.name).join(", ")}!`
        : `${number(added)} miles added. Frodo and Sam are on their way.`,
    );
  };
  return (
    <div className="app-shell">
      <header className="masthead">
        <a className="brand" href="#">
          <span className="ring-mark">◌</span>
          <span>
            MIDDLE-EARTH<small>A WALKING ADVENTURE</small>
          </span>
        </a>
        <div className="header-note">Every step is part of the story.</div>
        <button
          className="primary"
          ref={walkButton}
          onClick={() => {
            setTour(false);
            setError("");
            setWalkOpen(true);
          }}
        >
          ＋ Log a walk
        </button>
      </header>
      <main>
        <div className="intro">
          <div>
            <div className="eyebrow">THERE AND BACK AGAIN</div>
            <h1>A little further, together.</h1>
            <p>From the green hills of the Shire to the fires of Mount Doom.</p>
          </div>
          <div className="companions">
            <span className="portrait frodo">F</span>
            <span className="portrait sam">S</span>
            <div>
              Frodo & Sam<small>Your companions on the road</small>
            </div>
          </div>
        </div>
        <section className="stats" aria-label="Walking progress">
          <div>
            <span className="stat-label">DISTANCE WALKED</span>
            <strong>
              {number(milesTraveled)}
              <small> mi</small>
            </strong>
          </div>
          <div>
            <span className="stat-label">THE JOURNEY</span>
            <strong>
              {percent.toFixed(1)}
              <small>%</small>
            </strong>
            <div className="thin-progress">
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
          <div>
            <span className="stat-label">MILESTONES REACHED</span>
            <strong>
              {unlocked}
              <small> / {stops.length}</small>
            </strong>
          </div>
          <div>
            <span className="stat-label">
              {next ? "NEXT MILESTONE" : "WELCOME HOME"}
            </span>
            <strong className="next-name">
              {next
                ? `${number(next.miles - milesTraveled)} mi`
                : "Journey complete"}
            </strong>
            <small>{next?.name ?? "There and back again"}</small>
          </div>
        </section>
        <div className="adventure-grid">
          <section
            className={`scene-card ${landscapeFor(stop.name)}`}
            aria-label="Journey scene"
          >
            <JourneyScene
              name={stop.name}
              moving={tour || walking}
              reduced={reduced}
            />
            <div className="scene-top">
              <span className="scene-tag">
                <i />
                {selected === null ? "YOUR JOURNEY" : "EXPLORING THE STORY"}
              </span>
              <button
                className="glass"
                onClick={() => {
                  if (tour) setTour(false);
                  else {
                    setSelected(0);
                    setTour(true);
                  }
                }}
              >
                {tour ? "Ⅱ Pause tour" : "▷ Play the journey"}
              </button>
            </div>
            <div className="scene-caption">
              <div className="eyebrow">
                {location.region.toUpperCase()} · CHAPTER{" "}
                {String(sceneIndex + 1).padStart(2, "0")}
              </div>
              <h2>
                {selected === null && !complete
                  ? `On the road to ${stop.name}`
                  : stop.name}
              </h2>
              <p>
                {selected !== null
                  ? `${number(stop.miles)} miles · ${stop.miles <= milesTraveled ? "Reached on your journey" : "A chapter still ahead"}`
                  : complete
                    ? "Home again, with a story to tell."
                    : `${actual.segment.from} → ${actual.segment.to}`}
              </p>
            </div>
            <div className="scene-controls">
              <span>Drag to orbit · Scroll to zoom</span>
              <div className="figure-legend">
                <i className="frodo-dot" /> Frodo <i className="sam-dot" /> Sam
              </div>
            </div>
          </section>
          <aside className="story-panel">
            <div className="panel-heading">
              <span className="eyebrow">THE ROAD AHEAD</span>
              <span className="map-symbol">⌖</span>
            </div>
            <RouteMap
              miles={milesTraveled}
              selected={selected}
              onSelect={explore}
            />
            <div className="map-legend">
              <i /> Your walking position <span>— — The road ahead</span>
            </div>
            <div className="story-copy">
              <div className="eyebrow">
                {selected === null
                  ? "WHERE THE STORY TAKES YOU"
                  : "CHAPTER NOTES"}
              </div>
              <h3>{segment?.chapter ?? "An unexpected first step"}</h3>
              <p>
                {segment?.context ??
                  "The adventure begins at Bag End. Frodo and Sam leave the familiar paths of the Shire behind. Log your first walk, or explore the chapters to see the road ahead."}
              </p>
              {segment && (
                <details key={sceneIndex}>
                  <summary>
                    Moments in this chapter <span>＋</span>
                  </summary>
                  <ul>
                    {segment.keyEvents.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                  <small>From {segment.book}</small>
                </details>
              )}
            </div>
          </aside>
        </div>
        <section className="chapters">
          <div className="section-title">
            <div>
              <div className="eyebrow">ONE STEP. ONE CHAPTER.</div>
              <h2>Your road through Middle-earth</h2>
            </div>
            <button
              className="secondary"
              onClick={() => {
                setSelected(null);
                setTour(false);
              }}
            >
              ⌖ Return to my journey
            </button>
          </div>
          <div
            className="chapter-strip"
            ref={chapterStrip}
            aria-label="Journey milestones"
          >
            {stops.map((s, i) => (
              <button
                key={i}
                className={`chapter ${sceneIndex === i ? "active" : ""} ${milesTraveled >= s.miles ? "reached" : ""}`}
                aria-current={sceneIndex === i ? "step" : undefined}
                onClick={() => explore(i)}
              >
                <span className="chapter-top">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{milesTraveled >= s.miles ? "✓" : "◇"}</span>
                </span>
                <strong>
                  {s.name}
                  {i > 19 && s.name === "Rivendell" ? " · return" : ""}
                  {i === 24 ? " · home" : ""}
                </strong>
                <span>{number(s.miles)} mi</span>
              </button>
            ))}
          </div>
          <div className="chapter-navigation">
            <button
              className="text-button"
              disabled={sceneIndex === 0}
              onClick={() => explore(sceneIndex - 1)}
            >
              ← Previous chapter
            </button>
            <span>
              {sceneIndex + 1} / {stops.length} ·{" "}
              {tour ? "Tour playing" : "Select a milestone to explore"}
            </span>
            <button
              className="text-button"
              disabled={sceneIndex === stops.length - 1}
              onClick={() => explore(sceneIndex + 1)}
            >
              Next chapter →
            </button>
          </div>
        </section>
        <section className="journal">
          <div>
            <div className="eyebrow">YOUR TRAVEL JOURNAL</div>
            <h2>Small walks. A great adventure.</h2>
            <p>Your latest steps, saved on this device.</p>
          </div>
          <div className="journal-entries">
            {journeyLog
              .slice(-3)
              .reverse()
              .map((entry, i) => (
                <div className="journal-entry" key={`${entry.date}-${i}`}>
                  <span className="journal-icon">↗</span>
                  <div>
                    <strong>
                      {new Date(entry.date + "T12:00:00").toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </strong>
                    <small>{number(entry.steps)} steps</small>
                  </div>
                  <span>+{number(entry.miles)} mi</span>
                </div>
              ))}
            {journeyLog.length === 0 && (
              <p>Your first walk starts the next chapter.</p>
            )}
          </div>
        </section>
        <div className="status" role="status" aria-live="polite">
          {message && (
            <>
              <span>{message}</span>
              <button
                className="text-button"
                aria-label="Dismiss walk confirmation"
                onClick={() => setMessage("")}
              >
                ✕
              </button>
            </>
          )}
        </div>
      </main>
      <footer>
        <span>THE ROAD GOES EVER ON</span>
        <span>
          1,779-mile adapted challenge · {number(stepsPerMile)} steps / mile
        </span>
        <details>
          <summary>About this journey</summary>
          <p>
            A fan-made walking challenge. Distances and scenes are illustrative,
            not canonical geography. Original outward milestones are preserved;
            return legs are proportionally adjusted to finish at 1,779 miles.
            Chapter exploration does not change your saved progress. Progress is
            stored in this browser, with no automatic step sync.
          </p>
        </details>
      </footer>
      <dialog
        ref={logRef}
        onCancel={() => setWalkOpen(false)}
        onClose={() => setWalkOpen(false)}
        className="walk-dialog"
      >
        <form onSubmit={submit}>
          <div className="dialog-top">
            <span className="eyebrow">EVERY STEP COUNTS</span>
            <button
              type="button"
              className="text-button"
              aria-label="Close log a walk"
              onClick={closeDialog}
            >
              ✕
            </button>
          </div>
          <h2>Add to your adventure</h2>
          <p>Give Frodo and Sam a little more road.</p>
          <label htmlFor="walk-unit">Log your walk in</label>
          <select
            id="walk-unit"
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value);
              setAmount("");
            }}
          >
            <option value="steps">Steps</option>
            <option value="miles">Miles</option>
          </select>
          <label htmlFor="walk-amount">
            {unit === "steps" ? "Steps walked" : "Miles walked"}
          </label>
          <input
            id="walk-amount"
            autoFocus
            type="number"
            min={unit === "steps" ? 11 : 0.01}
            step={unit === "steps" ? 1 : 0.01}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={unit === "steps" ? "e.g. 6300" : "e.g. 3"}
          />
          <label htmlFor="walk-date">Walk date</label>
          <input
            id="walk-date"
            type="date"
            max={localDate()}
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <p className="input-hint">
            {number(stepsPerMile)} steps = 1 mile. This adds to your existing
            total.
          </p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button className="primary" type="submit">
            Add walk →
          </button>
        </form>
      </dialog>
    </div>
  );
}
