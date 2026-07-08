import type { Recipe } from "./types"

/**
 * Additional bundled recipes beyond the original seven.
 * Every recipe is factually attributable; parameters verified against
 * public method descriptions (creator videos, official method pages).
 * All step text is original phrasing, not reproduced from sources.
 */
export const EXTRA_RECIPES: Recipe[] = [
  {
    // Source: James Hoffmann, "A Better 1 Cup V60 Technique" (YouTube, Nov 2022).
    // 15g : 250g, five 50g pours, boiling water for light roasts, ~3:00 total.
    id: "hoffmann-1cup",
    method: "v60",
    name: "Better 1 Cup",
    author: "James Hoffmann",
    roast: "light",
    doseG: 15,
    waterG: 250,
    tempC: 100,
    whyLine: "Hoffmann's updated single cup: five small pours keep the slurry hot for a sweeter, more even extraction.",
    steps: [
      { label: "Bloom", detail: "50g to wet everything. Swirl. Rest to 0:45.", seconds: 45, waterTargetG: 50, why: "A swirl during the bloom leaves no dry pockets behind." },
      { label: "Second pour", detail: "Slowly up to 100g, about 15 seconds.", seconds: 25, waterTargetG: 100, why: "Go gentler here; the bed is still fragile right after the bloom." },
      { label: "Third pour", detail: "Up to 150g in 10 seconds. Brief rest.", seconds: 20, waterTargetG: 150 },
      { label: "Fourth pour", detail: "Up to 200g in 10 seconds. Brief rest.", seconds: 20, waterTargetG: 200 },
      { label: "Final pour", detail: "Up to 250g in 10 seconds.", seconds: 20, waterTargetG: 250 },
      { label: "Swirl and drawdown", detail: "Gentle swirl. Finish near 3:00.", seconds: 50, waterTargetG: 250, why: "If drawdown runs long past 3:00, grind a touch coarser next time." },
    ],
  },
  {
    // Source: Matt Winton (2021 World Brewers Cup champion), Hario "V60 Five-Pour
    // Recipe" video. 20g : 300g at 93C, five equal 60g pours, medium-coarse grind,
    // aggressive pouring instead of stirring, ~3:30 total.
    id: "winton-five-pour",
    method: "v60",
    name: "Winton Five Pour",
    author: "Matt Winton",
    roast: "light",
    doseG: 20,
    waterG: 300,
    tempC: 93,
    whyLine: "The 2021 World Brewers Cup winner: kettle agitation instead of stirring, tuned for clarity and body at once.",
    steps: [
      { label: "First pour", detail: "60g fast, center then outward. Wait 30s.", seconds: 35, waterTargetG: 60, why: "Pouring hard from a little height does the stirring for you." },
      { label: "Second pour", detail: "Up to 120g when dripping slows.", seconds: 35, waterTargetG: 120, why: "Let the bed nearly drain before each pour so every ground gets fresh water." },
      { label: "Third pour", detail: "Up to 180g, same rhythm.", seconds: 35, waterTargetG: 180 },
      { label: "Fourth pour", detail: "Up to 240g, same rhythm.", seconds: 35, waterTargetG: 240 },
      { label: "Final pour", detail: "Up to 300g. Full drawdown.", seconds: 70, waterTargetG: 300, why: "Use a medium-coarse grind; sour and fast means finer, bitter and slow means coarser." },
    ],
  },
  {
    // Source: Alan Adler's original recipe from the official AeroPress instructions.
    // One scoop (about 15g), 175F (80C) water to the 1 mark (about 90g), stir 10s,
    // gentle 20 to 30 second press, dilute the concentrate to taste.
    id: "adler-original",
    method: "aeropress",
    name: "The Adler Original",
    author: "Alan Adler",
    roast: "medium",
    doseG: 15,
    waterG: 90,
    tempC: 80,
    whyLine: "The inventor's own recipe: a one minute low-temperature concentrate built to avoid bitterness.",
    steps: [
      { label: "Setup", detail: "Filter in cap, chamber on mug, coffee in.", seconds: 15, why: "The low 80C water is the signature; Adler picked it to keep bitterness out." },
      { label: "Pour", detail: "90g of water, up to the 1 mark.", seconds: 10, waterTargetG: 90 },
      { label: "Stir", detail: "Stir for 10 seconds.", seconds: 10, waterTargetG: 90 },
      { label: "Press", detail: "Gently, 20 to 30 seconds.", seconds: 30, waterTargetG: 90, why: "Rest your hands on the plunger and let their weight do the work." },
      { label: "Dilute", detail: "Top up with hot water to taste.", seconds: 15 },
    ],
  },
  {
    // Source: James Hoffmann, "The Ultimate AeroPress Technique" (YouTube).
    // 11g : 200g, water just off the boil for light roasts, no filter rinse,
    // upright with the plunger seated to hold a vacuum, 2:00 steep, swirl,
    // 30s rest, gentle 30s press.
    id: "hoffmann-aeropress",
    method: "aeropress",
    name: "Ultimate AeroPress",
    author: "James Hoffmann",
    roast: "light",
    doseG: 11,
    waterG: 200,
    tempC: 100,
    whyLine: "A long, still steep at a filter-coffee ratio: trades punch for clarity and sweetness.",
    steps: [
      { label: "Pour", detail: "Coffee in, all 200g, wet every ground.", seconds: 15, waterTargetG: 200, why: "Skip the filter rinse and preheat; testing showed neither changes the cup." },
      { label: "Seal and steep", detail: "Plunger 1cm in. Wait 2 minutes.", seconds: 120, waterTargetG: 200, why: "The plunger holds a vacuum that stops dripping, so upright works fine." },
      { label: "Swirl and settle", detail: "Gentle swirl. Rest 30 seconds.", seconds: 30, waterTargetG: 200, why: "The swirl sinks floating grounds so the press starts from a settled bed." },
      { label: "Press", detail: "Slow and gentle, about 30 seconds.", seconds: 30, waterTargetG: 200 },
    ],
  },
  {
    // Source: common immersion cold brew guidance (Coffee Rambler, Barista At Home,
    // and similar brew guides): 1:10 ratio, extra coarse grind, 8 to 12 hours at
    // room temperature, refrigerate immediately after straining.
    id: "coldbrew-room-temp",
    method: "coldbrew",
    name: "Room Temp Batch",
    author: "Community",
    roast: "medium",
    doseG: 60,
    waterG: 600,
    tempC: null,
    whyLine: "Ready to drink straight from the strainer: a 1:10 counter-top steep with no dilution math.",
    steps: [
      { label: "Combine", detail: "Extra coarse coffee and water in a jar.", seconds: 30, waterTargetG: 600 },
      { label: "Stir and cover", detail: "Saturate everything. Lid on.", seconds: 15, waterTargetG: 600, why: "Room temperature extracts faster than the fridge, so 8 to 12 hours is plenty." },
      { label: "Steep", detail: "On the counter, 8 to 12 hours.", seconds: 36000, waterTargetG: 600 },
      { label: "Strain", detail: "Mesh first, then a paper filter.", seconds: 180, waterTargetG: 600, why: "Never squeeze the grounds; pressing pushes bitter fines through." },
      { label: "Chill", detail: "Refrigerate right away. Keeps a week.", seconds: 15 },
    ],
  },
]
