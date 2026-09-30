import { describe, expect, it } from "vitest"

import {
  coerceFilters,
  deals,
  DEFAULT_SORT_DIR,
  DEFAULT_SORT_KEY,
  filterOptions,
  matching,
  visibleDeals,
} from "./deals"
import { deltaTone, formatMoney } from "./format"

const COACHMEN_FIFTH_WHEELS = [
  ["Brookstone", "290RL"],
  ["Chaparral", "254RLS"],
  ["Chaparral", "27BAR"],
  ["Chaparral", "298RLS"],
  ["Chaparral", "30BHS"],
  ["Chaparral", "30RLS"],
  ["Chaparral", "336TSIK"],
  ["Chaparral", "360IBL"],
  ["Chaparral Lite", "218SE"],
  ["Chaparral Lite", "274BH"],
  ["Chaparral Lite", "30BHS"],
  ["Chaparral Lite", "30RLS"],
  ["Chaparral Lite", "31BH"],
  ["Phoenix Lite", "218SE"],
] as const

const EAST_TO_WEST_FIFTH_WHEELS = [
  ["Ahara", "297MK"],
  ["Ahara", "325RL"],
  ["Ahara", "365RL"],
  ["Tandara", "235ML"],
  ["Tandara", "295RL"],
] as const

const FOREST_RIVER_FIFTH_WHEELS = [
  ["Cardinal", "32LIVE"],
  ["Cardinal", "33CHEF"],
  ["Cedar Creek", "290RL"],
  ["Cedar Creek", "39RKB"],
  ["Cedar Creek Experience", "2925RL"],
  ["Cedar Creek Experience", "35RL"],
  ["Cedar Creek Silverback", "29RL"],
  ["Cherokee Arctic Wolf", "27SGS"],
  ["Cherokee Arctic Wolf", "285OPT"],
  ["Cherokee Arctic Wolf", "287BH"],
  ["Cherokee Arctic Wolf", "289PANO"],
  ["Cherokee Arctic Wolf", "3250 SUITE"],
  ["Cherokee Arctic Wolf", "331BH"],
  ["Cherokee Arctic Wolf", "3550 SUITE"],
  ["Columbus River Ranch", "394RKL"],
  ["Crusader", "KING33"],
  ["Impression", "235RW"],
  ["Impression", "242RD"],
  ["Impression", "301ML"],
  ["Impression", "315MB"],
  ["Impression", "318RL"],
  ["Rockwood Signature FW", "361RLS"],
  ["Rockwood Signature FW", "R374DBH"],
  ["Rockwood Signature", "281RK"],
  ["Rockwood Signature", "282RK"],
  ["Rockwood Signature", "290SFK"],
  ["Rockwood Signature", "301RKS"],
  ["Rockwood Signature", "301RK"],
  ["Rockwood Signature", "331RL"],
  ["Rockwood Signature", "361RL"],
  ["Rockwood Signature", "371RK"],
  ["Rockwood Signature", "372RL"],
  ["Rockwood Signature", "R331RL"],
  ["Rockwood Signature Fifth Wheel", "281RK"],
  ["Sabre", "25RLS"],
  ["Sabre", "32GKS"],
  ["Sabre", "33RLP"],
  ["Salem Hemisphere", "286RL"],
  ["Salem Hemisphere", "301FAM"],
  ["Salem Hemisphere", "321DRL"],
  ["Salem Hemisphere", "325RL"],
  ["Sandpiper", "3370RLS"],
  ["Sandstorm", "2710"],
  ["Sanibel", "34LOUNGE"],
  ["Sierra", "3370RLS"],
  ["Sierra", "3710HBFB"],
  ["Sierra", "3800RK"],
  ["Sierra", "3900HBLR"],
  ["Sierra", "4003MB"],
  ["Vengeance Rogue Armored", "341GS11"],
  ["Flagstaff Classic", "281RK"],
  ["Flagstaff Classic", "282RK"],
  ["Flagstaff Classic", "290CFK"],
  ["Flagstaff Classic", "301RKS"],
  ["Flagstaff Classic", "331RL"],
  ["Flagstaff Classic", "361RLS"],
  ["Flagstaff Classic", "371RK"],
  ["Flagstaff Classic", "372RL"],
  ["Flagstaff Classic", "374DBH"],
  ["Flagstaff Classic", "F282RK"],
  ["Wildcat", "32LIVE"],
  ["Wildcat", "33CHEF"],
  ["Wildcat", "35FL"],
  ["Wildcat", "36FUN"],
  ["Wildcat", "37GALLEY"],
  ["Wildcat XL", "30BAM"],
  ["Wildwood Heritage Glen", "286RL"],
  ["Wildwood Heritage Glen", "321DRL"],
] as const

