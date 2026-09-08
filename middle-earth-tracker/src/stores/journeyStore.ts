import { create } from "zustand";
import { persist } from "zustand/middleware";
import { JourneyState, LogEntry } from "@/types";
import { STEPS_PER_MILE } from "@/data/journey-segments";

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      milesTraveled: 170.0, // Current as of Feb 28, 2026
      stepsPerMile: STEPS_PER_MILE,
      challengeStartDate: "2026-01-01",
      journeyLog: [
        // Pre-loaded historical data through Feb 28, 2026
        { date: "2026-01-01", steps: 6720, miles: 3.2, cumulativeMiles: 3.2 },
        { date: "2026-01-02", steps: 6720, miles: 3.2, cumulativeMiles: 6.4 },
        { date: "2026-01-03", steps: 5250, miles: 2.5, cumulativeMiles: 8.9 },
        { date: "2026-01-04", steps: 5250, miles: 2.5, cumulativeMiles: 11.4 },
        { date: "2026-01-05", steps: 4830, miles: 2.3, cumulativeMiles: 13.7 },
        { date: "2026-01-06", steps: 7560, miles: 3.6, cumulativeMiles: 17.3 },
        { date: "2026-01-07", steps: 7560, miles: 3.6, cumulativeMiles: 20.9 },
        { date: "2026-01-08", steps: 4410, miles: 2.1, cumulativeMiles: 23.0 },
        { date: "2026-01-09", steps: 4410, miles: 2.1, cumulativeMiles: 25.1 },
        { date: "2026-01-10", steps: 10710, miles: 5.1, cumulativeMiles: 30.2 },
        { date: "2026-01-11", steps: 5460, miles: 2.6, cumulativeMiles: 32.8 },
        { date: "2026-01-12", steps: 5670, miles: 2.7, cumulativeMiles: 35.5 },
        {
          date: "2026-01-13",
          steps: 1806,
          miles: 0.86,
          cumulativeMiles: 36.36,
        },
        { date: "2026-01-14", steps: 3360, miles: 1.6, cumulativeMiles: 37.96 },
        { date: "2026-01-15", steps: 3570, miles: 1.7, cumulativeMiles: 39.66 },
        { date: "2026-01-16", steps: 3780, miles: 1.8, cumulativeMiles: 41.46 },
        { date: "2026-01-17", steps: 5250, miles: 2.5, cumulativeMiles: 43.96 },
        { date: "2026-01-18", steps: 4200, miles: 2.0, cumulativeMiles: 45.96 },
        { date: "2026-01-19", steps: 7560, miles: 3.6, cumulativeMiles: 49.56 },
        { date: "2026-01-20", steps: 2310, miles: 1.1, cumulativeMiles: 50.66 },
        { date: "2026-01-21", steps: 6090, miles: 2.9, cumulativeMiles: 53.56 },
        { date: "2026-01-22", steps: 4830, miles: 2.3, cumulativeMiles: 55.86 },
        { date: "2026-01-23", steps: 7770, miles: 3.7, cumulativeMiles: 59.56 },
        { date: "2026-01-24", steps: 5250, miles: 2.5, cumulativeMiles: 62.06 },
        { date: "2026-01-25", steps: 4620, miles: 2.2, cumulativeMiles: 64.26 },
        { date: "2026-01-26", steps: 3780, miles: 1.8, cumulativeMiles: 66.06 },
        { date: "2026-01-27", steps: 3780, miles: 1.8, cumulativeMiles: 67.86 },
        { date: "2026-01-28", steps: 2940, miles: 1.4, cumulativeMiles: 69.26 },
        { date: "2026-01-29", steps: 3150, miles: 1.5, cumulativeMiles: 70.76 },
        { date: "2026-01-30", steps: 3570, miles: 1.7, cumulativeMiles: 72.46 },
        { date: "2026-01-31", steps: 7980, miles: 3.8, cumulativeMiles: 76.26 },
        { date: "2026-02-01", steps: 3360, miles: 1.6, cumulativeMiles: 77.86 },
        { date: "2026-02-02", steps: 3990, miles: 1.9, cumulativeMiles: 79.76 },
        { date: "2026-02-03", steps: 5670, miles: 2.7, cumulativeMiles: 82.46 },
        { date: "2026-02-04", steps: 6090, miles: 2.9, cumulativeMiles: 85.36 },
        { date: "2026-02-05", steps: 4200, miles: 2.0, cumulativeMiles: 87.36 },
        {
          date: "2026-02-06",
          steps: 7264,
          miles: 3.46,
          cumulativeMiles: 90.82,
        },
        {
          date: "2026-02-07",
          steps: 11110,
          miles: 5.29,
          cumulativeMiles: 96.11,
        },
        {
          date: "2026-02-08",
          steps: 13937,
          miles: 6.64,
          cumulativeMiles: 102.75,
        },
        {
          date: "2026-02-09",
          steps: 5720,
          miles: 2.72,
          cumulativeMiles: 105.47,
        },
        {
          date: "2026-02-10",
          steps: 14089,
          miles: 6.71,
          cumulativeMiles: 112.18,
        },
        {
          date: "2026-02-11",
          steps: 13036,
          miles: 6.21,
          cumulativeMiles: 118.39,
        },
        {
          date: "2026-02-12",
          steps: 15517,
          miles: 7.39,
          cumulativeMiles: 125.78,
        },
        {
          date: "2026-02-13",
          steps: 13759,
          miles: 6.55,
          cumulativeMiles: 132.33,
        },
        {
          date: "2026-02-14",
          steps: 7674,
          miles: 3.65,
          cumulativeMiles: 135.98,
        },
        {
          date: "2026-02-15",
          steps: 3676,
          miles: 1.75,
          cumulativeMiles: 137.73,
        },
        {
          date: "2026-02-16",
          steps: 2273,
          miles: 1.08,
          cumulativeMiles: 138.81,
        },
        {
          date: "2026-02-17",
          steps: 4750,
          miles: 2.26,
          cumulativeMiles: 141.07,
        },
        {
          date: "2026-02-18",
          steps: 3200,
          miles: 1.52,
          cumulativeMiles: 142.59,
        },
        {
          date: "2026-02-19",
          steps: 4941,
          miles: 2.35,
          cumulativeMiles: 144.94,
        },
        {
          date: "2026-02-20",
          steps: 10535,
          miles: 5.02,
          cumulativeMiles: 149.96,
        },
        {
          date: "2026-02-21",
          steps: 7123,
          miles: 3.39,
          cumulativeMiles: 153.35,
        },
        {
          date: "2026-02-22",
          steps: 4080,
          miles: 1.94,
          cumulativeMiles: 155.29,
        },
        {
          date: "2026-02-23",
          steps: 5929,
          miles: 2.82,
          cumulativeMiles: 158.11,
        },
        {
          date: "2026-02-24",
          steps: 4716,
          miles: 2.25,
          cumulativeMiles: 160.36,
        },
        {
          date: "2026-02-25",
          steps: 7267,
          miles: 3.46,
          cumulativeMiles: 163.82,
        },
        {
          date: "2026-02-26",
          steps: 4820,
          miles: 2.3,
          cumulativeMiles: 166.12,
        },
        {
          date: "2026-02-27",
          steps: 4375,
          miles: 2.08,
          cumulativeMiles: 168.2,
        },
        {
          date: "2026-02-28",
          steps: 2346,
          miles: 1.12,
          cumulativeMiles: 169.32,
        },
      ] as LogEntry[],

      addProgress: (steps: number, date: string) => {
        if (
          !Number.isSafeInteger(steps) ||
          steps <= 0 ||
          !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
          !Number.isFinite(Date.parse(date))
        )
          return;
        const state = get();
        const miles = +(steps / state.stepsPerMile).toFixed(2);
        const cumulativeMiles = +(state.milesTraveled + miles).toFixed(2);
        set({
          milesTraveled: cumulativeMiles,
          journeyLog: [
            ...state.journeyLog,
            { date, steps, miles, cumulativeMiles },
          ],
        });
      },

      setMilesTraveled: (miles: number) => {
        if (Number.isFinite(miles) && miles >= 0) set({ milesTraveled: miles });
      },

      resetJourney: () => {
        set({ milesTraveled: 0, journeyLog: [] });
      },
    }),
    {
      name: "middle-earth-journey",
    },
  ),
);