describe("deal data", () => {
  it("keeps Coachmen and East To West rows and adds Forest River fifth wheels", () => {
    expect(deals).toHaveLength(335)
    expect(
      deals.filter((deal) => deal.manufacturer === "Coachmen")
    ).toHaveLength(262)
    expect(
      deals.filter((deal) => deal.manufacturer === "East To West")
    ).toHaveLength(5)
    expect(
      deals.filter((deal) => deal.manufacturer === "Forest River")
    ).toHaveLength(68)
    expect(new Set(deals.map((deal) => deal.manufacturer))).toEqual(
      new Set(["Coachmen", "East To West", "Forest River"])
    )
    expect(new Set(deals.map((deal) => deal.year))).toEqual(new Set([2026]))
    expect(deals.some((deal) => deal.model === "Adrenaline")).toBe(true)
    expect(deals.some((deal) => deal.model === "Viking")).toBe(true)
    expect(deals.some((deal) => deal.model === "Other")).toBe(false)
  })

  it("lists every Coachmen, East To West, and Forest River fifth-wheel floor plan", () => {
    for (const [model, floor] of COACHMEN_FIFTH_WHEELS) {
      expect(
        deals.some(
          (deal) =>
            deal.manufacturer === "Coachmen" &&
            deal.model === model &&
            deal.floor === floor
        )
      ).toBe(true)
    }

    const etw = deals.filter((deal) => deal.manufacturer === "East To West")
    expect(etw).toHaveLength(5)
    expect(etw.map((deal) => [deal.model, deal.floor])).toEqual(
      EAST_TO_WEST_FIFTH_WHEELS.map(([model, floor]) => [model, floor])
    )
    expect(
      etw.every(
        (deal) =>
          deal.ask == null &&
          deal.trade == null &&
          deal.delta == null &&
          deal.dealer === ""
      )
    ).toBe(true)

    const forest = deals.filter((deal) => deal.manufacturer === "Forest River")
    expect(forest).toHaveLength(FOREST_RIVER_FIFTH_WHEELS.length)
    expect(forest.map((deal) => [deal.model, deal.floor])).toEqual(
      FOREST_RIVER_FIFTH_WHEELS.map(([model, floor]) => [model, floor])
    )
    expect(
      forest.every(
        (deal) =>
          deal.year === 2026 &&
          deal.ask == null &&
          deal.trade == null &&
          deal.delta == null &&
          deal.dealer === "" &&
          deal.notes.length === 0
      )
    ).toBe(true)
  })

  it("keeps priced Brookstone and Chaparral rows without inventing values", () => {
    const priced = deals.filter((deal) => deal.ask != null)
    expect(priced).toHaveLength(4)

    const brookstone = deals.find(
      (deal) => deal.model === "Brookstone" && deal.floor === "290RL"
    )
    expect(brookstone).toMatchObject({
      ask: 59998,
      trade: 65250,
      delta: -5252,
      dealer: "Camping World, Kodak TN",
    })

    const chaparral254 = deals.find(
      (deal) => deal.model === "Chaparral" && deal.floor === "254RLS"
    )
    expect(chaparral254).toMatchObject({
      ask: 56995,
      trade: 43830,
      delta: 13165,
      dealer: "First Class RV & Marine, Lake Havasu City, AZ",
    })

    const chaparral298 = deals.find(
      (deal) => deal.model === "Chaparral" && deal.floor === "298RLS"
    )
    expect(chaparral298).toMatchObject({
      ask: 54989,
      trade: 55575,
      delta: -586,
      dealer: "AOK RV Sales, Gravois Mills, MO",
    })

    const chaparralLite = deals.find(
      (deal) => deal.model === "Chaparral Lite" && deal.floor === "274BH"
    )
    expect(chaparralLite).toMatchObject({
      ask: 46250,
      dealer: "Byerly RV, Eureka, MO",
      trade: null,
      delta: null,
    })
  })
})

describe("filters and sort", () => {
  it("cascades model options from the selected manufacturer", () => {
    const options = filterOptions(deals, {
      manufacturer: "Coachmen",
      year: "",
      model: "",
    })
    expect(options.model).toContain("Brookstone")
    expect(options.model).toContain("Chaparral")
    expect(options.year).toEqual(["2026"])
  })

  it("drops a model that is no longer valid after another filter changes", () => {
    const next = coerceFilters(
      { manufacturer: "Coachmen", year: "2026", model: "Missing" },
      filterOptions(deals, {
        manufacturer: "Coachmen",
        year: "2026",
        model: "",
      })
    )
    expect(next.model).toBe("")
  })

  it("defaults to delta ascending and sorts empty numerics last", () => {
    const rows = visibleDeals(
      deals,
      { manufacturer: "", year: "", model: "" },
      DEFAULT_SORT_KEY,
      DEFAULT_SORT_DIR
    )
    const priced = rows.filter((deal) => deal.delta != null)
    const empty = rows.filter((deal) => deal.delta == null)
    expect(priced.map((deal) => deal.delta)).toEqual([-5252, -586, 13165])
    expect(empty.length).toBe(332)
    expect(rows.slice(-empty.length).every((deal) => deal.delta == null)).toBe(
      true
    )
  })

  it("filters by model", () => {
    const rows = matching(deals, {
      manufacturer: "",
      year: "",
      model: "Chaparral",
    })
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((deal) => deal.model === "Chaparral")).toBe(true)
  })

  it("searches make, model, and floor plan case-insensitively", () => {
    const byModel = visibleDeals(
      deals,
      { manufacturer: "", year: "", model: "" },
      DEFAULT_SORT_KEY,
      DEFAULT_SORT_DIR,
      "chaparral"
    )
    expect(byModel.length).toBeGreaterThan(0)
    expect(
      byModel.every(
        (deal) =>
          deal.model.toLowerCase().includes("chaparral") ||
          deal.manufacturer.toLowerCase().includes("chaparral") ||
          deal.floor.toLowerCase().includes("chaparral")
      )
    ).toBe(true)

    const byFloor = visibleDeals(
      deals,
      { manufacturer: "", year: "", model: "" },
      DEFAULT_SORT_KEY,
      DEFAULT_SORT_DIR,
      "254rls"
    )
    expect(byFloor.map((deal) => [deal.model, deal.floor])).toEqual([
      ["Chaparral", "254RLS"],
    ])

    const byMake = visibleDeals(
      deals,
      { manufacturer: "", year: "", model: "" },
      DEFAULT_SORT_KEY,
      DEFAULT_SORT_DIR,
      "east to"
    )
    expect(byMake).toHaveLength(5)
    expect(byMake.every((deal) => deal.manufacturer === "East To West")).toBe(
      true
    )

    const byForest = visibleDeals(
      deals,
      { manufacturer: "", year: "", model: "" },
      DEFAULT_SORT_KEY,
      DEFAULT_SORT_DIR,
      "forest river"
    )
    expect(byForest).toHaveLength(68)
    expect(byForest.every((deal) => deal.manufacturer === "Forest River")).toBe(
      true
    )
  })

  it("ANDs text search with dropdown filters", () => {
    const rows = visibleDeals(
      deals,
      { manufacturer: "Coachmen", year: "", model: "Chaparral" },
      DEFAULT_SORT_KEY,
      DEFAULT_SORT_DIR,
      "254"
    )
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      manufacturer: "Coachmen",
      model: "Chaparral",
      floor: "254RLS",
      ask: 56995,
      trade: 43830,
      delta: 13165,
    })

    const empty = visibleDeals(
      deals,
      { manufacturer: "East To West", year: "", model: "" },
      DEFAULT_SORT_KEY,
      DEFAULT_SORT_DIR,
      "Chaparral"
    )
    expect(empty).toHaveLength(0)
  })

  it("cascades East To West models and keeps those rows unpriced", () => {
    const options = filterOptions(deals, {
      manufacturer: "East To West",
      year: "",
      model: "",
    })
    expect(options.model).toEqual(["Ahara", "Tandara"])
    const rows = matching(deals, {
      manufacturer: "East To West",
      year: "",
      model: "Ahara",
    })
    expect(rows).toHaveLength(3)
    expect(rows.every((deal) => deal.ask == null)).toBe(true)
  })

  it("cascades Forest River models and keeps those rows unpriced", () => {
    const options = filterOptions(deals, {
      manufacturer: "Forest River",
      year: "",
      model: "",
    })
    expect(options.manufacturer).toEqual([
      "Coachmen",
      "East To West",
      "Forest River",
    ])
    expect(options.model).toContain("Flagstaff Classic")
    expect(options.model).toContain("Cherokee Arctic Wolf")
    expect(options.model).toContain("Wildcat XL")
    expect(options.model).not.toContain("Other")
    expect(options.model).not.toContain("Brookstone")

    const rows = matching(deals, {
      manufacturer: "Forest River",
      year: "",
      model: "Flagstaff Classic",
    })
    expect(rows).toHaveLength(10)
    expect(rows.every((deal) => deal.ask == null && deal.delta == null)).toBe(
      true
    )
    expect(rows.map((deal) => deal.floor)).toEqual([
      "281RK",
      "282RK",
      "290CFK",
      "301RKS",
      "331RL",
      "361RLS",
      "371RK",
      "372RL",
      "374DBH",
      "F282RK",
    ])
  })
})

describe("money format", () => {
  it("matches the existing table punctuation", () => {
    expect(formatMoney(59998)).toBe("$59,998")
    expect(formatMoney(-5252)).toBe("−$5,252")
    expect(formatMoney(13165)).toBe("$13,165")
    expect(formatMoney(null)).toBe("")
  })

  it("classifies delta color without changing values", () => {
    expect(deltaTone(13165)).toBe("positive")
    expect(deltaTone(-5252)).toBe("negative")
    expect(deltaTone(-586)).toBe("negative")
    expect(deltaTone(null)).toBe("neutral")
    expect(deltaTone(0)).toBe("neutral")
  })
})
