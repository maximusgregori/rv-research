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

const JAYCO_FIFTH_WHEELS = [
  ["Eagle", "28CRT"],
  ["Eagle", "321RSTS"],
  ["Eagle", "325MKTS"],
  ["Eagle", "335LSTS"],
  ["Eagle", "355MBQS"],
  ["Eagle", "365UKTS"],
  ["Eagle HT", "25RUC"],
  ["Eagle HT", "26REC"],
  ["Eagle HT", "27MLC"],
  ["Eagle HT", "28CRT"],
  ["Eagle HT", "29DDB"],
  ["Eagle HT", "29RLC"],
  ["Eagle HT", "30CRT"],
  ["Eagle HT", "31QCD"],
  ["Eagle SLE", "24MLE"],
  ["Eagle SLE", "28BHU"],
  ["Eagle SLE", "28RKS"],
  ["Eagle SLE", "30RLT"],
  ["North Point", "310RLTS"],
  ["Pinnacle", "32RLTS"],
] as const

const KEYSTONE_FIFTH_WHEELS = [
  ["Alpine", "3011CK"],
  ["Alpine", "3100 RE"],
  ["Alpine", "3100RE"],
  ["Alpine", "3303CK"],
  ["Alpine Avalanche Edition", "321RL"],
  ["Alpine Avalanche Edition", "338GK"],
  ["Arcadia", "3260RL"],
  ["Arcadia Select", "21SRK"],
  ["Arcadia Select", "24SRE"],
  ["Arcadia Select", "25SRD"],
  ["Arcadia Select", "27SBH"],
  ["Arcadia Select", "28SLS"],
  ["Arcadia Super Lite", "242SLMD"],
  ["Arcadia Super Lite", "260SLCL"],
  ["Arcadia Super Lite", "292SLRL"],
  ["Arcadia Super Lite", "294SLRD"],
  ["Arcadia Super Lite", "308SLBH"],
  ["Avalanche", "302RS"],
  ["Avalanche", "321RL"],
  ["Cougar", "24RDS"],
  ["Cougar", "260MLE"],
  ["Cougar", "27SGS"],
  ["Cougar", "290RLS"],
  ["Cougar", "316RLS"],
  ["Cougar", "320RDS"],
  ["Cougar", "32BHS"],
  ["Cougar", "350LLK"],
  ["Cougar", "355FBS"],
  ["Cougar", "360MBI"],
  ["Cougar", "364BHL"],
  ["Cougar Half-Ton", "23MLE"],
  ["Cougar Half-Ton", "24RDS"],
  ["Cougar Half-Ton", "26RES"],
  ["Cougar Half-Ton", "26RKE"],
  ["Cougar Half-Ton", "27SGS"],
  ["Cougar Half-Ton", "28RLI"],
  ["Cougar Half-Ton", "29MBD"],
  ["Cougar Half-Ton", "29RLI"],
  ["Cougar Half-Ton", "30REP"],
  ["Cougar Half-Ton", "32BHS"],
  ["Cougar Sport", "2100RK"],
  ["Cougar Sport", "2400RE"],
  ["Cougar Sport", "2700BH"],
  ["Impact", "321LT"],
  ["Montana", "295RL"],
  ["Montana", "300RK"],
  ["Montana", "3100RL"],
  ["Montana", "3123RL"],
  ["Montana", "3231CK"],
  ["Montana", "3532SP"],
  ["Montana", "3795FK"],
  ["Montana High Country", "290RL"],
  ["Montana High Country", "295RL"],
  ["Montana High Country", "300RK"],
  ["Montana High Country", "311RD"],
  ["Montana High Country", "325RK"],
  ["Montana High Country", "331RL"],
  ["Montana High Country", "351BH"],
  ["Sprinter", "3900DBL"],
  ["Sprinter Limited", "3210RLS"],
  ["Sprinter Limited", "3520RDS"],
  ["Sprinter Limited", "3590LFT"],
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
  it("keeps existing rows and adds Keystone fifth wheels", () => {
    expect(deals).toHaveLength(417)
    expect(
      deals.filter((deal) => deal.manufacturer === "Coachmen")
    ).toHaveLength(262)
    expect(
      deals.filter((deal) => deal.manufacturer === "East To West")
    ).toHaveLength(5)
    expect(
      deals.filter((deal) => deal.manufacturer === "Forest River")
    ).toHaveLength(68)
    expect(deals.filter((deal) => deal.manufacturer === "Jayco")).toHaveLength(
      20
    )
    expect(
      deals.filter((deal) => deal.manufacturer === "Keystone")
    ).toHaveLength(62)
    expect(new Set(deals.map((deal) => deal.manufacturer))).toEqual(
      new Set(["Coachmen", "East To West", "Forest River", "Jayco", "Keystone"])
    )
    expect(new Set(deals.map((deal) => deal.year))).toEqual(new Set([2026]))
    expect(deals.some((deal) => deal.model === "Adrenaline")).toBe(true)
    expect(deals.some((deal) => deal.model === "Viking")).toBe(true)
    expect(deals.some((deal) => deal.model === "Other")).toBe(false)
  })

  it("lists every Coachmen, East To West, Forest River, Jayco, and Keystone fifth-wheel floor plan", () => {
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
    expect(etw.every((deal) => deal.year === 2026 && deal.ask != null)).toBe(
      true
    )

    const forest = deals.filter((deal) => deal.manufacturer === "Forest River")
    expect(forest).toHaveLength(FOREST_RIVER_FIFTH_WHEELS.length)
    expect(forest.map((deal) => [deal.model, deal.floor])).toEqual(
      FOREST_RIVER_FIFTH_WHEELS.map(([model, floor]) => [model, floor])
    )
    const pricedForestKeys = new Set([
      "Cardinal|32LIVE",
      "Cardinal|33CHEF",
      "Cedar Creek|290RL",
      "Cedar Creek Experience|2925RL",
      "Cedar Creek Experience|35RL",
      "Cherokee Arctic Wolf|27SGS",
      "Cherokee Arctic Wolf|285OPT",
      "Cherokee Arctic Wolf|287BH",
      "Cherokee Arctic Wolf|289PANO",
      "Cherokee Arctic Wolf|3250 SUITE",
      "Cherokee Arctic Wolf|331BH",
      "Crusader|KING33",
      "Impression|235RW",
      "Impression|242RD",
      "Impression|301ML",
      "Impression|315MB",
      "Impression|318RL",
      "Rockwood Signature|281RK",
      "Rockwood Signature|282RK",
      "Rockwood Signature|290SFK",
      "Rockwood Signature|301RKS",
      "Rockwood Signature|331RL",
      "Rockwood Signature|361RL",
      "Rockwood Signature|371RK",
      "Rockwood Signature|372RL",
      "Rockwood Signature|R331RL",
      "Rockwood Signature FW|361RLS",
      "Rockwood Signature FW|R374DBH",
      "Rockwood Signature Fifth Wheel|281RK",
      "Sabre|32GKS",
      "Sabre|33RLP",
      "Salem Hemisphere|286RL",
      "Salem Hemisphere|301FAM",
      "Salem Hemisphere|321DRL",
      "Salem Hemisphere|325RL",
      "Sandpiper|3370RLS",
      "Sandstorm|2710",
      "Sanibel|34LOUNGE",
      "Vengeance Rogue Armored|341GS11",
      "Wildcat|36FUN",
      "Wildcat XL|30BAM",
    ])
    const pricedForest = forest.filter((deal) =>
      pricedForestKeys.has(`${deal.model}|${deal.floor}`)
    )
    expect(pricedForest).toHaveLength(41)
    const unpricedForest = forest.filter(
      (deal) => !pricedForestKeys.has(`${deal.model}|${deal.floor}`)
    )
    expect(
      unpricedForest
        .filter(
          (deal) =>
            !(
              deal.model === "Cedar Creek Silverback" && deal.floor === "29RL"
            )
        )
        .every(
          (deal) =>
            deal.year === 2026 &&
            deal.ask == null &&
            deal.trade == null &&
            deal.delta == null &&
            deal.dealer === "" &&
            deal.notes.length === 0
        )
    ).toBe(true)

    const jayco = deals.filter((deal) => deal.manufacturer === "Jayco")
    expect(jayco).toHaveLength(JAYCO_FIFTH_WHEELS.length)
    expect(jayco.map((deal) => [deal.model, deal.floor])).toEqual(
      JAYCO_FIFTH_WHEELS.map(([model, floor]) => [model, floor])
    )
    const pricedJaycoKeys = new Set([
      "Eagle|28CRT",
      "Eagle|321RSTS",
      "Eagle|325MKTS",
      "Eagle|335LSTS",
      "Eagle|365UKTS",
      "Eagle HT|25RUC",
      "Eagle HT|26REC",
      "Eagle HT|27MLC",
      "Eagle HT|28CRT",
      "Eagle HT|29DDB",
      "Eagle HT|29RLC",
      "Eagle HT|30CRT",
      "Eagle HT|31QCD",
      "Eagle SLE|24MLE",
      "Eagle SLE|28BHU",
      "Eagle SLE|28RKS",
      "Eagle SLE|30RLT",
      "North Point|310RLTS",
      "Pinnacle|32RLTS",
    ])
    const pricedJayco = jayco.filter((deal) =>
      pricedJaycoKeys.has(`${deal.model}|${deal.floor}`)
    )
    expect(pricedJayco).toHaveLength(19)
    const unpricedJayco = jayco.filter(
      (deal) => !pricedJaycoKeys.has(`${deal.model}|${deal.floor}`)
    )
    expect(
      unpricedJayco.every(
        (deal) =>
          deal.year === 2026 &&
          deal.ask == null &&
          deal.trade == null &&
          deal.delta == null &&
          deal.dealer === "" &&
          deal.notes.length === 0
      )
    ).toBe(true)

    const keystone = deals.filter((deal) => deal.manufacturer === "Keystone")
    expect(keystone).toHaveLength(KEYSTONE_FIFTH_WHEELS.length)
    expect(keystone.map((deal) => [deal.model, deal.floor])).toEqual(
      KEYSTONE_FIFTH_WHEELS.map(([model, floor]) => [model, floor])
    )
    const pricedKeystoneKeys = new Set([
      "Alpine|3011CK",
      "Alpine|3100 RE",
      "Alpine|3100RE",
      "Alpine|3303CK",
      "Alpine Avalanche Edition|321RL",
      "Alpine Avalanche Edition|338GK",
      "Arcadia|3260RL",
      "Arcadia Select|21SRK",
      "Arcadia Select|24SRE",
      "Arcadia Select|25SRD",
      "Arcadia Select|27SBH",
      "Arcadia Select|28SLS",
      "Arcadia Super Lite|242SLMD",
      "Arcadia Super Lite|260SLCL",
      "Arcadia Super Lite|292SLRL",
      "Arcadia Super Lite|294SLRD",
      "Arcadia Super Lite|308SLBH",
      "Avalanche|321RL",
      "Cougar|24RDS",
      "Cougar|260MLE",
      "Cougar|27SGS",
      "Cougar|290RLS",
      "Cougar|316RLS",
      "Cougar|320RDS",
      "Cougar|32BHS",
      "Cougar|350LLK",
      "Cougar|355FBS",
      "Cougar|360MBI",
      "Cougar|364BHL",
      "Cougar Half-Ton|23MLE",
      "Cougar Half-Ton|24RDS",
      "Cougar Half-Ton|26RES",
      "Cougar Half-Ton|26RKE",
      "Cougar Half-Ton|27SGS",
      "Cougar Half-Ton|28RLI",
      "Cougar Half-Ton|29MBD",
      "Cougar Half-Ton|29RLI",
    ])
    const pricedKeystone = keystone.filter((deal) =>
      pricedKeystoneKeys.has(`${deal.model}|${deal.floor}`)
    )
    expect(pricedKeystone).toHaveLength(37)
    const unpricedKeystone = keystone.filter(
      (deal) => !pricedKeystoneKeys.has(`${deal.model}|${deal.floor}`)
    )
    expect(
      unpricedKeystone.every(
        (deal) =>
          deal.year === 2026 &&
          deal.ask == null &&
          deal.trade == null &&
          deal.delta == null &&
          deal.dealer === "" &&
          deal.notes.length === 0
      )
    ).toBe(true)
    expect(keystone.some((deal) => deal.model === "Other")).toBe(false)
  })

  it("keeps priced Brookstone and Chaparral rows without inventing values", () => {
    const priced = deals.filter((deal) => deal.ask != null)
    expect(priced).toHaveLength(183)

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
      trade: 40770,
      delta: 5480,
    })

    const chaparral27 = deals.find(
      (deal) => deal.model === "Chaparral" && deal.floor === "27BAR"
    )
    expect(chaparral27).toMatchObject({
      ask: 43851,
      dealer: "Carolina RV, Myrtle Beach SC",
      trade: 49320,
      delta: -5469,
    })

    const chaparral30 = deals.find(
      (deal) => deal.model === "Chaparral" && deal.floor === "30BHS"
    )
    expect(chaparral30).toMatchObject({
      ask: 44990,
      dealer: "Bobby Combs RV Center, Hayden",
      trade: 51750,
      delta: -6760,
    })
    expect(
      chaparral27?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href.includes("m-27-bar/6644371") &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      chaparral30?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href.includes("m-30-bhs/6644373") &&
            span.label === "JDP values"
        )
    ).toBe(true)
  })

  it("applies Chaparral batch 5 asks and 2026 JDP trades", () => {
    const rows = [
      [
        "Chaparral",
        "30RLS",
        52200,
        "Trailer Source, Inc – Frederick, Longmont, CO",
        50535,
        1665,
        "Trade from 2026 J.D. Power Low Retail $56,150 × 0.9 = $50,535 (Coachmen-by-Forest-River Chaparral Lite M-30 RLS; dealer lists Chaparral 30RLS; JDP 2026 lists this floor under Chaparral Lite). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-30-rls/6644374/values",
        "m-30-rls/6644374",
        "https://www.rvt.com/buy/details/2026-coachmen-chaparral-30rls/bf1e7380-4616-11f1-adcf-02f5bff6b341/",
        null,
      ],
      [
        "Chaparral",
        "336TSIK",
        52500,
        "Wana RV Center, Shipshewana, IN",
        57690,
        -5190,
        "Trade from 2026 J.D. Power Low Retail $64,100 × 0.9 = $57,690 (Coachmen-by-Forest-River Chaparral M-336 TSIK). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-336-tsik/6644359/values",
        "m-336-tsik/6644359",
        "https://www.rvt.com/buy/details/2026-coachmen-chaparral-336tsik/85fb4817-9568-11f1-beaa-02c8259c7411/",
        "https://www.rvtrader.com/listing/2026-Coachmen+Rv-Chaparral+336TSIK-5041680490#sid=177027",
      ],
      [
        "Chaparral",
        "360IBL",
        55997,
        "Campers Inn RV of Davenport, Davenport, IA",
        56340,
        -343,
        "Trade from 2026 J.D. Power Low Retail $62,600 × 0.9 = $56,340 (Coachmen-by-Forest-River Chaparral M-360 IBL). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-360-ibl/6644361/values",
        "m-360-ibl/6644361",
        "https://www.rvt.com/buy/details/2026-coachmen-chaparral-360ibl/dafe1a69-53f2-11f0-9c42-02c8259c7411/",
        "https://www.rvtrader.com/listing/2026-Coachmen+Rv-Chaparral+360IBL-5036948952#sid=177027",
      ],
      [
        "Chaparral Lite",
        "218SE",
        33826,
        "Stellhorn RV and Camping Center, Kokomo, IN",
        43830,
        -10004,
        "Trade from 2026 J.D. Power Low Retail $48,700 × 0.9 = $43,830 (Coachmen-by-Forest-River Chaparral Lite M-218 SE). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-218-se/6644369/values",
        "m-218-se/6644369",
        "https://www.rvt.com/buy/details/2026-coachmen-chaparral-lite-218se/0a7bf397-a4ea-11f0-beaa-02c8259c7411/",
        "https://www.rvtrader.com/listing/2026-Coachmen+Rv-Chaparral+Lite+218SE-5038075947#sid=254083",
      ],
      [
        "Chaparral Lite",
        "30BHS",
        49888,
        "Parris RV Pocatello, Chubbuck/Pocatello, ID",
        51750,
        -1862,
        "Trade from 2026 J.D. Power Low Retail $57,500 × 0.9 = $51,750 (Coachmen-by-Forest-River Chaparral Lite M-30 BHS). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-30-bhs/6644373/values",
        "m-30-bhs/6644373",
        "https://www.rvt.com/buy/details/2026-coachmen-chaparral-lite-30bhs/d52cce46-7a7b-11f0-b688-02c8259c7411/",
        "https://www.rvtrader.com/listing/2026-Coachmen+Rv-Chaparral+Lite+30BHS-5037492060",
      ],
    ] as const
    for (const [
      model,
      floor,
      ask,
      dealer,
      trade,
      delta,
      exactNote,
      path,
      askUrl,
      askAltUrl,
    ] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Coachmen" &&
          row.model === model &&
          row.floor === floor &&
          row.year === 2026
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href.includes(path) &&
              span.label === "JDP values"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href === askUrl &&
              span.label === "RVT"
          )
      ).toBe(true)
      if (askAltUrl) {
        expect(
          deal?.notes
            .flat()
            .some(
              (span) =>
                span.type === "link" &&
                span.href === askAltUrl &&
                span.label === "RV Trader"
            )
        ).toBe(true)
      } else {
        expect(
          deal?.notes
            .flat()
            .some(
              (span) =>
                span.type === "link" && span.href.includes("rvtrader.com")
            )
        ).toBe(false)
      }
    }
  })

  it("applies Chaparral Lite, Phoenix Lite, and Ahara batch asks and trades", () => {
    const rows = [
      [
        "Coachmen",
        "Chaparral Lite",
        "30RLS",
        44907,
        "Prosser’s Premium RV Outlet, Sturtevant, WI",
        50535,
        -5628,
        "Trade from 2026 J.D. Power Low Retail $56,150 × 0.9 = $50,535 (Coachmen-by-Forest-River Chaparral Lite M-30 RLS). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-30-rls/6644374/values",
        "m-30-rls/6644374",
        "https://www.rvtrader.com/listing/2026-Coachmen+Chaparral+Lite+30RLS-5040092020",
        "RV Trader",
        "https://www.rvt.com/buy/details/2026-coachmen-chaparral-lite-30rls/954f40b1-b0fe-11f1-84c9-020f812d825b/",
        "RVT",
      ],
      [
        "Coachmen",
        "Chaparral Lite",
        "31BH",
        47995,
        "Holiday RV Sales and Service, Jefferson, IA",
        49995,
        -2000,
        "Trade from 2026 J.D. Power Low Retail $55,550 × 0.9 = $49,995 (Coachmen-by-Forest-River Chaparral Lite M-31 BH). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-31-bh/6644372/values",
        "m-31-bh/6644372",
        "https://www.rvt.com/buy/details/2026-coachmen-chaparral-lite-31bh/443bd00f-e5bc-11f0-beaa-02c8259c7411/",
        "RVT",
        "https://www.rvtrader.com/listing/2026-Coachmen+Rv-Chaparral+Lite+31BH-5038868834",
        "RV Trader",
      ],
      [
        "Coachmen",
        "Phoenix Lite",
        "218SE",
        42999,
        "Sun City RV, Peoria, AZ",
        43830,
        -831,
        "Trade from 2026 J.D. Power Low Retail $48,700 × 0.9 = $43,830 (Coachmen-by-Forest-River Phoenix Lite M-218 SE). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-218-se/6644405/values",
        "m-218-se/6644405",
        "https://www.rvt.com/buy/details/2026-coachmen-phoenix-lite-218se/7e7b7e39-d4f9-11f0-beaa-02c8259c7411/",
        "RVT",
        "https://www.rvtrader.com/listing/2026-Chaparral+Lite-Phoenix+Lite+218SE-5038680458#sid=889324",
        "RV Trader",
      ],
      [
        "East To West",
        "Ahara",
        "325RL",
        68995,
        "Miles RV Center",
        51255,
        17740,
        "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $56,950 × 0.9 = $51,255 (East To West Ahara Series M-325RL). 2026 unused because Ahara/fifth-wheel series absent from 2026 east-to-west model list on jdpower.com (Class C + TT only). Source: https://www.jdpower.com/rvs/2025/east-to-west/m-325rl/6638522/values",
        "m-325rl/6638522",
        "https://www.rvtrader.com/listing/2026-East+To+West-Ahara+325RL-5041007098",
        "RV Trader",
        "https://www.rvt.com/buy/details/2026-east-to-west-ahara-325rl/dbc0e90f-6fc9-11f1-adcf-02c8259c7411/",
        "RVT",
      ],
    ] as const
    for (const [
      manufacturer,
      model,
      floor,
      ask,
      dealer,
      trade,
      delta,
      exactNote,
      path,
      askUrl,
      askLabel,
      askAltUrl,
      askAltLabel,
    ] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === manufacturer &&
          row.model === model &&
          row.floor === floor &&
          row.year === 2026
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href.includes(path) &&
              span.label === "JDP values"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href === askUrl &&
              span.label === askLabel
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href === askAltUrl &&
              span.label === askAltLabel
          )
      ).toBe(true)
    }

    const ahara297 = deals.find(
      (row) =>
        row.manufacturer === "East To West" &&
        row.model === "Ahara" &&
        row.floor === "297MK" &&
        row.year === 2026
    )
    expect(ahara297).toMatchObject({
      ask: 74849,
      dealer: "RV Value Mart - Asheboro, Franklinville, NC",
      trade: null,
      delta: null,
    })
    expect(
      ahara297?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "J.D. Power Low Retail not found for East To West Ahara 297MK: 2026 east-to-west model list on jdpower.com has Class C + travel trailers only (no Ahara/fifth-wheel series). 2025 Ahara Series has M-325RL/M-365RL/etc. but no M-297 MK. Trade/delta left blank."
        )
    ).toBe(true)
    expect(
      ahara297?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-east-to-west-ahara-297mk/920a75dc-8a8d-11f1-adcf-02f5bff6b341/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      ahara297?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-East+To+West-Ahara+297MK-5039713978" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
  })

  it("applies East To West Tandara/Ahara 365RL and Cardinal 2025 proxy trades", () => {
    const rows = [
      [
        "East To West",
        "Ahara",
        "365RL",
        66999,
        "Buckeye RV - Jeffersonville, Jeffersonville, OH",
        53415,
        13584,
        "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $59,350 × 0.9 = $53,415 (East To West Ahara Series M-365RL). 2026 unused because Ahara/fifth-wheel series absent from 2026 east-to-west model list on jdpower.com. Source: https://www.jdpower.com/rvs/2025/east-to-west/m-365rl/6638523/values",
        "m-365rl/6638523",
        "https://www.rvt.com/buy/details/2026-east-to-west-ahara-365rl/dc02d67c-3920-11f0-ae63-02c8259c7411/",
        "RVT",
        "https://www.rvtrader.com/listing/2026-East+To+West-Ahara+365RL-5041180504",
        "RV Trader",
      ],
      [
        "East To West",
        "Tandara",
        "235ML",
        38204,
        "Glampers RV",
        null,
        null,
        "J.D. Power Low Retail not found for East To West Tandara 235ML: absent from 2026 east-to-west model list (no fifth-wheel/Tandara series). 2025 Tandara Series lists M-320RL/M-321RL-OK/M-340RD/M-375BH-OK/M-385MB/M-386MB-OK; 2025 Tandara Half-Ton lists M-22RK/M-26RD/M-27BH-OK/M-28RL/M-28RL-OK — no M-235 ML. Trade/delta left blank.",
        null,
        "https://www.rvtrader.com/listing/2026-East+To+West-Tandara+235ML-5041758774",
        "RV Trader",
        "https://www.rvt.com/buy/details/2026-east-to-west-tandara-235ml/4c303480-08ae-11f1-beaa-02c8259c7411/",
        "RVT",
      ],
      [
        "East To West",
        "Tandara",
        "295RL",
        54990,
        "Berryland Campers",
        null,
        null,
        "J.D. Power Low Retail not found for East To West Tandara 295RL: absent from 2026 east-to-west model list (no fifth-wheel/Tandara series). 2025 Tandara Series has M-320RL/M-321RL-OK/M-340RD/M-375BH-OK/M-385MB/M-386MB-OK; Half-Ton has M-22RK/M-26RD/M-27BH-OK/M-28RL/M-28RL-OK — no M-295 RL. Trade/delta left blank.",
        null,
        "https://www.rvt.com/buy/details/2026-east-to-west-tandara-295rl/5119194f-6436-11f1-adcf-02f5bff6b341/",
        "RVT",
        "https://www.rvtrader.com/listing/2026-East+To+West-Tandara+295RL-5040254119",
        "RV Trader",
      ],
      [
        "Forest River",
        "Cardinal",
        "32LIVE",
        47115,
        "Fun Town RV - Anna",
        29655,
        17460,
        "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $32,950 × 0.9 = $29,655 (Cardinal-by-Forest-River M-32LIVE). 2026 cardinal-by-forest-river page returned error/unavailable on scrape; used matching 2025 floor. Source: https://www.jdpower.com/rvs/2025/cardinal-by-forest-river/m-32live/6647567/values",
        "m-32live/6647567",
        "https://www.rvt.com/buy/details/2026-forest-river-cardinal-32live/3edfe407-79a4-11f0-b688-02c8259c7411/",
        "RVT",
        "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Cardinal+32LIVE-5037477901",
        "RV Trader",
      ],
    ] as const
    for (const [
      manufacturer,
      model,
      floor,
      ask,
      dealer,
      trade,
      delta,
      exactNote,
      path,
      askUrl,
      askLabel,
      askAltUrl,
      askAltLabel,
    ] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === manufacturer &&
          row.model === model &&
          row.floor === floor &&
          row.year === 2026
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      if (path) {
        expect(
          deal?.notes
            .flat()
            .some(
              (span) =>
                span.type === "link" &&
                span.href.includes(path) &&
                span.label === "JDP values"
            )
        ).toBe(true)
      } else {
        expect(
          deal?.notes
            .flat()
            .some((span) => span.type === "link" && span.label === "JDP values")
        ).toBe(false)
      }
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href === askUrl &&
              span.label === askLabel
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href === askAltUrl &&
              span.label === askAltLabel
          )
      ).toBe(true)
    }
  })

  it("applies Cardinal 32LIVE ask and 2025 JDP proxy trade and leaves Wildcat 32LIVE blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Cardinal" &&
        row.floor === "32LIVE" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 47115,
      dealer: "Fun Town RV - Anna",
      trade: 29655,
      delta: 17460,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text.includes(
              "Ask $47,115 tied RV Trader + RVT at Fun Town (Anna IL / Edinburgh IN), 36 ft New 32LIVE."
            )
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $32,950 × 0.9 = $29,655 (Cardinal-by-Forest-River M-32LIVE). 2026 cardinal-by-forest-river page returned error/unavailable on scrape; used matching 2025 floor. Source: https://www.jdpower.com/rvs/2025/cardinal-by-forest-river/m-32live/6647567/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2025/cardinal-by-forest-river/m-32live/6647567/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-cardinal-32live/3edfe407-79a4-11f0-b688-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Cardinal+32LIVE-5037477901" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const wildcatTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Wildcat" &&
        row.floor === "32LIVE" &&
        row.year === 2026
    )
    expect(wildcatTwin).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(wildcatTwin?.notes).toEqual([])
  })

  it("applies Cardinal 33CHEF ask and 2025 JDP proxy trade and leaves Wildcat 33CHEF blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Cardinal" &&
        row.floor === "33CHEF" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 49995,
      dealer: "County Line Campers, Gulfport, MS",
      trade: 30465,
      delta: 19530,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text.includes(
              "Ask $49,995 RV Trader only (County Line Campers, Gulfport MS), ~38 ft New 33CHEF (JDP 38'3\"). RVT was CAPTCHA-blocked — not cross-checked."
            )
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $33,850 × 0.9 = $30,465 (Cardinal-by-Forest-River M-33CHEF). 2026 JDP No Data Available — prior-year proxy. 2026 cardinal-by-forest-river page returned error/unavailable on scrape; used matching 2025 floor. Source: https://www.jdpower.com/rvs/2025/cardinal-by-forest-river/m-33chef/6647568/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2025/cardinal-by-forest-river/m-33chef/6647568/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-CARDINAL+33CHEF-5040815575" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const wildcatTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Wildcat" &&
        row.floor === "33CHEF" &&
        row.year === 2026
    )
    expect(wildcatTwin).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(wildcatTwin?.notes).toEqual([])
  })

  it("applies Cedar Creek and Arctic Wolf 27SGS asks and proxy trades", () => {
    const rows = [
      [
        "Cedar Creek",
        "290RL",
        74999,
        "Bill's Happy Camper RV Sales & Service, Mill Hall, PA",
        65205,
        9794,
        "Ask $74,999 RV Trader (Bill's Happy Camper, Mill Hall PA), 33 ft, listed as Cedar Creek 29RL — treated as catalog 290RL. RVT literal 290RL low $102,297 (Dakota Discount, Rapid City SD, 33 ft). Skipped Premium $74,995; skipped Experience 29RL $69,900 (wrong model line). Trade = 2026 JDP Low Retail $72,450 × 0.9 = $65,205 (real 2026 Cedar Creek M-29RL matching catalog 290RL).",
        "https://www.rvt.com/buy/details/2026-forest-river-cedar-creek-290rl/af3e4f67-859d-11f1-adcf-02f5bff6b341/",
        "RVT",
        "https://www.rvtrader.com/listing/2026-Forest+River-Cedar+Creek+29RL-5039740272",
        "RV Trader",
      ],
      [
        "Cedar Creek Experience",
        "2925RL",
        75288,
        "Fun Town RV - Nature Coast, Crystal River, FL",
        52020,
        23268,
        "Ask $75,288 tied both sites (Fun Town RV Nature Coast, Crystal River FL), 35 ft. RV Trader lists as Experience 29RL; RVT as 2925RL — same unit. TRADE FROM 2025 (not 2026): J.D. Power Low Retail $57,800 × 0.9 = $52,020 (Cedar Creek Experience Series M-29RL). 2026 Experience not on JDP. Do not use base Cedar Creek M-29RL.",
        "https://www.rvt.com/buy/details/2026-forest-river-cedar-creek-experience-2925rl/a1d37844-b324-11f1-84c9-020f812d825b/",
        "RVT",
        "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Cedar+Creek+Experience+29RL-5040140754",
        "RV Trader",
      ],
      [
        "Cherokee Arctic Wolf",
        "27SGS",
        42548,
        "Camping World, Kodak, TN",
        37305,
        5243,
        "Lowest organic ask $42,548 on both RV Trader and RVT (Camping World Kodak TN; ~29.92 ft; stock #2600467). TRADE FROM 2025: JDP Low Retail $41,450 × 0.9 = $37,305 (Cherokee-by-Forest-River Arctic Wolf Series M-27SGS). 2026 cherokee-by-forest-river make page has no M-27SGS.",
        "https://www.rvt.com/buy/details/2026-forest-river-cherokee-arctic-wolf-27sgs/6a92b105-ad12-11f1-84c9-020f812d825b/",
        "RVT",
        "https://www.rvtrader.com/listing/2026-Forest+River-ARCTIC+WOLF+27SGS-5042063301",
        "RV Trader",
      ],
    ] as const
    for (const [
      model,
      floor,
      ask,
      dealer,
      trade,
      delta,
      exactNote,
      askUrl,
      askLabel,
      askAltUrl,
      askAltLabel,
    ] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Forest River" &&
          row.model === model &&
          row.floor === floor &&
          row.year === 2026
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "link" && span.label === "JDP values")
      ).toBe(false)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href === askUrl &&
              span.label === askLabel
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href === askAltUrl &&
              span.label === askAltLabel
          )
      ).toBe(true)
    }
  })

  it("clears the mis-tagged Cedar Creek Silverback 29RL ask", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Cedar Creek Silverback" &&
        row.floor === "29RL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask cleared 2026-10-01: prior $74,995 Dynasty listing is titled plain Cedar Creek 29RL (not Silverback) — RV Trader “CEDAR CREEK SILVERBACK” category is taxonomy-only; no Silverback in title/model/description. Filtered Silverback search returned only plain Cedar Creek 29RL titles. No verified New 2026 Silverback 29RL organic ask. Experience 29RL excluded."
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link")
    ).toBe(false)
  })

  it("applies Cedar Creek Experience 35RL ask and 2025 JDP proxy trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Cedar Creek Experience" &&
        row.floor === "35RL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 68977,
      dealer: "Lazydays by Campers Inn RV, Seffner, FL",
      trade: 53280,
      delta: 15697,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $68,977 RV Trader only (Lazydays by Campers Inn, Seffner FL), 39 ft New 35RL. RVT CAPTCHA blocked — not cross-checked. TRADE FROM 2025 (not 2026): J.D. Power Low Retail $59,200 × 0.9 = $53,280 (Cedar Creek Experience Series M-35RL). 2026 Experience 35RL missing on JDP — prior-year 2025 proxy used. Source: https://www.jdpower.com/rvs/2025/cedar-creek/m-35rl/6640232/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2025/cedar-creek/m-35rl/6640232/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-Rv-Cedar+Creek+Experience+35RL-5037050467" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Cedar Creek Experience" &&
        row.floor === "2925RL" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 75288,
      dealer: "Fun Town RV - Nature Coast, Crystal River, FL",
      trade: 52020,
      delta: 23268,
    })
  })

  it("applies Arctic Wolf 285OPT and 287BH asks and 2025 proxy trade", () => {
    const opt = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Cherokee Arctic Wolf" &&
        row.floor === "285OPT" &&
        row.year === 2026
    )
    expect(opt).toMatchObject({
      ask: 38995,
      dealer: "Bunker Hill, IN",
      trade: null,
      delta: null,
    })
    expect(
      opt?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $38,995 both RVT + RV Trader (Bunker Hill IN), 34 ft New. Trade blank: verified 2025/2026 no M-285OPT; 2027 lists M-285OPT but Low Retail N/A — no forward proxy."
        )
    ).toBe(true)
    expect(
      opt?.notes
        .flat()
        .some((span) => span.type === "link")
    ).toBe(false)

    const bh = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Cherokee Arctic Wolf" &&
        row.floor === "287BH" &&
        row.year === 2026
    )
    expect(bh).toMatchObject({
      ask: 39995,
      dealer: "RV Dynasty, Bunker Hill, IN",
      trade: 38655,
      delta: 1340,
    })
    expect(
      bh?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $39,995 both RVT + RV Trader (RV Dynasty, Bunker Hill IN), 35 ft New. TRADE FROM 2025 (not 2026): J.D. Power Low Retail $42,950 × 0.9 = $38,655 (Cherokee-by-FR Arctic Wolf M-287BH). 2026 cherokee-by-forest-river make page has no Arctic Wolf / M-287BH."
        )
    ).toBe(true)
    expect(
      bh?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      bh?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-cherokee-arctic-wolf-287bh/f588d5db-b16b-11f0-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      bh?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Cherokee+Arctic+Wolf+287BH-5038250917" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
  })

  it("applies Arctic Wolf 289PANO, 3250 SUITE, and 331BH asks and 2025 proxy trades", () => {
    const rows = [
      [
        "289PANO",
        45887,
        "Buckeye RV Jeffersonville, Jeffersonville, OH",
        null,
        null,
        "Ask $45,887 both RVT + RV Trader (Buckeye RV Jeffersonville, OH), 35 ft New. Trade blank: verified 2025 Arctic Wolf has no M-289PANO; 2026 cherokee-by-FR make page has no Arctic Wolf 5th-wheel list. 2027 lists M-289PANO but Low Retail N/A — forward-year proxy NOT applied.",
        "https://www.rvt.com/buy/details/2026-forest-river-cherokee-arctic-wolf-289pano/3409d404-7b24-11f0-b688-02c8259c7411/",
        "https://www.rvtrader.com/listing/2026-Forest+River-CHEROKEE+ARCTIC+WOLF+289PANO-5037500494",
      ],
      [
        "3250 SUITE",
        49930,
        "Boyer RV Center, Erie, PA",
        43965,
        5965,
        "Ask $49,930 both RVT + RV Trader (Boyer RV Center, Erie PA), 36 ft New (RV Trader; RVT detail re-verified after CAPTCHA). TRADE FROM 2025 (not 2026): J.D. Power Low Retail $48,850 × 0.9 = $43,965 (Cherokee-by-FR Arctic Wolf M-3250SUITE). 2026 cherokee-by-forest-river make page has no Arctic Wolf 5th-wheel list.",
        "https://www.rvt.com/buy/details/2026-forest-river-cherokee-arctic-wolf-3250-suite/6fb35a58-bcdb-11f1-84c9-020f812d825b/",
        "https://www.rvtrader.com/listing/2026-Forest+River-Rv+Cherokee+Arctic+Wolf+3250SUITE-5042396612",
      ],
      [
        "331BH",
        46995,
        "RV Roadway, Calera, AL",
        42120,
        4875,
        "Ask $46,995 both RVT + RV Trader (RV Roadway, Calera AL), 38 ft New. TRADE FROM 2025 (not 2026): J.D. Power Low Retail $46,800 × 0.9 = $42,120 (Cherokee-by-FR Arctic Wolf M-331BH). 2026 cherokee-by-forest-river make page has no Arctic Wolf 5th-wheel list.",
        "https://www.rvt.com/buy/details/2026-forest-river-cherokee-arctic-wolf-331bh/394f28f6-9646-11f1-84c9-020f812d825b/",
        "https://www.rvtrader.com/listing/2026-Forest+River-Cherokee+Arctic+Wolf+331BH-5041696321",
      ],
    ] as const
    for (const [
      floor,
      ask,
      dealer,
      trade,
      delta,
      exactNote,
      askUrl,
      askAltUrl,
    ] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Forest River" &&
          row.model === "Cherokee Arctic Wolf" &&
          row.floor === floor &&
          row.year === 2026
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "link" && span.label === "JDP values")
      ).toBe(false)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href === askUrl &&
              span.label === "RVT"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href === askAltUrl &&
              span.label === "RV Trader"
          )
      ).toBe(true      )
    }
  })

  it("applies Crusader KING33 ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Crusader" &&
        row.floor === "KING33" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 52495,
      dealer: "Roth RV - Grand Rapids, Grand Rapids, MN",
      trade: 39420,
      delta: 13075,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Trade = 2026 JDP Low Retail $43,800 × 0.9. Ask $52,495 both sites (Roth RV Grand Rapids MN). Length 35'11\"."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-crusader-king33/2ec95e3a-0333-11f1-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Crusader+KING33-5039242753" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
  })

  it("applies Impression 235RW ask and 2025 proxy trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Impression" &&
        row.floor === "235RW" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 38798,
      dealer: "Camping World (Jackson, TN), Jackson, TN",
      trade: 29970,
      delta: 8828,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $38,798 both sites (Camping World Jackson TN), ~28.92 ft New. TRADE FROM 2025 (not 2026): JDP Low Retail $33,300 × 0.9 = $29,970 (Impression-by-FR M-235RW). 2026 M-235RW URL 404; no indexed 2026 page."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-impression-235rw/bf9e4fd5-ad12-11f1-84c9-020f812d825b/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-IMPRESSION+235RW-5042064069" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
  })

  it("applies Impression 242RD ask and 2025 proxy trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Impression" &&
        row.floor === "242RD" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 38654,
      dealer: "Thrills RV, Columbia City, IN",
      trade: 29340,
      delta: 9314,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $38,654 both sites (Thrills RV Columbia City IN), 30 ft New. TRADE FROM 2025 (not 2026): JDP Low Retail $32,600 × 0.9 = $29,340 (Impression-by-FR M-242RD). 2026 page unavailable."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-impression-242rd/fce30cfd-4758-11f0-a527-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-Impression+242RD-5036714865" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
  })

  it("applies Impression 301ML ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Impression" &&
        row.floor === "301ML" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 52777,
      dealer: "Thrills RV, Columbia City, IN",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $52,777 RVT (Thrills RV Columbia City IN), 35 ft New; RV Trader organic $55,499. Trade blank: verified JDP miss — 2026 Impression-by-FR M-301ML values page undefined/no Low Retail; 2026 make index HTTP 500; 2025 Impression index has no M-301ML and direct 2025 values URL also undefined. Length ~35'8\" (RVUSA). JDP URL checked: https://www.jdpower.com/rvs/2026/impression-by-forest-river/m-301ml/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-impression-301ml/6ca4ec1c-954c-11f0-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Impression+301ML-5038976826" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
  })

  it("applies Impression 315MB ask and 2025 proxy trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Impression" &&
        row.floor === "315MB" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 54999,
      dealer: "Thrills RV, Columbia City, IN",
      trade: 40860,
      delta: 14139,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $54,999 both sites (Thrills RV Columbia City IN), 38 ft New. TRADE FROM 2025 (not 2026): JDP Low Retail $45,400 × 0.9 = $40,860 (Impression-by-FR M-315MB; JDP length 36'6\"). 2026 page HTTP 500."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-impression-315mb/29dffee0-8c89-11ef-8bbb-12043a49ed9f/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-Impression+315MB-5033721303" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
  })

  it("applies Impression 318RL ask and 2025 proxy trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Impression" &&
        row.floor === "318RL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 53595,
      dealer: "Fun Town RV - Anna, Anna, IL",
      trade: 42210,
      delta: 11385,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $53,595 both sites (Fun Town RV Anna IL), 38 ft New. TRADE FROM 2025 (not 2026): JDP Low Retail $46,900 × 0.9 = $42,210 (Impression-by-FR M-318RLVIEW). 2026 make page HTTP 500."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-impression-318rl/28a27f4f-9914-11f0-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Impression+318RL-5037909973" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
  })

  it("applies Rockwood Signature 281RK ask and 2026 JDP trade", () => {
    const models = ["Rockwood Signature", "Rockwood Signature Fifth Wheel"]
    for (const model of models) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Forest River" &&
          row.model === model &&
          row.floor === "281RK" &&
          row.year === 2026
      )
      expect(deal).toMatchObject({
        ask: 51578,
        dealer:
          "Forest River RV Little Rock by Camping World, Sherwood / Little Rock, AR",
        trade: 38565,
        delta: 13013,
      })
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "text" &&
              span.text ===
                "Ask $51,578 both sites (Camping World Little Rock / Sherwood AR), ~28.92 ft New. Trade = 2026 JDP Low Retail $42,850 × 0.9 = $38,565 (Rockwood-by-FR M-281RK, length 28'11\")."
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "link" && span.label === "JDP values")
      ).toBe(false)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href ===
                "https://www.rvt.com/buy/details/2026-forest-river-rockwood-signature-281rk/7f418b8d-ad12-11f1-84c9-020f812d825b/" &&
              span.label === "RVT"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href ===
                "https://www.rvtrader.com/listing/2026-Forest+River-ROCKWOOD+SIGNATURE+281RK-5042063477" &&
              span.label === "RV Trader"
          )
      ).toBe(true)
    }

    const flagstaff = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Flagstaff Classic" &&
        row.floor === "281RK" &&
        row.year === 2026
    )
    expect(flagstaff).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(flagstaff?.notes).toEqual([])
  })

  it("applies Rockwood Signature 282RK ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Rockwood Signature" &&
        row.floor === "282RK" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 43589,
      dealer: "Camping World, Apollo, PA",
      trade: 37035,
      delta: 6554,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $43,589 both sites (Camping World Apollo PA), ~28.92 ft New. Trade = 2026 JDP Low Retail $41,150 × 0.9 = $37,035 (Rockwood-by-FR M-282RK)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-rockwood-signature-282rk/ceba381a-ad10-11f1-84f9-020f812d825b/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-ROCKWOOD+SIGNATURE+282RK-5042059751" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const flagstaff = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Flagstaff Classic" &&
        row.floor === "282RK" &&
        row.year === 2026
    )
    expect(flagstaff).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(flagstaff?.notes).toEqual([])
  })

  it("applies Rockwood Signature 290SFK ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Rockwood Signature" &&
        row.floor === "290SFK" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 55888,
      dealer: "RCD RV SuperCenter, Medina, OH",
      trade: 43605,
      delta: 12283,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $55,888 RV Trader (RCD RV SuperCenter Medina OH), 29 ft New; RVT organic $59,995. Trade = 2026 JDP Low Retail $48,450 × 0.9 = $43,605 (Rockwood-by-FR M-290SFK, length 29'10\")."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-rockwood-signature-290sfk/a1556a5e-3e08-11f1-adcf-02f5bff6b341/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Rockwood+Signature+290SFK-5038902993" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const flagstaff = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Flagstaff Classic" &&
        row.floor === "290CFK" &&
        row.year === 2026
    )
    expect(flagstaff).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(flagstaff?.notes).toEqual([])
  })

  it("applies Rockwood Signature 301RKS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Rockwood Signature" &&
        row.floor === "301RKS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 47115,
      dealer: "Fun Town RV - North Detroit, North Branch, MI",
      trade: 39105,
      delta: 8010,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $47,115 RV Trader (Fun Town RV - North Detroit, North Branch MI), listed as R301RKS, 31 ft New; RVT organic $50,308 (Fun Town RV Houston / Wharton TX). Trade = 2026 JDP Low Retail $43,450 × 0.9 = $39,105 (Rockwood-by-FR Signature Series M-301RKS)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-rockwood-signature-301rks/2243c68e-becb-11f0-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Rockwood+Signature+R301RKS-5037952722" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const flagstaff = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Flagstaff Classic" &&
        row.floor === "301RKS" &&
        row.year === 2026
    )
    expect(flagstaff).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(flagstaff?.notes).toEqual([])

    const twin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Rockwood Signature Fifth Wheel" &&
        row.floor === "301RKS" &&
        row.year === 2026
    )
    expect(twin).toBeUndefined()
  })

  it("applies Rockwood Signature 331RL ask and 2026 JDP trade", () => {
    const floors = ["331RL", "R331RL"]
    for (const floor of floors) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Forest River" &&
          row.model === "Rockwood Signature" &&
          row.floor === floor &&
          row.year === 2026
      )
      expect(deal).toMatchObject({
        ask: 56894,
        dealer: "Fun Town RV - Ottawa, KS",
        trade: 46035,
        delta: 10859,
      })
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "text" &&
              span.text ===
                "Ask $56,894 RV Trader (Fun Town RV Ottawa KS), 34 ft New 331RL (also labeled R331RL); RVT organic $58,394 (Fun Town Dallas / Rockwall TX) — RVT hit CAPTCHA after. Trade = 2026 JDP Low Retail $51,150 × 0.9 = $46,035 (Rockwood-by-FR Signature Series M-331RL)."
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "link" && span.label === "JDP values")
      ).toBe(false)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href ===
                "https://www.rvt.com/buy/details/2026-forest-river-rockwood-signature-r331rl/d1183216-8574-11f0-beaa-02c8259c7411/" &&
              span.label === "RVT"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href ===
                "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Rockwood+Signature+331RL-5037511345" &&
              span.label === "RV Trader"
          )
      ).toBe(true)
    }

    const flagstaff = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Flagstaff Classic" &&
        row.floor === "331RL" &&
        row.year === 2026
    )
    expect(flagstaff).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(flagstaff?.notes).toEqual([])
  })

  it("applies Rockwood Signature 361RL ask and 2026 JDP trade", () => {
    const rows = [
      ["Rockwood Signature", "361RL"],
      ["Rockwood Signature FW", "361RLS"],
    ] as const
    for (const [model, floor] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Forest River" &&
          row.model === model &&
          row.floor === floor &&
          row.year === 2026
      )
      expect(deal).toMatchObject({
        ask: 65987,
        dealer: "A & L RV Sales–Lake Park, Lake Park, GA",
        trade: 49320,
        delta: 16667,
      })
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "text" &&
              span.text ===
                "Ask $65,987 RVT (A & L RV Sales–Lake Park, GA), listed 361RL (~36.83 ft New; descriptions sometimes R361RLS); RV Trader organic exact 361RL $69,977 (Tom Stinnett’s Campers Inn RV, Clarksville IN). Separate cheaper R361RLS-only variants excluded. Trade = 2026 JDP Low Retail $54,800 × 0.9 = $49,320 (Signature Series M-361RLS — no bare M-361RL on 2026 JDP list)."
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "link" && span.label === "JDP values")
      ).toBe(false)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href ===
                "https://www.rvt.com/buy/details/2026-forest-river-rockwood-signature-361rl/56542f01-1a15-11f1-beaa-02c8259c7411/" &&
              span.label === "RVT"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href ===
                "https://www.rvtrader.com/listing/2026-Forest+River-Rockwood+Signature+361RL-5038638016" &&
              span.label === "RV Trader"
          )
      ).toBe(true)
    }

    const flagstaff = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Flagstaff Classic" &&
        row.floor === "361RLS" &&
        row.year === 2026
    )
    expect(flagstaff).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(flagstaff?.notes).toEqual([])
  })

  it("applies Rockwood Signature 371RK ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Rockwood Signature" &&
        row.floor === "371RK" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 65995,
      dealer: "Open Roads Complete RV, Acworth, GA",
      trade: 48240,
      delta: 17755,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $65,995 both RV Trader and RVT (Open Roads Complete RV, Acworth GA), ~36.8 ft New; listed R371RK / 371RK. Trade = 2026 JDP Low Retail $53,600 × 0.9 = $48,240 (Signature Series M-371RK)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-rockwood-signature-371rk/25115e6e-bed0-11f0-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-Rv-Rockwood+Signature+R371RK-5038414638" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const flagstaff = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Flagstaff Classic" &&
        row.floor === "371RK" &&
        row.year === 2026
    )
    expect(flagstaff).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(flagstaff?.notes).toEqual([])

    const fwTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Rockwood Signature FW" &&
        row.floor === "371RK" &&
        row.year === 2026
    )
    expect(fwTwin).toBeUndefined()

    const fifthTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Rockwood Signature Fifth Wheel" &&
        row.floor === "371RK" &&
        row.year === 2026
    )
    expect(fifthTwin).toBeUndefined()
  })

  it("applies Rockwood Signature 372RL ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Rockwood Signature" &&
        row.floor === "372RL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 65594,
      dealer: "The Great Outdoors RV, Greeley, CO",
      trade: 49905,
      delta: 15689,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $65,594 RV Trader (The Great Outdoors RV, Greeley CO), listed R372RL, 36 ft New; RVT organic $66,124 (Camping World Lubbock TX) 372RL 37.0 ft. Trade = 2026 JDP Low Retail $55,450 × 0.9 = $49,905 (Signature Series M-372RL)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-rockwood-signature-372rl/06f37d55-ad14-11f1-84c9-020f812d825b/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-Rv-Rockwood+Signature+R372RL-5038468632" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const flagstaff = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Flagstaff Classic" &&
        row.floor === "372RL" &&
        row.year === 2026
    )
    expect(flagstaff).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(flagstaff?.notes).toEqual([])

    const fwTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        (row.model === "Rockwood Signature FW" ||
          row.model === "Rockwood Signature Fw") &&
        (row.floor === "372RL" || row.floor === "R372RL") &&
        row.year === 2026
    )
    expect(fwTwin).toBeUndefined()

    const fifthTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Rockwood Signature Fifth Wheel" &&
        (row.floor === "372RL" || row.floor === "R372RL") &&
        row.year === 2026
    )
    expect(fifthTwin).toBeUndefined()
  })

  it("applies Rockwood Signature FW R374DBH ask and 2026 JDP trade", () => {
    const rows = [
      ["Rockwood Signature FW", "R374DBH"],
    ] as const
    for (const [model, floor] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Forest River" &&
          row.model === model &&
          row.floor === floor &&
          row.year === 2026
      )
      expect(deal).toMatchObject({
        ask: 54994,
        dealer: "Camping World, Wentzville, MO",
        trade: 43110,
        delta: 11884,
      })
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "text" &&
              span.text ===
                "Ask $54,994 RV Trader (Camping World, Wentzville MO), 374DBH ~36.83 ft New; RVT only open-to-offers with no fixed price (RV World Yuma AZ). Trade = 2026 JDP Low Retail $47,900 × 0.9 = $43,110 (Signature Series M-374DBH)."
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "link" && span.label === "JDP values")
      ).toBe(false)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href ===
                "https://www.rvt.com/buy/details/2026-forest-river-rockwood-signature/f212022f-13db-11f1-beaa-02c8259c7411/" &&
              span.label === "RVT"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href ===
                "https://www.rvtrader.com/listing/2026-Forest+River-ROCKWOOD+SIGNATURE+374DBH-5042062690" &&
              span.label === "RV Trader"
          )
      ).toBe(true)
    }

    const signatureBare = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Rockwood Signature" &&
        (row.floor === "374DBH" || row.floor === "R374DBH") &&
        row.year === 2026
    )
    expect(signatureBare).toBeUndefined()

    const flagstaff = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Flagstaff Classic" &&
        row.floor === "374DBH" &&
        row.year === 2026
    )
    expect(flagstaff).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(flagstaff?.notes).toEqual([])

    const fifthTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Rockwood Signature Fifth Wheel" &&
        (row.floor === "374DBH" || row.floor === "R374DBH") &&
        row.year === 2026
    )
    expect(fifthTwin).toBeUndefined()
  })

  it("applies Sabre 32GKS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Sabre" &&
        row.floor === "32GKS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 54981,
      dealer: "Pete’s RV Center–Indiana, Schererville, IN",
      trade: 48510,
      delta: 6471,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $54,981 both RV Trader and RVT (Pete’s RV Center–Indiana, Schererville IN), stock 92576; listing length blank/0 but JDP M-32GKS is 34'10\". Trade = 2026 JDP Low Retail $53,900 × 0.9 = $48,510 (Sabre-by-FR M-32GKS)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/?q=%28And.%28C.Make.FOREST%20RIVER._.%28C.Model.SABRE._.FamilyName.32GKS.%29%29_.Year.range%282026..2026%29.%29&sort=Price" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/New-2026-Forest-River-Sabre-32gks/rvs-for-sale?make=Forest%20River%7C440465&model=SABRE%7C764955083&trim=32GKS%7C327518&condition=N&year=2026&zip=78702&radius=10000&sort=price%3Aasc" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const siblings = deals.filter(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Sabre" &&
        row.floor !== "32GKS" &&
        row.year === 2026
    )
    expect(siblings.map((row) => row.floor).sort()).toEqual(["25RLS", "33RLP"])
    const unpricedSibling = siblings.find((row) => row.floor === "25RLS")
    expect(unpricedSibling).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(unpricedSibling?.notes).toEqual([])
    const pricedSibling = siblings.find((row) => row.floor === "33RLP")
    expect(pricedSibling).toMatchObject({
      ask: 59498,
      dealer: "Camping World, West Hatfield, MA",
      trade: 55395,
      delta: 4103,
    })
  })

  it("applies Sabre 33RLP ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Sabre" &&
        row.floor === "33RLP" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 59498,
      dealer: "Camping World, West Hatfield, MA",
      trade: 55395,
      delta: 4103,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $59,498 RV Trader (Camping World, West Hatfield MA), ~39.92 ft New; RVT blocked by CAPTCHA (not cross-checked). Trade = 2026 JDP Low Retail $61,550 × 0.9 = $55,395 (Sabre-by-FR M-33RLP)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-SABRE+33RLP-5042060522" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const siblings = deals.filter(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Sabre" &&
        row.floor !== "33RLP" &&
        row.year === 2026
    )
    expect(siblings.map((row) => row.floor).sort()).toEqual(["25RLS", "32GKS"])
    const unpricedSibling = siblings.find((row) => row.floor === "25RLS")
    expect(unpricedSibling).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(unpricedSibling?.notes).toEqual([])
    const pricedSibling = siblings.find((row) => row.floor === "32GKS")
    expect(pricedSibling).toMatchObject({
      ask: 54981,
      dealer: "Pete’s RV Center–Indiana, Schererville, IN",
      trade: 48510,
      delta: 6471,
    })
  })

  it("applies Salem Hemisphere 286RL ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Salem Hemisphere" &&
        row.floor === "286RL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 48995,
      dealer: "Lynden Sports Center, LLC, Coopersville, MI",
      trade: 45990,
      delta: 3005,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $48,995 RV Trader (Lynden Sports Center, Coopersville MI), 34 ft New; RVT blocked by CAPTCHA (not cross-checked). Trade = 2026 JDP Low Retail $51,100 × 0.9 = $45,990 (Salem Hemisphere Series M-286RL)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-SALEM+HEMISPHERE+286RL-5039676966" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const siblings = deals.filter(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Salem Hemisphere" &&
        row.floor !== "286RL" &&
        row.floor !== "301FAM" &&
        row.floor !== "321DRL" &&
        row.floor !== "325RL" &&
        row.year === 2026
    )
    expect(siblings).toEqual([])

    const heritageGlenTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Wildwood Heritage Glen" &&
        row.floor === "286RL" &&
        row.year === 2026
    )
    expect(heritageGlenTwin).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(heritageGlenTwin?.notes).toEqual([])
  })

  it("applies Salem Hemisphere 301FAM ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Salem Hemisphere" &&
        row.floor === "301FAM" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 42365,
      dealer: "Fun Town RV – North Detroit, North Branch, MI",
      trade: 39285,
      delta: 3080,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $42,365 both RV Trader and RVT (Fun Town RV – North Detroit, North Branch MI), 38 ft New; RVT recheck after CAPTCHA cleared matched RV Trader. Trade = 2026 JDP Low Retail $43,650 × 0.9 = $39,285 (Salem Hemisphere Series M-301FAM)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-salem-hemisphere-301fam/b3d8d101-0717-11f1-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Salem+Hemisphere+301FAM-5039287910" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const siblings = deals.filter(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Salem Hemisphere" &&
        row.floor !== "286RL" &&
        row.floor !== "301FAM" &&
        row.floor !== "321DRL" &&
        row.floor !== "325RL" &&
        row.year === 2026
    )
    expect(siblings).toEqual([])

    const heritageGlenTwins = deals.filter(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Wildwood Heritage Glen" &&
        row.year === 2026
    )
    expect(heritageGlenTwins.map((row) => row.floor).sort()).toEqual([
      "286RL",
      "321DRL",
    ])
    expect(
      heritageGlenTwins.every(
        (row) =>
          row.ask == null &&
          row.trade == null &&
          row.delta == null &&
          row.dealer === "" &&
          row.notes.length === 0
      )
    ).toBe(true)
  })

  it("applies Salem Hemisphere 321DRL ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Salem Hemisphere" &&
        row.floor === "321DRL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 55338,
      dealer: "Fun Town RV – Ottawa, KS",
      trade: 51840,
      delta: 3498,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $55,338 RV Trader (Fun Town RV – Ottawa, KS); RVT higher at $56,288 (Fun Town RV – Tyler, Mineola TX). RVT $55,338 card 404'd — excluded. Trade = 2026 JDP Low Retail $57,600 × 0.9 = $51,840 (Salem Hemisphere Series M-321DRL)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Salem+Hemisphere+321DRL-5039276994" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-salem-hemisphere-321drl/991d0d27-0bcd-11f1-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const siblings = deals.filter(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Salem Hemisphere" &&
        row.floor !== "286RL" &&
        row.floor !== "301FAM" &&
        row.floor !== "321DRL" &&
        row.floor !== "325RL" &&
        row.year === 2026
    )
    expect(siblings).toEqual([])

    const heritageGlenTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Wildwood Heritage Glen" &&
        row.floor === "321DRL" &&
        row.year === 2026
    )
    expect(heritageGlenTwin).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(heritageGlenTwin?.notes).toEqual([])
  })

  it("applies Salem Hemisphere 325RL ask and 2025 JDP proxy trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Salem Hemisphere" &&
        row.floor === "325RL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 62975,
      dealer: "Good Sense RV & Motors, Albuquerque, NM",
      trade: 40050,
      delta: 22925,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $62,975 both RV Trader and RVT (Good Sense RV & Motors, Albuquerque NM), 37 ft New 325RL. Unpriced Fremont listings excluded. TRADE FROM 2025 (not 2026): J.D. Power Low Retail $44,500 × 0.9 = $40,050 (Salem Hemisphere Series M-325RL). 2026 JDP had No Data Available — prior-year 2025 proxy used."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-Rv-Salem+Hemisphere+325RL-5039118042" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-salem-hemisphere-325rl/648ce145-f902-11f0-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const siblings = deals.filter(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Salem Hemisphere" &&
        row.floor !== "286RL" &&
        row.floor !== "301FAM" &&
        row.floor !== "321DRL" &&
        row.floor !== "325RL" &&
        row.year === 2026
    )
    expect(siblings).toEqual([])

    const heritageGlenTwins = deals.filter(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Wildwood Heritage Glen" &&
        row.year === 2026
    )
    expect(heritageGlenTwins.map((row) => row.floor).sort()).toEqual([
      "286RL",
      "321DRL",
    ])
    expect(
      heritageGlenTwins.every(
        (row) =>
          row.ask == null &&
          row.trade == null &&
          row.delta == null &&
          row.dealer === "" &&
          row.notes.length === 0
      )
    ).toBe(true)
  })

  it("applies Sandpiper 3370RLS ask and 2025 JDP proxy trade and leaves Sierra 3370RLS blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Sandpiper" &&
        row.floor === "3370RLS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 63807,
      dealer: "Carolina RV, Myrtle Beach, SC",
      trade: 36585,
      delta: 27222,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $63,807 both RV Trader + RVT (Carolina RV, Myrtle Beach SC), 36 ft New 3370RLS. TRADE FROM 2025 (not 2026): J.D. Power Low Retail $40,650 × 0.9 = $36,585 (Sandpiper by Forest River M-3370RLS). Why not 2026: 2026 JDP listed M-3370LS not exact M-3370RLS — used prior-year 2025 proxy. Source: https://www.jdpower.com/rvs/2025/sandpiper-by-forest-river/m-3370rls/6643593/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2025/sandpiper-by-forest-river/m-3370rls/6643593/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-sandpiper-3370rls/7dcb7159-eae5-11f0-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Sandpiper+3370RLS-5038916171" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const sierraTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Sierra" &&
        row.floor === "3370RLS" &&
        row.year === 2026
    )
    expect(sierraTwin).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(sierraTwin?.notes).toEqual([])
  })

  it("applies Sandstorm 2710 ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Sandstorm" &&
        row.floor === "2710" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 62980,
      dealer: "Bobby Combs RV – Yuma, AZ",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $62,980 both sites (Bobby Combs RV – Yuma, AZ), New 2026 Sandstorm 2710 toy hauler; length not listed on either site. Higher RV Trader listing $63,995. Trade blank: verified JDP miss — no 2026 or 2025 Forest River Sandstorm 2710 Low Retail. Do not use Stealth Toy Hauler M-2710 values."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /Stealth Toy Hauler/i.test(span.text) &&
            /do not use/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-sandstorm-2710/c36f7726-6e4a-11f1-adcf-02f5bff6b341/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Sandstorm+2710-5041071364" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
  })

  it("applies Wildcat 36FUN ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Wildcat" &&
        row.floor === "36FUN" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 71990,
      dealer: "Family RV Center, Sweetwater, TX",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $71,990 RVT only (Family RV Center, Sweetwater TX), 38 ft New 36FUN. RV Trader organics all over-length (42 ft). Cheaper RVT organics were 43 ft. Trade blank: verified JDP miss — 2026 Wildcat-by-Forest-River page HTTP 500 / no 36FUN; 2025 lists M-35FUN only (not a valid 36FUN proxy). Do not invent a trade. JDP URL checked: https://www.jdpower.com/rvs/2026/wildcat-by-forest-river"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /M-35FUN/i.test(span.text) &&
            /not a valid 36FUN proxy/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-wildcat-36fun/5bcca309-a467-11f1-84c9-020f812d825b/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "RV Trader")
    ).toBe(false)

    const liveTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Wildcat" &&
        row.floor === "32LIVE" &&
        row.year === 2026
    )
    expect(liveTwin).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(liveTwin?.notes).toEqual([])

    const chefTwin = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Wildcat" &&
        row.floor === "33CHEF" &&
        row.year === 2026
    )
    expect(chefTwin).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(chefTwin?.notes).toEqual([])
  })

  it("applies Wildcat XL 30BAM ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Wildcat XL" &&
        row.floor === "30BAM" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 64999,
      dealer: "Ron Hoover RV & Marine – Georgetown, TX",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $64,999 RV Trader only (Ron Hoover RV & Marine – Georgetown, TX), 35 ft New 30BAM. RVT CAPTCHA blocked. Trade blank: verified JDP miss — no Wildcat XL 30BAM on 2026/2025 JDP (Maxx/One only; wildcat-xl paths 500). Do not invent a trade."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /verified JDP miss/i.test(span.text) &&
            /no Wildcat XL 30BAM on 2026\/2025 JDP/i.test(span.text) &&
            /Maxx\/One only/i.test(span.text) &&
            /wildcat-xl paths 500/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-Rv-Wildcat+XL+30BAM-5039555993" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const galley = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Wildcat" &&
        row.floor === "37GALLEY" &&
        row.year === 2026
    )
    expect(galley).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(galley?.notes).toEqual([])
  })

  it("applies Jayco Eagle 28CRT ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "28CRT" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 56500,
      dealer: "Bus Supply Company Inc, McComb, MS",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $56,500 RV Trader (Bus Supply Company Inc, McComb MS), 33 ft New Eagle 28CRT (listing title EAGLE not Eagle HT). Excluded lower $54,991 Premium/featured Eagle 321RSTS. RVT CAPTCHA blocked cross-check. Trade blank: verified JDP miss for non-HT Eagle M-28 CRT (2026 and 2025 list M-28 CRT only under Eagle HT Series — wrong-line, not used as proxy). HT page: https://www.jdpower.com/rvs/2026/jayco/m-28-crt/6648112/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /verified JDP miss/i.test(span.text) &&
            /non-HT Eagle M-28 CRT/i.test(span.text) &&
            /Eagle HT Series/i.test(span.text) &&
            /wrong-line, not used as proxy/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-EAGLE+28CRT-5039995535" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const rsts = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "321RSTS" &&
        row.year === 2026
    )
    expect(rsts).toMatchObject({
      ask: 52698,
      dealer: "Jayco Brooksville, Brooksville, FL",
      trade: 46260,
      delta: 6438,
    })

    const htTwin = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "28CRT" &&
        row.year === 2026
    )
    expect(htTwin).toMatchObject({
      ask: 52999,
      dealer: "Terry Town Travel Center, Grand Rapids, MI",
      trade: 37620,
      delta: 15379,
    })
  })

  it("applies Jayco Eagle 321RSTS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "321RSTS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 52698,
      dealer: "Jayco Brooksville, Brooksville, FL",
      trade: 46260,
      delta: 6438,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $52,698 RV Trader (Jayco Brooksville, FL), 35.83 ft; RVT organic $54,991 Hammond. Trade from 2026 JDP Low Retail $51,400 × 0.9 = $46,260 (Jayco Eagle Series M-321 RSTS). Source: https://www.jdpower.com/rvs/2026/jayco/m-321-rsts/6648121/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-321-rsts/6648121/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-EAGLE+321RSTS-5042060324" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-jayco-eagle-321rsts/4de5c488-1e4f-11f1-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "28CRT" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 56500,
      dealer: "Bus Supply Company Inc, McComb, MS",
      trade: null,
      delta: null,
    })
  })

  it("applies Jayco Eagle 325MKTS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "325MKTS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 58995,
      dealer: "Crestview RV – Buda, Buda, TX",
      trade: 44190,
      delta: 14805,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $58,995 Crestview RV Buda TX (mirrored RV Trader + RVT), 34 ft. Trade from 2026 JDP Low Retail $49,100 × 0.9 = $44,190 (Jayco Eagle Series M-325 MKTS). Source: https://www.jdpower.com/rvs/2026/jayco/m-325-mkts/6648122/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-325-mkts/6648122/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-Eagle+325MKTS-5037885983" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-jayco-eagle-325mkts/b27b1fe5-96b6-11f0-beaa-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const mbqs = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "355MBQS" &&
        row.year === 2026
    )
    expect(mbqs).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(mbqs?.notes).toEqual([])
  })

  it("applies Jayco Eagle 335LSTS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "335LSTS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 57198,
      dealer: "Camping World, Dothan, AL",
      trade: 46890,
      delta: 10308,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $57,198 Camping World Dothan AL via RV Trader, 38.42 ft; RVT cross-check CAPTCHA-blocked. Trade from 2026 JDP Low Retail $52,100 × 0.9 = $46,890 (Jayco Eagle Series M-335 LSTS). Source: https://www.jdpower.com/rvs/2026/jayco/m-335-lsts/6648123/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-335-lsts/6648123/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-EAGLE+335LSTS-5042061038" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "325MKTS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 58995,
      dealer: "Crestview RV – Buda, Buda, TX",
      trade: 44190,
      delta: 14805,
    })
  })

  it("applies Jayco Eagle 365UKTS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "365UKTS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 57598,
      dealer: "Camping World, Georgetown, KY",
      trade: 46890,
      delta: 10708,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $57,598 Camping World Georgetown KY via RV Trader, 37.17 ft; RVT cross-check CAPTCHA-blocked. Trade from 2026 JDP Low Retail $52,100 × 0.9 = $46,890 (Jayco Eagle Series M-365 UKTS). Source: https://www.jdpower.com/rvs/2026/jayco/m-365-ukts/6648126/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-365-ukts/6648126/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-EAGLE+365UKTS-5042061371" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "335LSTS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 57198,
      dealer: "Camping World, Dothan, AL",
      trade: 46890,
      delta: 10308,
    })
  })

  it("applies Jayco Eagle HT 25RUC ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "25RUC" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 42911,
      dealer: "Bish's RV – Center Point, Urbana, IA",
      trade: 31185,
      delta: 11726,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $42,911 Bish's RV Center Point Urbana IA via RV Trader; Trader length garbled (“357 ft”), Jayco official Exterior Length overall 29'9\". RVT CAPTCHA-blocked. Trade from 2026 JDP Low Retail $34,650 × 0.9 = $31,185 (Jayco Eagle HT Series M-25 RUC). Source: https://www.jdpower.com/rvs/2026/jayco/m-25-ruc/6648109/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-25-ruc/6648109/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-Eagle+HT+25RUC-5040108553" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "26REC" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 39999,
      dealer: "Terry Town Travel Center, Grand Rapids, MI",
      trade: 31185,
      delta: 8814,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "25RUC" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()
  })

  it("applies Jayco Eagle HT 26REC ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "26REC" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 39999,
      dealer: "Terry Town Travel Center, Grand Rapids, MI",
      trade: 31185,
      delta: 8814,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $39,999 Terry Town Travel Center Grand Rapids MI (Trade Winds Clio MI same price); 29 ft; both sites. Excluded RVT Bourbon MO $39,982 (Used). Trade from 2026 JDP Low Retail $34,650 × 0.9 = $31,185 (Jayco Eagle HT Series M-26 REC). Source: https://www.jdpower.com/rvs/2026/jayco/m-26-rec/6648110/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-26-rec/6648110/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-Eagle+HT+26REC-5040249039" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-jayco-eagle-ht-26rec/33314549-43dc-11f1-adcf-02f5bff6b341/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "28CRT" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 52999,
      dealer: "Terry Town Travel Center, Grand Rapids, MI",
      trade: 37620,
      delta: 15379,
    })

    const prior = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "25RUC" &&
        row.year === 2026
    )
    expect(prior).toMatchObject({
      ask: 42911,
      dealer: "Bish's RV – Center Point, Urbana, IA",
      trade: 31185,
      delta: 11726,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "26REC" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()
  })

  it("applies Jayco Eagle HT 27MLC ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "27MLC" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 43750,
      dealer: "CW Direct By Camping World, Elkhart, IN",
      trade: 33885,
      delta: 9865,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $43,750 CW Direct Camping World Elkhart IN via RV Trader, 32.83 ft; RVT CAPTCHA-blocked. Trade from 2026 JDP Low Retail $37,650 × 0.9 = $33,885 (Jayco Eagle HT Series M-27 MLC). Source: https://www.jdpower.com/rvs/2026/jayco/m-27-mlc/6648111/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-27-mlc/6648111/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-EAGLE+HT+27MLC-5042060509" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "28CRT" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 52999,
      dealer: "Terry Town Travel Center, Grand Rapids, MI",
      trade: 37620,
      delta: 15379,
    })

    const prior = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "26REC" &&
        row.year === 2026
    )
    expect(prior).toMatchObject({
      ask: 39999,
      dealer: "Terry Town Travel Center, Grand Rapids, MI",
      trade: 31185,
      delta: 8814,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "27MLC" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()
  })

  it("applies Jayco Eagle HT 28CRT ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "28CRT" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 52999,
      dealer: "Terry Town Travel Center, Grand Rapids, MI",
      trade: 37620,
      delta: 15379,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $52,999 Terry Town Travel Center Grand Rapids MI via RV Trader, 33 ft; RVT CAPTCHA-blocked. Excluded Premium $45,991 Breaux Bridge. Trade from 2026 JDP Low Retail $41,800 × 0.9 = $37,620 (Jayco Eagle HT Series M-28 CRT). Source: https://www.jdpower.com/rvs/2026/jayco/m-28-crt/6648112/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-28-crt/6648112/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-Eagle+HT+28CRT-5040249068" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "27MLC" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 43750,
      dealer: "CW Direct By Camping World, Elkhart, IN",
      trade: 33885,
      delta: 9865,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "28CRT" &&
        row.year === 2026
    )
    expect(baseEagle).toMatchObject({
      ask: 56500,
      dealer: "Bus Supply Company Inc, McComb, MS",
      trade: null,
      delta: null,
    })
  })

  it("applies Jayco Eagle HT 29DDB ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "29DDB" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 39991,
      dealer: "Great American RV SuperStores – Hammond, Hammond, LA",
      trade: 34605,
      delta: 5386,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $39,991 Great American RV Hammond LA via RV Trader, 35 ft; RVT CAPTCHA-blocked. Trade from 2026 JDP Low Retail $38,450 × 0.9 = $34,605 (Jayco Eagle HT Series M-29 DDB). Source: https://www.jdpower.com/rvs/2026/jayco/m-29-ddb/6648114/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-29-ddb/6648114/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-Eagle+HT+29DDB-5039625011" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "29RLC" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 49677,
      dealer: "Liberty Trail RV – Sulphur Springs, Sulphur Springs, TX",
      trade: 34605,
      delta: 15072,
    })

    const prior = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "28CRT" &&
        row.year === 2026
    )
    expect(prior).toMatchObject({
      ask: 52999,
      dealer: "Terry Town Travel Center, Grand Rapids, MI",
      trade: 37620,
      delta: 15379,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "29DDB" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()
  })

  it("applies Jayco Eagle HT 29RLC ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "29RLC" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 49677,
      dealer: "Liberty Trail RV – Sulphur Springs, Sulphur Springs, TX",
      trade: 34605,
      delta: 15072,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $49,677 Liberty Trail RV Sulphur Springs TX via RV Trader, 34 ft; RVT CAPTCHA-blocked. Trade from 2026 JDP Low Retail $38,450 × 0.9 = $34,605 (Jayco Eagle HT Series M-29 RLC). Source: https://www.jdpower.com/rvs/2026/jayco/m-29-rlc/6648113/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-29-rlc/6648113/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-Eagle+HT+29RLC-5041640758" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "29DDB" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 39991,
      dealer: "Great American RV SuperStores – Hammond, Hammond, LA",
      trade: 34605,
      delta: 5386,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "29RLC" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()
  })

  it("applies Jayco Eagle HT 30CRT ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "30CRT" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 49988,
      dealer: "Jayco Carolinas, Monroe, NC",
      trade: 37935,
      delta: 12053,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $49,988 Jayco Carolinas Monroe NC via RV Trader, 34 ft; RVT CAPTCHA-blocked. Trade from 2026 JDP Low Retail $42,150 × 0.9 = $37,935 (Jayco Eagle HT Series M-30 CRT). Source: https://www.jdpower.com/rvs/2026/jayco/m-30-crt/6648115/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-30-crt/6648115/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-Eagle+HT+30CRT-5039772643" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "29RLC" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 49677,
      dealer: "Liberty Trail RV – Sulphur Springs, Sulphur Springs, TX",
      trade: 34605,
      delta: 15072,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "30CRT" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()
  })

  it("applies Jayco Eagle HT 31QCD ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "31QCD" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 50050,
      dealer: "CW Direct By Camping World, Elkhart, IN",
      trade: 37305,
      delta: 12745,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $50,050 CW Direct Camping World Elkhart IN via RV Trader, 36.67 ft; RVT CAPTCHA-blocked. Trade from 2026 JDP Low Retail $41,450 × 0.9 = $37,305 (Jayco Eagle HT Series M-31 QCD). Source: https://www.jdpower.com/rvs/2026/jayco/m-31-qcd/6648116/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-31-qcd/6648116/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-EAGLE+HT+31QCD-5042061420" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "30CRT" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 49988,
      dealer: "Jayco Carolinas, Monroe, NC",
      trade: 37935,
      delta: 12053,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "31QCD" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()
  })

  it("applies Jayco Eagle SLE 24MLE ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle SLE" &&
        row.floor === "24MLE" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 32995,
      dealer: "Couch Family RV, Cross City, FL",
      trade: 25155,
      delta: 7840,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $32,995 Couch Family RV Cross City FL via RV Trader + RVT (same inventory, 29 ft); excluded Gulfport $32,995 garbled 351 ft length. Trade from 2026 JDP Low Retail $27,950 × 0.9 = $25,155 (Jayco Eagle SLE Series M-24 MLE). Source: https://www.jdpower.com/rvs/2026/jayco/m-24-mle/6648117/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-24-mle/6648117/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-Eagle+SLE+24MLE-5037319706" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-jayco-eagle-sle-24mle/7cfb4182-6ebf-11f0-a59c-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "31QCD" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 50050,
      dealer: "CW Direct By Camping World, Elkhart, IN",
      trade: 37305,
      delta: 12745,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "24MLE" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()

    const eagleHt = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "24MLE" &&
        row.year === 2026
    )
    expect(eagleHt).toBeUndefined()
  })

  it("applies Jayco Eagle SLE 28BHU ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle SLE" &&
        row.floor === "28BHU" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 34991,
      dealer: "Great American RV SuperStores, Hammond, LA",
      trade: 27180,
      delta: 7811,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $34,991 Great American RV SuperStores Hammond LA via RV Trader + RVT (same inventory, 35 ft). Trade from 2026 JDP Low Retail $30,200 × 0.9 = $27,180 (Jayco Eagle SLE Series M-28 BHU). Source: https://www.jdpower.com/rvs/2026/jayco/m-28-bhu/6648118/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-28-bhu/6648118/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-Eagle+SLE+28BHU-5040099466" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-jayco-eagle-sle-28bhu/91a8a5dd-3ddf-11f1-adcf-02c8259c7411/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle SLE" &&
        row.floor === "24MLE" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 32995,
      dealer: "Couch Family RV, Cross City, FL",
      trade: 25155,
      delta: 7840,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "28BHU" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()

    const eagleHt = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "28BHU" &&
        row.year === 2026
    )
    expect(eagleHt).toBeUndefined()
  })

  it("applies Jayco Eagle SLE 28RKS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle SLE" &&
        row.floor === "28RKS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 39911,
      dealer: "Bish's RV – Cheyenne, Cheyenne, WY",
      trade: 27180,
      delta: 12731,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $39,911 Bish's RV Cheyenne WY via RV Trader + RVT (same inventory); listings showed 336 ft garbled — Jayco official exterior overall 30'9\" (https://www.jayco.com/rvs/fifth-wheels/2026-eagle-sle-fifth-wheels/28RKS/); excluded featured $39,995. Trade from 2026 JDP Low Retail $30,200 × 0.9 = $27,180 (Jayco Eagle SLE Series M-28 RKS). Source: https://www.jdpower.com/rvs/2026/jayco/m-28-rks/6648119/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-28-rks/6648119/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-Eagle+SLE+28RKS-5040103592" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-jayco-eagle-sle-28rks/49a6670a-3e06-11f1-adcf-02f5bff6b341/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle SLE" &&
        row.floor === "28BHU" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 34991,
      dealer: "Great American RV SuperStores, Hammond, LA",
      trade: 27180,
      delta: 7811,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "28RKS" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()

    const eagleHt = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "28RKS" &&
        row.year === 2026
    )
    expect(eagleHt).toBeUndefined()
  })

  it("applies Jayco Eagle SLE 30RLT ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle SLE" &&
        row.floor === "30RLT" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 44250,
      dealer: "CW Direct by Camping World, Elkhart, IN",
      trade: 29880,
      delta: 14370,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $44,250 CW Direct by Camping World Elkhart IN via RV Trader (34 ft); RVT cross-check $44,888 Chesaco RV Frederick MD. Excluded used $39,000. Trade from 2026 JDP Low Retail $33,200 × 0.9 = $29,880 (Jayco Eagle SLE Series M-30 RLT). Source: https://www.jdpower.com/rvs/2026/jayco/m-30-rlt/6648120/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-30-rlt/6648120/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-EAGLE+SLE+30RLT-5042064391" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-jayco-eagle-sle-30rlt/0b041c57-4b76-11f1-beaa-02f5bff6b341/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle SLE" &&
        row.floor === "28RKS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 39911,
      dealer: "Bish's RV – Cheyenne, Cheyenne, WY",
      trade: 27180,
      delta: 12731,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "30RLT" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()

    const eagleHt = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "30RLT" &&
        row.year === 2026
    )
    expect(eagleHt).toBeUndefined()
  })

  it("applies Jayco North Point 310RLTS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "North Point" &&
        row.floor === "310RLTS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 77798,
      dealer: "Camping World, Georgetown, KY",
      trade: 61605,
      delta: 16193,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $77,798 Camping World Georgetown KY via RV Trader + RVT (same inventory, 36 ft; Jayco official 36'0\"). Excluded featured $79,991/$82,999 and sold listings. Trade from 2026 JDP Low Retail $68,450 × 0.9 = $61,605 (Jayco North Point Series M-310 RLTS). Source: https://www.jdpower.com/rvs/2026/jayco/m-310-rlts/6648129/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-310-rlts/6648129/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-NORTH+POINT+310RLTS-5042061094" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-jayco-north-point-310rlts/7e00aeb6-ad11-11f1-84c9-020f812d825b/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle SLE" &&
        row.floor === "30RLT" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 44250,
      dealer: "CW Direct by Camping World, Elkhart, IN",
      trade: 29880,
      delta: 14370,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseEagle = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "310RLTS" &&
        row.year === 2026
    )
    expect(baseEagle).toBeUndefined()

    const eagleHt = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle HT" &&
        row.floor === "310RLTS" &&
        row.year === 2026
    )
    expect(eagleHt).toBeUndefined()
  })

  it("applies Jayco Pinnacle 32RLTS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Pinnacle" &&
        row.floor === "32RLTS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 84179,
      dealer: "Camping World, Davenport, IA",
      trade: 67320,
      delta: 16859,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $84,179 Camping World Davenport IA via RV Trader + RVT (same inventory; detail 36.33 ft, Jayco official ~36'0\"). Excluded featured $89,888 and used $89,911. Trade from 2026 JDP Low Retail $74,800 × 0.9 = $67,320 (Jayco Pinnacle Series M-32 RLTS). Source: https://www.jdpower.com/rvs/2026/jayco/m-32-rlts/6648137/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/jayco/m-32-rlts/6648137/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Jayco-PINNACLE+32RLTS-5042061236" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-jayco-pinnacle-32rlts/8d189ccd-ad11-11f1-84c9-020f812d825b/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "North Point" &&
        row.floor === "310RLTS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 77798,
      dealer: "Camping World, Georgetown, KY",
      trade: 61605,
      delta: 16193,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const northPointTwin = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "North Point" &&
        row.floor === "32RLTS" &&
        row.year === 2026
    )
    expect(northPointTwin).toBeUndefined()

    const eagleTwin = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Eagle" &&
        row.floor === "32RLTS" &&
        row.year === 2026
    )
    expect(eagleTwin).toBeUndefined()
  })

  it("applies Keystone Alpine 3011CK ask and 2025 JDP proxy trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine" &&
        row.floor === "3011CK" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 77998,
      dealer: "Fun Town RV–San Antonio, Cibolo, TX",
      trade: 56205,
      delta: 21793,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $77,998 Fun Town RV–San Antonio Cibolo TX via RV Trader (34 ft); RVT CAPTCHA-blocked. Trade from 2025 JDP Low Retail $62,450 × 0.9 = $56,205 (2025 proxy — 2026 Alpine had no 3011CK; Avalanche Edition excluded). Source: https://www.jdpower.com/rvs/2025/keystone-rv/m-3011-ck/6638640/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2025/keystone-rv/m-3011-ck/6638640/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Alpine+3011CK-5041565122" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Jayco" &&
        row.model === "Pinnacle" &&
        row.floor === "32RLTS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 84179,
      dealer: "Camping World, Davenport, IA",
      trade: 67320,
      delta: 16859,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const alpine3100re = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine" &&
        row.floor === "3100RE" &&
        row.year === 2026
    )
    expect(alpine3100re).toMatchObject({
      ask: 73966,
      dealer: "Holman Motors, Inc., Batavia, OH",
      trade: 55710,
      delta: 18256,
    })

    const avalancheTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine Avalanche Edition" &&
        row.floor === "3011CK" &&
        row.year === 2026
    )
    expect(avalancheTwin).toBeUndefined()

    const avalanche321 = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine Avalanche Edition" &&
        row.floor === "338GK" &&
        row.year === 2026
    )
    expect(avalanche321).toMatchObject({
      ask: 69998,
      dealer: "Fun Town RV – Amarillo, Amarillo, TX",
      trade: 53100,
      delta: 16898,
    })
  })

  it("applies Keystone Alpine 3100RE ask and 2026 JDP trade to both floor spellings", () => {
    const rows = [
      [
        "3100RE",
        "Ask $73,966 Holman Motors Batavia OH via RV Trader (34 ft); RVT CAPTCHA-blocked. Excluded Featured Grand Terrace $81,995 / Dover $77,999. Trade from 2026 JDP Low Retail $61,900 × 0.9 = $55,710 (Keystone Alpine Series M-3100 RE). Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-3100-re/6646764/values. Same values applied to duplicate floor spellings 3100RE and \"3100 RE\".",
      ],
      [
        "3100 RE",
        "Ask $73,966 Holman Motors Batavia OH via RV Trader (34 ft); RVT CAPTCHA-blocked. Excluded Featured Grand Terrace $81,995 / Dover $77,999. Trade from 2026 JDP Low Retail $61,900 × 0.9 = $55,710 (Keystone Alpine Series M-3100 RE). Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-3100-re/6646764/values. Same values applied to duplicate floor spellings 3100RE and \"3100 RE\". Duplicate catalog spelling of 3100RE.",
      ],
    ] as const
    for (const [floor, exactNote] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Keystone" &&
          row.model === "Alpine" &&
          row.floor === floor &&
          row.year === 2026
      )
      expect(deal).toMatchObject({
        ask: 73966,
        dealer: "Holman Motors, Inc., Batavia, OH",
        trade: 55710,
        delta: 18256,
      })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href ===
                "https://www.jdpower.com/rvs/2026/keystone-rv/m-3100-re/6646764/values" &&
              span.label === "JDP values"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href ===
                "https://www.rvtrader.com/listing/2026-Keystone+Rv-Alpine+3100RE-5039474643" &&
              span.label === "RV Trader"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "link" && span.label === "RVT")
      ).toBe(false)
    }

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const alpine3011 = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine" &&
        row.floor === "3011CK" &&
        row.year === 2026
    )
    expect(alpine3011).toMatchObject({
      ask: 77998,
      dealer: "Fun Town RV–San Antonio, Cibolo, TX",
      trade: 56205,
      delta: 21793,
    })
  })

  it("applies Keystone Alpine 3303CK ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine" &&
        row.floor === "3303CK" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 75524,
      dealer: "Camping World, Tyler, TX",
      trade: 62505,
      delta: 13019,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $75,524 Camping World Tyler TX via RV Trader (37.25 ft); RVT CAPTCHA-blocked. Trade from 2026 JDP Low Retail $69,450 × 0.9 = $62,505 (Keystone Alpine Series M-3303 CK). Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-3303-ck/6646765/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-3303-ck/6646765/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-ALPINE+3303CK-5042060274" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine" &&
        row.floor === "3100RE" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 73966,
      dealer: "Holman Motors, Inc., Batavia, OH",
      trade: 55710,
      delta: 18256,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const avalancheTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine Avalanche Edition" &&
        row.floor === "3303CK" &&
        row.year === 2026
    )
    expect(avalancheTwin).toBeUndefined()

    const avalanche338 = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine Avalanche Edition" &&
        row.floor === "338GK" &&
        row.year === 2026
    )
    expect(avalanche338).toMatchObject({
      ask: 69998,
      dealer: "Fun Town RV – Amarillo, Amarillo, TX",
      trade: 53100,
      delta: 16898,
    })
  })

  it("applies Keystone Alpine Avalanche Edition 321RL ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine Avalanche Edition" &&
        row.floor === "321RL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 66988,
      dealer: "RV Roadway, Calera, AL",
      trade: 51615,
      delta: 15373,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $66,988 RV Roadway Calera AL via RV Trader + RVT (same inventory, 37 ft); Avalanche Edition confirmed. Trade from 2026 JDP Low Retail $57,350 × 0.9 = $51,615 (Keystone Alpine Avalanche Edition Series M-321 RL). Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-321-rl/6646771/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-321-rl/6646771/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-Alpine+Avalanche+Edition+321RL-5040718397" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-keystone-alpine-avalanche-edition-321rl/c80b62ea-563a-11f1-adcf-02f5bff6b341/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine" &&
        row.floor === "3303CK" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 75524,
      dealer: "Camping World, Tyler, TX",
      trade: 62505,
      delta: 13019,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseAlpine = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine" &&
        row.floor === "321RL" &&
        row.year === 2026
    )
    expect(baseAlpine).toBeUndefined()

    const plainAvalanche = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Avalanche" &&
        row.floor === "321RL" &&
        row.year === 2026
    )
    expect(plainAvalanche).toMatchObject({
      ask: 76995,
      dealer: "Bish's RV – Anderson, IN, Anderson, IN",
      trade: null,
      delta: null,
    })
    expect(plainAvalanche?.trade).toBeNull()
    expect(plainAvalanche?.delta).toBeNull()
    expect(
      plainAvalanche?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
  })

  it("applies Keystone Alpine Avalanche Edition 338GK ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine Avalanche Edition" &&
        row.floor === "338GK" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 69998,
      dealer: "Fun Town RV – Amarillo, Amarillo, TX",
      trade: 53100,
      delta: 16898,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $69,998 Fun Town RV Amarillo TX via RV Trader (RVT CAPTCHA). Avalanche Edition confirmed. Trade from 2026 JDP Low Retail $59,000 × 0.9 = $53,100. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-338-gk/6646772/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-338-gk/6646772/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Alpine+Avalanche+Edition+338GK-5041565134#sid=195275" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine Avalanche Edition" &&
        row.floor === "321RL" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 66988,
      dealer: "RV Roadway, Calera, AL",
      trade: 51615,
      delta: 15373,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseAlpine = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine" &&
        row.floor === "338GK" &&
        row.year === 2026
    )
    expect(baseAlpine).toBeUndefined()

    const plainAvalanche = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Avalanche" &&
        row.floor === "338GK" &&
        row.year === 2026
    )
    expect(plainAvalanche).toBeUndefined()
  })

  it("applies Keystone Avalanche 321RL ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Avalanche" &&
        row.floor === "321RL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 76995,
      dealer: "Bish's RV – Anderson, IN, Anderson, IN",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $76,995 Bish's RV – Anderson, IN, Anderson, IN via RV Trader (36.5 ft). Ask only. RVT CAPTCHA-blocked; Trader-only. Lower asks excluded as Alpine Avalanche Edition. Length 36.5 ft from same-plan specs. Verified JDP miss: 2026/2025 have Alpine Avalanche Edition M-321 RL only — no base Avalanche; trade left blank (no wrong-line proxy)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /verified JDP miss/i.test(span.text) &&
            /Alpine Avalanche Edition M-321 RL only/i.test(span.text) &&
            /no base Avalanche/i.test(span.text) &&
            /no wrong-line proxy/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Avalanche+321RL-5040108874" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const editionTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine Avalanche Edition" &&
        row.floor === "321RL" &&
        row.year === 2026
    )
    expect(editionTwin).toMatchObject({
      ask: 66988,
      dealer: "RV Roadway, Calera, AL",
      trade: 51615,
      delta: 15373,
    })
    expect(deal?.trade).not.toBe(editionTwin?.trade)
    expect(deal?.ask).not.toBe(editionTwin?.ask)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Avalanche" &&
        row.floor === "302RS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(sibling?.notes).toEqual([])

    const nextCougar = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "24RDS" &&
        row.year === 2026
    )
    expect(nextCougar).toMatchObject({
      ask: 43434,
      dealer: "Camping World (San Diego, CA), San Diego, CA",
      trade: 34110,
      delta: 9324,
    })

    const baseAlpine = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine" &&
        row.floor === "321RL" &&
        row.year === 2026
    )
    expect(baseAlpine).toBeUndefined()
  })

  it("applies Keystone Arcadia 3260RL ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia" &&
        row.floor === "3260RL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 58567,
      dealer: "Buckeye RV Jeffersonville, Jeffersonville, OH",
      trade: 48690,
      delta: 9877,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $58,567 Buckeye RV Jeffersonville OH via RV Trader (RVT CAPTCHA). Trade from 2026 JDP Low Retail $54,100 × 0.9 = $48,690. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-3260-rl/6646954/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-3260-rl/6646954/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-ARCADIA+3260RL-5038058139" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Alpine Avalanche Edition" &&
        row.floor === "338GK" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 69998,
      dealer: "Fun Town RV – Amarillo, Amarillo, TX",
      trade: 53100,
      delta: 16898,
    })

    const selectPriced = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "21SRK" &&
        row.year === 2026
    )
    expect(selectPriced).toMatchObject({
      ask: 34995,
      dealer: "Bish's RV, Anderson, IN",
      trade: 26325,
      delta: 8670,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const selectTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "3260RL" &&
        row.year === 2026
    )
    expect(selectTwin).toBeUndefined()

    const superLite = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.year === 2026
    )
    expect(superLite.length).toBeGreaterThan(0)
    expect(superLite.find((row) => row.floor === "242SLMD")).toMatchObject({
      ask: 43692,
      dealer: "Buckeye RV Jeffersonville, Jeffersonville, OH",
      trade: 38565,
      delta: 5127,
    })
    expect(superLite.find((row) => row.floor === "260SLCL")).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })
    expect(
      superLite
        .filter(
          (row) =>
            row.floor !== "242SLMD" &&
            row.floor !== "260SLCL" &&
            row.floor !== "292SLRL" &&
            row.floor !== "294SLRD" &&
            row.floor !== "308SLBH"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Arcadia Select 21SRK ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "21SRK" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 34995,
      dealer: "Bish's RV, Anderson, IN",
      trade: 26325,
      delta: 8670,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $34,995 Bish's RV Anderson IN via RV Trader (same on RVT; CAPTCHA blocked sort). Length 32'7\" (Trader garbled 327 ft). Trade from 2026 JDP Low Retail $29,250 × 0.9 = $26,325. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-21-srk/6646778/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-21-srk/6646778/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Arcadia+Select+21SRK-5040108798" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "25SRD" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 32800,
      dealer: "Zoomers RV, Wabash, IN",
      trade: 26910,
      delta: 5890,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseArcadia = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia" &&
        row.floor === "21SRK" &&
        row.year === 2026
    )
    expect(baseArcadia).toBeUndefined()

    const superLite = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "21SRK" &&
        row.year === 2026
    )
    expect(superLite).toBeUndefined()
  })

  it("applies Keystone Arcadia Select 24SRE ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "24SRE" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 38998,
      dealer: "Fun Town RV – Texarkana, Texarkana, AR",
      trade: 27585,
      delta: 11413,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $38,998 Fun Town RV Texarkana AR via RV Trader (RVT CAPTCHA). Trade from 2026 JDP Low Retail $30,650 × 0.9 = $27,585. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-24-sre/6646779/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-24-sre/6646779/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Arcadia+Select+24SRE-5041565190" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "21SRK" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 34995,
      dealer: "Bish's RV, Anderson, IN",
      trade: 26325,
      delta: 8670,
    })

    const nextPriced = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "25SRD" &&
        row.year === 2026
    )
    expect(nextPriced).toMatchObject({
      ask: 32800,
      dealer: "Zoomers RV, Wabash, IN",
      trade: 26910,
      delta: 5890,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseArcadia = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia" &&
        row.floor === "24SRE" &&
        row.year === 2026
    )
    expect(baseArcadia).toBeUndefined()

    const superLite = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "24SRE" &&
        row.year === 2026
    )
    expect(superLite).toBeUndefined()
  })

  it("applies Keystone Arcadia Select 25SRD ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "25SRD" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 32800,
      dealer: "Zoomers RV, Wabash, IN",
      trade: 26910,
      delta: 5890,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $32,800 Zoomers RV Wabash IN via RV Trader (RVT CAPTCHA). Trade from 2026 JDP Low Retail $29,900 × 0.9 = $26,910. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-25-srd/6646780/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-25-srd/6646780/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-Arcadia+Select+25SRD-5040041464#sid=605387" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "24SRE" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 38998,
      dealer: "Fun Town RV – Texarkana, Texarkana, AR",
      trade: 27585,
      delta: 11413,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseArcadia = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia" &&
        row.floor === "25SRD" &&
        row.year === 2026
    )
    expect(baseArcadia).toBeUndefined()

    const superLite = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "25SRD" &&
        row.year === 2026
    )
    expect(superLite).toBeUndefined()
  })

  it("applies Keystone Arcadia Select 27SBH ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "27SBH" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 33999,
      dealer: "Gillette Interstate RV, Haslett, MI",
      trade: 27585,
      delta: 6414,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $33,999 Gillette Interstate RV Haslett MI via RV Trader (RVT CAPTCHA). Trade from 2026 JDP Low Retail $30,650 × 0.9 = $27,585. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-27-sbh/6646781/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-27-sbh/6646781/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-Arcadia+Select+27SBH-5040248450" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "25SRD" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 32800,
      dealer: "Zoomers RV, Wabash, IN",
      trade: 26910,
      delta: 5890,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const filled28sls = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "28SLS" &&
        row.year === 2026
    )
    expect(filled28sls).toMatchObject({
      ask: 34995,
      dealer: "Schieks RV - Fond du lac, WI, Fond Du Lac, WI",
      trade: 29610,
      delta: 5385,
    })

    const baseArcadia = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia" &&
        row.floor === "27SBH" &&
        row.year === 2026
    )
    expect(baseArcadia).toBeUndefined()

    const superLite = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "27SBH" &&
        row.year === 2026
    )
    expect(superLite).toBeUndefined()
  })

  it("applies Keystone Arcadia Select 28SLS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "28SLS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 34995,
      dealer: "Schieks RV - Fond du lac, WI, Fond Du Lac, WI",
      trade: 29610,
      delta: 5385,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $34,995 Schieks RV Fond Du Lac WI via RV Trader (RVT CAPTCHA). Trade from 2026 JDP Low Retail $32,900 × 0.9 = $29,610. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-28-sls/6646782/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-28-sls/6646782/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Arcadia+Select+28SLS-5038791286" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "27SBH" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 33999,
      dealer: "Gillette Interstate RV, Haslett, MI",
      trade: 27585,
      delta: 6414,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseArcadia = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia" &&
        row.floor === "28SLS" &&
        row.year === 2026
    )
    expect(baseArcadia).toBeUndefined()

    const superLite = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "28SLS" &&
        row.year === 2026
    )
    expect(superLite).toBeUndefined()
  })

  it("applies Keystone Arcadia Super Lite 242SLMD ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "242SLMD" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 43692,
      dealer: "Buckeye RV Jeffersonville, Jeffersonville, OH",
      trade: 38565,
      delta: 5127,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $43,692 Buckeye RV Jeffersonville OH via RV Trader (RVT CAPTCHA; indexed RVT $43,857 not cheaper). Trade from 2026 JDP Low Retail $42,850 × 0.9 = $38,565. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-242-slmd/6646783/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-242-slmd/6646783/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-ARCADIA+SUPER+LITE+242SLMD-5037875238" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "28SLS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 34995,
      dealer: "Schieks RV - Fond du lac, WI, Fond Du Lac, WI",
      trade: 29610,
      delta: 5385,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const laterPriced = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "292SLRL" &&
        row.year === 2026
    )
    expect(laterPriced).toMatchObject({
      ask: 46295,
      dealer: "Camping World (Kansas City, KS), Kansas City, KS",
      trade: 43110,
      delta: 3185,
    })

    const baseArcadia = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia" &&
        row.floor === "242SLMD" &&
        row.year === 2026
    )
    expect(baseArcadia).toBeUndefined()

    const selectTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "242SLMD" &&
        row.year === 2026
    )
    expect(selectTwin).toBeUndefined()
  })

  it("applies Keystone Arcadia Super Lite 260SLCL ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $43,694 Camping World Scott City MO via RV Trader (RVT CAPTCHA; includes freight/prep/docs). Trade from 2026 JDP Low Retail $45,050 × 0.9 = $40,545. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-260-slcl/6646784/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-260-slcl/6646784/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-ARCADIA+SUPER+LITE+260SLCL-5042059662" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "242SLMD" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 43692,
      dealer: "Buckeye RV Jeffersonville, Jeffersonville, OH",
      trade: 38565,
      delta: 5127,
    })

    const laterPriced = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "308SLBH" &&
        row.year === 2026
    )
    expect(laterPriced).toMatchObject({
      ask: 47995,
      dealer: "Ski's Truck & RV Sales, Rockville, IN",
      trade: 38160,
      delta: 9835,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Avalanche" &&
        row.floor === "302RS" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const baseArcadia = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(baseArcadia).toBeUndefined()

    const selectTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(selectTwin).toBeUndefined()
  })

  it("applies Keystone Arcadia Super Lite 292SLRL ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "292SLRL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 46295,
      dealer: "Camping World (Kansas City, KS), Kansas City, KS",
      trade: 43110,
      delta: 3185,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $46,295 Camping World (Kansas City, KS), Kansas City, KS via RV Trader (29.25 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. 2026 JDP Low Retail $47,900 → trade $43,110. Trade from 2026 JDP Low Retail $47,900 × 0.9 = $43,110. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-292-slrl/6646785/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-292-slrl/6646785/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-ARCADIA+SUPER+LITE+292SLRL-5042060801" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "28SLS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 34995,
      dealer: "Schieks RV - Fond du lac, WI, Fond Du Lac, WI",
      trade: 29610,
      delta: 5385,
    })

    const laterPriced308 = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "308SLBH" &&
        row.year === 2026
    )
    expect(laterPriced308).toMatchObject({
      ask: 47995,
      dealer: "Ski's Truck & RV Sales, Rockville, IN",
      trade: 38160,
      delta: 9835,
    })

    const priorBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(priorBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const filled294 = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "294SLRD" &&
        row.year === 2026
    )
    expect(filled294).toMatchObject({
      ask: 49379,
      dealer: "Camping World (Coldwater, MI), Coldwater, MI",
      trade: 43605,
      delta: 5774,
    })

    const baseArcadia = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia" &&
        row.floor === "292SLRL" &&
        row.year === 2026
    )
    expect(baseArcadia).toBeUndefined()

    const selectTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "292SLRL" &&
        row.year === 2026
    )
    expect(selectTwin).toBeUndefined()
  })

  it("applies Keystone Arcadia Super Lite 294SLRD ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "294SLRD" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 49379,
      dealer: "Camping World (Coldwater, MI), Coldwater, MI",
      trade: 43605,
      delta: 5774,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $49,379 Camping World Coldwater MI via RV Trader (33.17 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Trade from 2026 JDP Low Retail $48,450 × 0.9 = $43,605. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-294-slrd/6646786/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-294-slrd/6646786/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-ARCADIA+SUPER+LITE+294SLRD-5042061928" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "292SLRL" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 46295,
      dealer: "Camping World (Kansas City, KS), Kansas City, KS",
      trade: 43110,
      delta: 3185,
    })

    const laterPriced308 = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "308SLBH" &&
        row.year === 2026
    )
    expect(laterPriced308).toMatchObject({
      ask: 47995,
      dealer: "Ski's Truck & RV Sales, Rockville, IN",
      trade: 38160,
      delta: 9835,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Avalanche" &&
        row.floor === "302RS" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const priorPriced = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "242SLMD" &&
        row.year === 2026
    )
    expect(priorPriced).toMatchObject({
      ask: 43692,
      dealer: "Buckeye RV Jeffersonville, Jeffersonville, OH",
      trade: 38565,
      delta: 5127,
    })

    const stillBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(stillBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const baseArcadia = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia" &&
        row.floor === "294SLRD" &&
        row.year === 2026
    )
    expect(baseArcadia).toBeUndefined()

    const selectTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "294SLRD" &&
        row.year === 2026
    )
    expect(selectTwin).toBeUndefined()
  })

  it("applies Keystone Arcadia Super Lite 308SLBH ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "308SLBH" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 47995,
      dealer: "Ski's Truck & RV Sales, Rockville, IN",
      trade: 38160,
      delta: 9835,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $47,995 Ski's Truck & RV Sales, Rockville, IN via RV Trader (34 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. 2026 JDP Low Retail $42,400 → trade $38,160. Trade from 2026 JDP Low Retail $42,400 × 0.9 = $38,160. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-308-slbh/6646787/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-308-slbh/6646787/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-Arcadia+Super+Lite+308SLBH-5038481188" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "294SLRD" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 49379,
      dealer: "Camping World (Coldwater, MI), Coldwater, MI",
      trade: 43605,
      delta: 5774,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Avalanche" &&
        row.floor === "302RS" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const stillBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "260SLCL" &&
        row.year === 2026
    )
    expect(stillBlank).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })

    const otherSuperLite = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.year === 2026
    )
    expect(
      otherSuperLite
        .filter(
          (row) =>
            row.floor !== "242SLMD" &&
            row.floor !== "260SLCL" &&
            row.floor !== "292SLRL" &&
            row.floor !== "294SLRD" &&
            row.floor !== "308SLBH"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)

    const earlierPriced = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Super Lite" &&
        row.floor === "242SLMD" &&
        row.year === 2026
    )
    expect(earlierPriced).toMatchObject({
      ask: 43692,
      dealer: "Buckeye RV Jeffersonville, Jeffersonville, OH",
      trade: 38565,
      delta: 5127,
    })

    const baseArcadia = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia" &&
        row.floor === "308SLBH" &&
        row.year === 2026
    )
    expect(baseArcadia).toBeUndefined()

    const selectTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Arcadia Select" &&
        row.floor === "308SLBH" &&
        row.year === 2026
    )
    expect(selectTwin).toBeUndefined()
  })

  it("applies Keystone Cougar 24RDS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "24RDS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 43434,
      dealer: "Camping World (San Diego, CA), San Diego, CA",
      trade: 34110,
      delta: 9324,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $43,434 Camping World (San Diego, CA), San Diego, CA via RV Trader (28.83 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified base Cougar (not Half-Ton/Sport). 2026 JDP Low Retail $37,900 → trade $34,110. Trade from 2026 JDP Low Retail $37,900 × 0.9 = $34,110. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-24-rds/6646965/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-24-rds/6646965/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-COUGAR+24RDS-5042060579" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Avalanche" &&
        row.floor === "321RL" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 76995,
      dealer: "Bish's RV – Anderson, IN, Anderson, IN",
      trade: null,
      delta: null,
    })

    const nextCougar = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "260MLE" &&
        row.year === 2026
    )
    expect(nextCougar).toMatchObject({
      ask: 55900,
      dealer: "Marlette RV, Marlette, MI",
      trade: 44505,
      delta: 11395,
    })

    const halfTonTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "24RDS" &&
        row.year === 2026
    )
    expect(halfTonTwin).toMatchObject({
      ask: 44995,
      dealer: "Alpin Haus - Orange County, Middletown, NY",
      trade: null,
      delta: null,
    })
    expect(halfTonTwin?.notes.length).toBeGreaterThan(0)
    expect(halfTonTwin?.trade).not.toBe(deal?.trade)
    expect(halfTonTwin?.ask).not.toBe(deal?.ask)

    const sportTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Sport" &&
        row.floor === "24RDS" &&
        row.year === 2026
    )
    expect(sportTwin).toBeUndefined()

    const otherCougar = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.year === 2026
    )
    expect(
      otherCougar
        .filter(
          (row) =>
            row.floor !== "24RDS" &&
            row.floor !== "260MLE" &&
            row.floor !== "27SGS" &&
            row.floor !== "290RLS" &&
            row.floor !== "316RLS" &&
            row.floor !== "320RDS" &&
            row.floor !== "32BHS" &&
            row.floor !== "350LLK" &&
            row.floor !== "355FBS" &&
            row.floor !== "360MBI" &&
            row.floor !== "364BHL"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar 260MLE ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "260MLE" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 55900,
      dealer: "Marlette RV, Marlette, MI",
      trade: 44505,
      delta: 11395,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $55,900 Marlette RV, Marlette, MI via RV Trader (30 ft); RVT direct listing also $55,900 (Marlette); search CAPTCHA skipped. Featured/Premium excluded. Verified base Cougar (not Half-Ton/Sport). 2026 JDP Low Retail $49,450 → trade $44,505. Trade from 2026 JDP Low Retail $49,450 × 0.9 = $44,505. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-260-mle/6646956/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-260-mle/6646956/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Cougar+260MLE-5040294058" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-keystone-cougar-260mle/9a7b50e8-4469-11f1-adcf-02f5bff6b341/" &&
            span.label === "RVT"
        )
    ).toBe(true)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "24RDS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 43434,
      dealer: "Camping World (San Diego, CA), San Diego, CA",
      trade: 34110,
      delta: 9324,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })

    const halfTonTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "260MLE" &&
        row.year === 2026
    )
    expect(halfTonTwin).toBeUndefined()

    const halfTon23 = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "23MLE" &&
        row.year === 2026
    )
    expect(halfTon23).toMatchObject({
      ask: 41745,
      dealer: "Dad's Camper Outlet, Picayune, MS",
      trade: null,
      delta: null,
    })
    expect(halfTon23?.notes.length).toBeGreaterThan(0)

    const sportTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Sport" &&
        row.floor === "260MLE" &&
        row.year === 2026
    )
    expect(sportTwin).toBeUndefined()

    const otherCougar = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.year === 2026
    )
    expect(
      otherCougar
        .filter(
          (row) =>
            row.floor !== "24RDS" &&
            row.floor !== "260MLE" &&
            row.floor !== "27SGS" &&
            row.floor !== "290RLS" &&
            row.floor !== "316RLS" &&
            row.floor !== "320RDS" &&
            row.floor !== "32BHS" &&
            row.floor !== "350LLK" &&
            row.floor !== "355FBS" &&
            row.floor !== "360MBI" &&
            row.floor !== "364BHL"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar 27SGS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "27SGS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 47224,
      dealer: "Camping World, Myrtle Beach, SC",
      trade: 36810,
      delta: 10414,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $47,224 Camping World, Myrtle Beach, SC via RV Trader (30.5 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified base Cougar (not Half-Ton/Sport). 2026 JDP Low Retail $40,900 → trade $36,810. Trade from 2026 JDP Low Retail $40,900 × 0.9 = $36,810. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-27-sgs/6646968/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-27-sgs/6646968/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-COUGAR+27SGS-5042061151" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "260MLE" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 55900,
      dealer: "Marlette RV, Marlette, MI",
      trade: 44505,
      delta: 11395,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })

    const halfTonTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "27SGS" &&
        row.year === 2026
    )
    expect(halfTonTwin).toMatchObject({
      ask: 41452,
      dealer: "McKee Auto Center, Perry, IA",
      trade: null,
      delta: null,
    })
    expect(halfTonTwin?.notes.length).toBeGreaterThan(0)
    expect(halfTonTwin?.trade).not.toBe(deal?.trade)
    expect(halfTonTwin?.ask).not.toBe(deal?.ask)

    const sportTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Sport" &&
        row.floor === "27SGS" &&
        row.year === 2026
    )
    expect(sportTwin).toBeUndefined()

    const otherCougar = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.year === 2026
    )
    expect(
      otherCougar
        .filter(
          (row) =>
            row.floor !== "24RDS" &&
            row.floor !== "260MLE" &&
            row.floor !== "27SGS" &&
            row.floor !== "290RLS" &&
            row.floor !== "316RLS" &&
            row.floor !== "320RDS" &&
            row.floor !== "32BHS" &&
            row.floor !== "350LLK" &&
            row.floor !== "355FBS" &&
            row.floor !== "360MBI" &&
            row.floor !== "364BHL"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar 290RLS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "290RLS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 61995,
      dealer: "Crestview RV Superstore, Selma, TX",
      trade: 45900,
      delta: 16095,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $61,995 Crestview RV Superstore, Selma, TX via RV Trader (33 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified base Cougar (not Half-Ton/Sport). 2026 JDP Low Retail $51,000 → trade $45,900. Trade from 2026 JDP Low Retail $51,000 × 0.9 = $45,900. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-290-rls/6646957/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-290-rls/6646957/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Cougar+290RLS-5038525826" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "27SGS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 47224,
      dealer: "Camping World, Myrtle Beach, SC",
      trade: 36810,
      delta: 10414,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })

    const halfTonTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "290RLS" &&
        row.year === 2026
    )
    expect(halfTonTwin).toBeUndefined()

    const sportTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Sport" &&
        row.floor === "290RLS" &&
        row.year === 2026
    )
    expect(sportTwin).toBeUndefined()

    const otherCougar = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.year === 2026
    )
    expect(
      otherCougar
        .filter(
          (row) =>
            row.floor !== "24RDS" &&
            row.floor !== "260MLE" &&
            row.floor !== "27SGS" &&
            row.floor !== "290RLS" &&
            row.floor !== "316RLS" &&
            row.floor !== "320RDS" &&
            row.floor !== "32BHS" &&
            row.floor !== "350LLK" &&
            row.floor !== "355FBS" &&
            row.floor !== "360MBI" &&
            row.floor !== "364BHL"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar 316RLS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "316RLS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 57204,
      dealer: "Bayird RV - Outdoor & Marine, Mountain Home, AR",
      trade: 47340,
      delta: 9864,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $57,204 Bayird RV - Outdoor & Marine, Mountain Home, AR via RV Trader (35 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified base Cougar (not Half-Ton/Sport). 2026 JDP Low Retail $52,600 → trade $47,340. Trade from 2026 JDP Low Retail $52,600 × 0.9 = $47,340. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-316-rls/6646958/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-316-rls/6646958/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Cougar+316RLS-5040655768" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "290RLS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 61995,
      dealer: "Crestview RV Superstore, Selma, TX",
      trade: 45900,
      delta: 16095,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })

    const halfTonTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "316RLS" &&
        row.year === 2026
    )
    expect(halfTonTwin).toBeUndefined()

    const sportTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Sport" &&
        row.floor === "316RLS" &&
        row.year === 2026
    )
    expect(sportTwin).toBeUndefined()

    const otherCougar = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.year === 2026
    )
    expect(
      otherCougar
        .filter(
          (row) =>
            row.floor !== "24RDS" &&
            row.floor !== "260MLE" &&
            row.floor !== "27SGS" &&
            row.floor !== "290RLS" &&
            row.floor !== "316RLS" &&
            row.floor !== "320RDS" &&
            row.floor !== "32BHS" &&
            row.floor !== "350LLK" &&
            row.floor !== "355FBS" &&
            row.floor !== "360MBI" &&
            row.floor !== "364BHL"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar 320RDS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "320RDS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 58796,
      dealer: "Buckeye RV Wilmington, Wilmington, OH",
      trade: 48375,
      delta: 10421,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $58,796 Buckeye RV Wilmington, Wilmington, OH via RV Trader (37 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified base Cougar (not Half-Ton/Sport). 2026 JDP Low Retail $53,750 → trade $48,375. Trade from 2026 JDP Low Retail $53,750 × 0.9 = $48,375. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-320-rds/6646959/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-320-rds/6646959/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-COUGAR+320RDS-5038838740" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "316RLS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 57204,
      dealer: "Bayird RV - Outdoor & Marine, Mountain Home, AR",
      trade: 47340,
      delta: 9864,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })

    const halfTonTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "320RDS" &&
        row.year === 2026
    )
    expect(halfTonTwin).toBeUndefined()

    const sportTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Sport" &&
        row.floor === "320RDS" &&
        row.year === 2026
    )
    expect(sportTwin).toBeUndefined()

    const otherCougar = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.year === 2026
    )
    expect(
      otherCougar
        .filter(
          (row) =>
            row.floor !== "24RDS" &&
            row.floor !== "260MLE" &&
            row.floor !== "27SGS" &&
            row.floor !== "290RLS" &&
            row.floor !== "316RLS" &&
            row.floor !== "320RDS" &&
            row.floor !== "32BHS" &&
            row.floor !== "350LLK" &&
            row.floor !== "355FBS" &&
            row.floor !== "360MBI" &&
            row.floor !== "364BHL"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar 32BHS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "32BHS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 58098,
      dealer: "Camping World, Dover, FL",
      trade: 39870,
      delta: 18228,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $58,098 Camping World, Dover, FL via RV Trader (35.67 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified base Cougar fifth-wheel (not Half-Ton/Sport; not TT entry). 2026 JDP Low Retail $44,300 → trade $39,870. Trade from 2026 JDP Low Retail $44,300 × 0.9 = $39,870. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-32-bhs/6646973/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-32-bhs/6646973/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-COUGAR+32BHS-5042063274" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "320RDS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 58796,
      dealer: "Buckeye RV Wilmington, Wilmington, OH",
      trade: 48375,
      delta: 10421,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })

    const halfTonTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "32BHS" &&
        row.year === 2026
    )
    expect(halfTonTwin).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(halfTonTwin?.notes).toEqual([])

    const sportTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Sport" &&
        row.floor === "32BHS" &&
        row.year === 2026
    )
    expect(sportTwin).toBeUndefined()

    const otherCougar = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.year === 2026
    )
    expect(
      otherCougar
        .filter(
          (row) =>
            row.floor !== "24RDS" &&
            row.floor !== "260MLE" &&
            row.floor !== "27SGS" &&
            row.floor !== "290RLS" &&
            row.floor !== "316RLS" &&
            row.floor !== "320RDS" &&
            row.floor !== "32BHS" &&
            row.floor !== "350LLK" &&
            row.floor !== "355FBS" &&
            row.floor !== "360MBI" &&
            row.floor !== "364BHL"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar 350LLK ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "350LLK" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 66402,
      dealer: "Bayird RV - Outdoor & Marine, Mountain Home, AR",
      trade: 48825,
      delta: 17577,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $66,402 Bayird RV - Outdoor & Marine, Mountain Home, AR via RV Trader (39 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified base Cougar (not Half-Ton/Sport). 2026 JDP Low Retail $54,250 → trade $48,825. Trade from 2026 JDP Low Retail $54,250 × 0.9 = $48,825. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-350-llk/6646960/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-350-llk/6646960/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Cougar+350LLK-5039740070" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "32BHS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 58098,
      dealer: "Camping World, Dover, FL",
      trade: 39870,
      delta: 18228,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })

    const halfTonTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "350LLK" &&
        row.year === 2026
    )
    expect(halfTonTwin).toBeUndefined()

    const sportTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Sport" &&
        row.floor === "350LLK" &&
        row.year === 2026
    )
    expect(sportTwin).toBeUndefined()

    const otherCougar = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.year === 2026
    )
    expect(
      otherCougar
        .filter(
          (row) =>
            row.floor !== "24RDS" &&
            row.floor !== "260MLE" &&
            row.floor !== "27SGS" &&
            row.floor !== "290RLS" &&
            row.floor !== "316RLS" &&
            row.floor !== "320RDS" &&
            row.floor !== "32BHS" &&
            row.floor !== "350LLK" &&
            row.floor !== "355FBS" &&
            row.floor !== "360MBI" &&
            row.floor !== "364BHL"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar 355FBS ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "355FBS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 63985,
      dealer: "Meyer's RV Superstore Ripley, Ripley, WV",
      trade: 50625,
      delta: 13360,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $63,985 Meyer's RV Superstore Ripley, Ripley, WV via RV Trader (39 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified base Cougar (not Half-Ton/Sport). 2026 JDP Low Retail $56,250 → trade $50,625. Trade from 2026 JDP Low Retail $56,250 × 0.9 = $50,625. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-355-fbs/6646961/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-355-fbs/6646961/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Cougar+355FBS-5037199507" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "350LLK" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 66402,
      dealer: "Bayird RV - Outdoor & Marine, Mountain Home, AR",
      trade: 48825,
      delta: 17577,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })

    const halfTonTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "355FBS" &&
        row.year === 2026
    )
    expect(halfTonTwin).toBeUndefined()

    const sportTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Sport" &&
        row.floor === "355FBS" &&
        row.year === 2026
    )
    expect(sportTwin).toBeUndefined()

    const otherCougar = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.year === 2026
    )
    expect(
      otherCougar
        .filter(
          (row) =>
            row.floor !== "24RDS" &&
            row.floor !== "260MLE" &&
            row.floor !== "27SGS" &&
            row.floor !== "290RLS" &&
            row.floor !== "316RLS" &&
            row.floor !== "320RDS" &&
            row.floor !== "32BHS" &&
            row.floor !== "350LLK" &&
            row.floor !== "355FBS" &&
            row.floor !== "360MBI" &&
            row.floor !== "364BHL"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar 360MBI ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "360MBI" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 66698,
      dealer: "Camping World, Oshkosh, WI",
      trade: 51525,
      delta: 15173,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $66,698 Camping World, Oshkosh, WI via RV Trader (39.25 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified base Cougar (not Half-Ton/Sport). 2026 JDP Low Retail $57,250 → trade $51,525. Trade from 2026 JDP Low Retail $57,250 × 0.9 = $51,525. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-360-mbi/6646962/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-360-mbi/6646962/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-COUGAR+360MBI-5042062259" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "355FBS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 63985,
      dealer: "Meyer's RV Superstore Ripley, Ripley, WV",
      trade: 50625,
      delta: 13360,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })

    const halfTonTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "360MBI" &&
        row.year === 2026
    )
    expect(halfTonTwin).toBeUndefined()

    const sportTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Sport" &&
        row.floor === "360MBI" &&
        row.year === 2026
    )
    expect(sportTwin).toBeUndefined()

    const otherCougar = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.year === 2026
    )
    expect(
      otherCougar
        .filter(
          (row) =>
            row.floor !== "24RDS" &&
            row.floor !== "260MLE" &&
            row.floor !== "27SGS" &&
            row.floor !== "290RLS" &&
            row.floor !== "316RLS" &&
            row.floor !== "320RDS" &&
            row.floor !== "32BHS" &&
            row.floor !== "350LLK" &&
            row.floor !== "355FBS" &&
            row.floor !== "360MBI" &&
            row.floor !== "364BHL"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar 364BHL ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $62,379 Camping World, Davenport, IA via RV Trader (39 ft); RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified base Cougar (not Half-Ton/Sport). 2026 JDP Low Retail $54,650 → trade $49,185. Trade from 2026 JDP Low Retail $54,650 × 0.9 = $49,185. Source: https://www.jdpower.com/rvs/2026/keystone-rv/m-364-bhl/6646963/values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/keystone-rv/m-364-bhl/6646963/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-COUGAR+364BHL-5042060791" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "360MBI" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 66698,
      dealer: "Camping World, Oshkosh, WI",
      trade: 51525,
      delta: 15173,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "30REP" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const halfTonTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(halfTonTwin).toBeUndefined()

    const sportTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Sport" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(sportTwin).toBeUndefined()

    const otherCougar = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.year === 2026
    )
    expect(
      otherCougar
        .filter(
          (row) =>
            row.floor !== "24RDS" &&
            row.floor !== "260MLE" &&
            row.floor !== "27SGS" &&
            row.floor !== "290RLS" &&
            row.floor !== "316RLS" &&
            row.floor !== "320RDS" &&
            row.floor !== "32BHS" &&
            row.floor !== "350LLK" &&
            row.floor !== "355FBS" &&
            row.floor !== "360MBI" &&
            row.floor !== "364BHL"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar Half-Ton 23MLE ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "23MLE" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 41745,
      dealer: "Dad's Camper Outlet, Picayune, MS",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $41,745 Dad's Camper Outlet, Picayune, MS via RV Trader (27.92 ft). Ask only. RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified Half-Ton (not base/Sport). Detail length malformed on Trader; used 27.92 ft spec. Verified JDP miss: no 2026/2025 Cougar Half-Ton M-23 MLE; base Cougar Series entry excluded as wrong-line proxy; trade left blank (no wrong-line proxy)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /verified JDP miss/i.test(span.text) &&
            /no 2026\/2025 Cougar Half-Ton M-23 MLE/i.test(span.text) &&
            /base Cougar Series entry excluded as wrong-line proxy/i.test(
              span.text
            ) &&
            /trade left blank/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Cougar+Half-Ton+23MLE+Half+Ton+Towable-5042349814" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const baseTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "260MLE" &&
        row.year === 2026
    )
    expect(baseTwin).toMatchObject({
      ask: 55900,
      dealer: "Marlette RV, Marlette, MI",
      trade: 44505,
      delta: 11395,
    })
    expect(deal?.trade).not.toBe(baseTwin?.trade)
    expect(deal?.ask).not.toBe(baseTwin?.ask)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "364BHL" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "30REP" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const otherHalfTon = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.year === 2026
    )
    expect(
      otherHalfTon
        .filter(
          (row) =>
            row.floor !== "23MLE" &&
            row.floor !== "24RDS" &&
            row.floor !== "26RES" &&
            row.floor !== "26RKE" &&
            row.floor !== "27SGS" &&
            row.floor !== "28RLI" &&
            row.floor !== "29MBD" &&
            row.floor !== "29RLI"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar Half-Ton 24RDS ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "24RDS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 44995,
      dealer: "Alpin Haus - Orange County, Middletown, NY",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $44,995 Alpin Haus - Orange County, Middletown, NY via RV Trader (28 ft). Ask only. RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified Half-Ton (not base/Sport). Checked, no JDP comparable: 2026/2025 M-24 RDS exists only as base Cougar Series — wrong-line proxy excluded."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /Checked, no JDP comparable/i.test(span.text) &&
            /2026\/2025 M-24 RDS exists only as base Cougar Series/i.test(
              span.text
            ) &&
            /wrong-line proxy excluded/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Cougar+Half-Ton+24RDS-5039502633" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const baseTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "24RDS" &&
        row.year === 2026
    )
    expect(baseTwin).toMatchObject({
      ask: 43434,
      dealer: "Camping World (San Diego, CA), San Diego, CA",
      trade: 34110,
      delta: 9324,
    })
    expect(deal?.trade).not.toBe(baseTwin?.trade)
    expect(deal?.ask).not.toBe(baseTwin?.ask)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "23MLE" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 41745,
      dealer: "Dad's Camper Outlet, Picayune, MS",
      trade: null,
      delta: null,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "30REP" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const otherHalfTon = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.year === 2026
    )
    expect(
      otherHalfTon
        .filter(
          (row) =>
            row.floor !== "23MLE" &&
            row.floor !== "24RDS" &&
            row.floor !== "26RES" &&
            row.floor !== "26RKE" &&
            row.floor !== "27SGS" &&
            row.floor !== "28RLI" &&
            row.floor !== "29MBD" &&
            row.floor !== "29RLI"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar Half-Ton 26RES ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "26RES" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 39981,
      dealer: "Holman Motors, Inc., Batavia, OH",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $39,981 Holman Motors, Inc., Batavia, OH via RV Trader (30 ft). Ask only. RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified Half-Ton (not base/Sport). Checked, no JDP comparable: 2026 M-26 RES only under base Cougar; 2025 no Half-Ton entry — wrong-line proxy excluded."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /Checked, no JDP comparable/i.test(span.text) &&
            /2026 M-26 RES only under base Cougar/i.test(span.text) &&
            /2025 no Half-Ton entry/i.test(span.text) &&
            /wrong-line proxy excluded/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Cougar+Half+Ton+26RES-5038043357" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const baseTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "26RES" &&
        row.year === 2026
    )
    expect(baseTwin).toBeUndefined()

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "24RDS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 44995,
      dealer: "Alpin Haus - Orange County, Middletown, NY",
      trade: null,
      delta: null,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "30REP" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const otherHalfTon = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.year === 2026
    )
    expect(
      otherHalfTon
        .filter(
          (row) =>
            row.floor !== "23MLE" &&
            row.floor !== "24RDS" &&
            row.floor !== "26RES" &&
            row.floor !== "26RKE" &&
            row.floor !== "27SGS" &&
            row.floor !== "28RLI" &&
            row.floor !== "29MBD" &&
            row.floor !== "29RLI"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar Half-Ton 26RKE ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "26RKE" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 55995,
      dealer: "RV Corral, Eugene, OR",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $55,995 RV Corral, Eugene, OR via RV Trader (30 ft). Ask only. RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified Half-Ton (not base/Sport). Checked, no JDP comparable: 2026/2025 M-26 RKE labeled Cougar Series only — wrong-line proxy excluded."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /Checked, no JDP comparable/i.test(span.text) &&
            /2026\/2025 M-26 RKE labeled Cougar Series only/i.test(span.text) &&
            /wrong-line proxy excluded/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Cougar+Half-Ton+26RKE-5040143513" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const baseTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "26RKE" &&
        row.year === 2026
    )
    expect(baseTwin).toBeUndefined()

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "26RES" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 39981,
      dealer: "Holman Motors, Inc., Batavia, OH",
      trade: null,
      delta: null,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "30REP" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const otherHalfTon = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.year === 2026
    )
    expect(
      otherHalfTon
        .filter(
          (row) =>
            row.floor !== "23MLE" &&
            row.floor !== "24RDS" &&
            row.floor !== "26RES" &&
            row.floor !== "26RKE" &&
            row.floor !== "27SGS" &&
            row.floor !== "28RLI" &&
            row.floor !== "29MBD" &&
            row.floor !== "29RLI"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar Half-Ton 27SGS ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "27SGS" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 41452,
      dealer: "McKee Auto Center, Perry, IA",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $41,452 McKee Auto Center, Perry, IA via RV Trader (30 ft). Ask only. RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified Half-Ton (not base/Sport). Checked, no JDP comparable: 2026/2025 M-27 SGS labeled Cougar Series only — wrong-line proxy excluded."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /Checked, no JDP comparable/i.test(span.text) &&
            /2026\/2025 M-27 SGS labeled Cougar Series only/i.test(span.text) &&
            /wrong-line proxy excluded/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Cougar+Half-Ton+27SGS-5037228404" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const baseTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "27SGS" &&
        row.year === 2026
    )
    expect(baseTwin).toMatchObject({
      ask: 47224,
      dealer: "Camping World, Myrtle Beach, SC",
      trade: 36810,
      delta: 10414,
    })
    expect(deal?.trade).not.toBe(baseTwin?.trade)
    expect(deal?.ask).not.toBe(baseTwin?.ask)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "26RKE" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 55995,
      dealer: "RV Corral, Eugene, OR",
      trade: null,
      delta: null,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "30REP" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const otherHalfTon = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.year === 2026
    )
    expect(
      otherHalfTon
        .filter(
          (row) =>
            row.floor !== "23MLE" &&
            row.floor !== "24RDS" &&
            row.floor !== "26RES" &&
            row.floor !== "26RKE" &&
            row.floor !== "27SGS" &&
            row.floor !== "28RLI" &&
            row.floor !== "29MBD" &&
            row.floor !== "29RLI"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar Half-Ton 28RLI ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "28RLI" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 51997,
      dealer: "Camping World, Akron, OH",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $51,997 Camping World, Akron, OH via RV Trader (32.67 ft). Ask only. RVT CAPTCHA-blocked; Trader-only. Featured Colbert skipped. Featured/Premium excluded. Verified Half-Ton via filter (not base/Sport). Checked, no JDP comparable: 2026 M-28 RLI labeled Cougar Series only; 2025 no Half-Ton entry — wrong-line proxy excluded."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /Checked, no JDP comparable/i.test(span.text) &&
            /2026 M-28 RLI labeled Cougar Series only/i.test(span.text) &&
            /2025 no Half-Ton entry/i.test(span.text) &&
            /wrong-line proxy excluded/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-COUGAR+28RLI-5042068484" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const baseTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "28RLI" &&
        row.year === 2026
    )
    expect(baseTwin).toBeUndefined()

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "27SGS" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 41452,
      dealer: "McKee Auto Center, Perry, IA",
      trade: null,
      delta: null,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "30REP" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const otherHalfTon = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.year === 2026
    )
    expect(
      otherHalfTon
        .filter(
          (row) =>
            row.floor !== "23MLE" &&
            row.floor !== "24RDS" &&
            row.floor !== "26RES" &&
            row.floor !== "26RKE" &&
            row.floor !== "27SGS" &&
            row.floor !== "28RLI" &&
            row.floor !== "29MBD" &&
            row.floor !== "29RLI"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar Half-Ton 29MBD ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "29MBD" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 49966,
      dealer: "Camping World, Roscoe, IL",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $49,966 Camping World, Roscoe, IL via RV Trader (33.92 ft). Ask only. RVT CAPTCHA-blocked; Trader-only. Featured/Premium excluded. Verified Half-Ton (not base/Sport). Checked, no JDP comparable: 2026 M-29 MBD only under base Cougar Series; 2025 no entry — wrong-line proxy excluded."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /Checked, no JDP comparable/i.test(span.text) &&
            /2026 M-29 MBD only under base Cougar Series/i.test(span.text) &&
            /2025 no entry/i.test(span.text) &&
            /wrong-line proxy excluded/i.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone-COUGAR+29MBD-5042064800" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const baseTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "29MBD" &&
        row.year === 2026
    )
    expect(baseTwin).toBeUndefined()

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "28RLI" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 51997,
      dealer: "Camping World, Akron, OH",
      trade: null,
      delta: null,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "30REP" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const otherHalfTon = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.year === 2026
    )
    expect(
      otherHalfTon
        .filter(
          (row) =>
            row.floor !== "23MLE" &&
            row.floor !== "24RDS" &&
            row.floor !== "26RES" &&
            row.floor !== "26RKE" &&
            row.floor !== "27SGS" &&
            row.floor !== "28RLI" &&
            row.floor !== "29MBD" &&
            row.floor !== "29RLI"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Keystone Cougar Half-Ton 29RLI ask and leaves trade/delta blank", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "29RLI" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 53998,
      dealer: "Leach Camper Sales of Lincoln, Lincoln, NE",
      trade: null,
      delta: null,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $53,998 Leach Camper Sales of Lincoln, Lincoln, NE via RV Trader and RVT (32 ft). Ask only. Same $53,998 on RV Trader and RVT. Featured/Premium excluded. Verified Half-Ton (not base/Sport). Checked, no JDP comparable: no 2026/2025 Cougar Half-Ton M-29 RLI; base Cougar Series M-29 RLI Low Retail exists ($43,750 / $40,200) — wrong-line proxy excluded."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /Checked, no JDP comparable/i.test(span.text) &&
            /no 2026\/2025 Cougar Half-Ton M-29 RLI/i.test(span.text) &&
            /base Cougar Series M-29 RLI Low Retail exists/i.test(span.text) &&
            /wrong-line proxy excluded/i.test(span.text) &&
            !/trade from/i.test(span.text) &&
            !/× 0\.9/.test(span.text)
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes.flat().some((span) => span.type === "link" && span.label === "RVT")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Keystone+Rv-Cougar+Half-Ton+29RLI-5039872898" &&
            span.label === "RV Trader"
        )
    ).toBe(true)

    const baseTwin = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar" &&
        row.floor === "29RLI" &&
        row.year === 2026
    )
    expect(baseTwin).toBeUndefined()
    expect(deal?.trade).not.toBe(39375)
    expect(deal?.trade).not.toBe(36180)

    const sibling = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "29MBD" &&
        row.year === 2026
    )
    expect(sibling).toMatchObject({
      ask: 49966,
      dealer: "Camping World, Roscoe, IL",
      trade: null,
      delta: null,
    })

    const nextBlank = deals.find(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.floor === "30REP" &&
        row.year === 2026
    )
    expect(nextBlank).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })
    expect(nextBlank?.notes).toEqual([])

    const otherHalfTon = deals.filter(
      (row) =>
        row.manufacturer === "Keystone" &&
        row.model === "Cougar Half-Ton" &&
        row.year === 2026
    )
    expect(
      otherHalfTon
        .filter(
          (row) =>
            row.floor !== "23MLE" &&
            row.floor !== "24RDS" &&
            row.floor !== "26RES" &&
            row.floor !== "26RKE" &&
            row.floor !== "27SGS" &&
            row.floor !== "28RLI" &&
            row.floor !== "29MBD" &&
            row.floor !== "29RLI"
        )
        .every(
          (row) =>
            row.ask == null &&
            row.trade == null &&
            row.delta == null &&
            row.dealer === "" &&
            row.notes.length === 0
        )
    ).toBe(true)
  })

  it("applies Sanibel 34LOUNGE ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Sanibel" &&
        row.floor === "34LOUNGE" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 69995,
      dealer: "Open Road RV - Monticello, MN",
      trade: 47250,
      delta: 22745,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $69,995 both RV Trader + RVT (Open Road RV - Monticello, MN), 36 ft New 34LOUNGE. Excluded $66,495 Premium/Sponsored. Trade = 2026 JDP Low Retail $52,500 × 0.9 = $47,250 (Sanibel by Forest River M-34LOUNGE)."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some((span) => span.type === "link" && span.label === "JDP values")
    ).toBe(false)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-sanibel-34lounge/47e78d86-1f72-11f1-beaa-02f5bff6b341/" &&
            span.label === "RVT"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River+Rv-Sanibel+34LOUNGE-5039661528" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
  })

  it("applies Vengeance Rogue Armored 341GS11 ask and 2026 JDP trade", () => {
    const deal = deals.find(
      (row) =>
        row.manufacturer === "Forest River" &&
        row.model === "Vengeance Rogue Armored" &&
        row.floor === "341GS11" &&
        row.year === 2026
    )
    expect(deal).toMatchObject({
      ask: 67328,
      dealer: "Forest River RV Little Rock by Camping World, Sherwood, AR",
      trade: 56835,
      delta: 10493,
    })
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text ===
              "Ask $67,328 RV Trader (Camping World Little Rock / Sherwood AR), 39.92 ft New 341GS11. RVT $69,999 was 40 ft (skipped); lowest RVT under-40 was $74,995. Trade = 2026 JDP Low Retail $63,150 × 0.9 = $56,835. Delta +$10,493."
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.jdpower.com/rvs/2026/vengeance-by-forest-river/m-341gs11/6648531/values" &&
            span.label === "JDP values"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvtrader.com/listing/2026-Forest+River-ROGUE+ARMORED+341GS11-5042059698" &&
            span.label === "RV Trader"
        )
    ).toBe(true)
    expect(
      deal?.notes
        .flat()
        .some(
          (span) =>
            span.type === "link" &&
            span.href ===
              "https://www.rvt.com/buy/details/2026-forest-river-vengeance-rogue-armored-341gs11/4d9e72af-95de-11ef-b575-12043a49ed9f/" &&
            span.label === "RVT"
        )
    ).toBe(true)
  })

  it("applies 2025 JDP proxy trades on Coachmen Adrenaline", () => {
    const rows = [
      [
        "21LT",
        34699,
        "RV Value Mart - Manheim",
        27405,
        7294,
        "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $30,450 × 0.9 = $27,405. Why not 2026: Adrenaline is absent from the 2026 Coachmen-by-Forest-River model list on jdpower.com (full series scroll verified). Used prior-year 2025 Coachmen Adrenaline M-21 LT Low Retail as proxy. Source: https://www.jdpower.com/rvs/2025/coachmen-by-forest-river/m-21-lt/6639477/values",
        "m-21-lt/6639477",
      ],
      [
        "27LT",
        35986,
        "Uwharrie RV, Albemarle, NC",
        27630,
        8356,
        "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $30,700 × 0.9 = $27,630. Why not 2026: Adrenaline is absent from the 2026 Coachmen-by-Forest-River model list on jdpower.com (full series scroll verified). Used prior-year 2025 Coachmen Adrenaline M-27 LT Low Retail as proxy. Source: https://www.jdpower.com/rvs/2025/coachmen-by-forest-river/m-27-lt/6639479/values",
        "m-27-lt/6639479",
      ],
      [
        "30GS",
        59999,
        "General RV Center - Tampa, Dover, FL",
        38475,
        21524,
        "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $42,750 × 0.9 = $38,475. Why not 2026: Adrenaline is absent from the 2026 Coachmen-by-Forest-River model list on jdpower.com (full series scroll verified). Used prior-year 2025 Coachmen Adrenaline M-30 GS Low Retail as proxy. Source: https://www.jdpower.com/rvs/2025/coachmen-by-forest-river/m-30-gs/6639482/values",
        "m-30-gs/6639482",
      ],
    ] as const
    for (const [floor, ask, dealer, trade, delta, exactNote, path] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Coachmen" &&
          row.model === "Adrenaline" &&
          row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && /not found/i.test(span.text))
      ).toBe(false)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href.includes("/2025/coachmen-by-forest-river/") &&
              span.href.includes(path) &&
              span.label === "JDP values"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) => span.type === "link" && span.href.includes("rvtrader.com")
          )
      ).toBe(true)
    }
  })

  it("applies 2026 Apex-by-Coachmen JDP Low Retail trades", () => {
    const rows = [
      [
        "Apex Nano",
        "184BH",
        22200,
        "Trailer Source Inc. Wheat Ridge RV Center, Wheat Ridge, CO",
        15300,
        6900,
        "Trade from 2026 J.D. Power Low Retail $17,000 × 0.9 = $15,300 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-184bh/6650553/values",
        "m-184bh/6650553",
      ],
      [
        "Apex Nano",
        "185BH",
        21961,
        "RV Dynasty, Bunker Hill, IN",
        14760,
        7201,
        "Trade from 2026 J.D. Power Low Retail $16,400 × 0.9 = $14,760 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-185bh/6650554/values",
        "m-185bh/6650554",
      ],
      [
        "Apex Nano",
        "186BH",
        20495,
        "RV Specialist, Goshen, IN",
        15705,
        4790,
        "Trade from 2026 J.D. Power Low Retail $17,450 × 0.9 = $15,705 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-186bh/6650555/values",
        "m-186bh/6650555",
      ],
      [
        "Apex Nano",
        "187RB",
        22400,
        "RV Dynasty, Bunker Hill, IN",
        15030,
        7370,
        "Trade from 2026 J.D. Power Low Retail $16,700 × 0.9 = $15,030 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-187rb/6650556/values",
        "m-187rb/6650556",
      ],
      [
        "Apex Nano",
        "190RBS",
        19995,
        "RV Specialist",
        16425,
        3570,
        "Trade from 2026 J.D. Power Low Retail $18,250 × 0.9 = $16,425 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-190rbs/6650557/values",
        "m-190rbs/6650557",
      ],
      [
        "Apex Nano",
        "194BHS",
        24900,
        "Minneapolis Trailer Sales",
        16920,
        7980,
        "Trade from 2026 J.D. Power Low Retail $18,800 × 0.9 = $16,920 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-194bhs/6650558/values",
        "m-194bhs/6650558",
      ],
      [
        "Apex Nano",
        "203RBK",
        21995,
        "RV Specialist",
        17685,
        4310,
        "Trade from 2026 J.D. Power Low Retail $19,650 × 0.9 = $17,685 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-203rbk/6650559/values",
        "m-203rbk/6650559",
      ],
      [
        "Apex Nano",
        "208BHS",
        23339,
        "Carolina RV",
        17505,
        5834,
        "Trade from 2026 J.D. Power Low Retail $19,450 × 0.9 = $17,505 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-208bhs/6650560/values",
        "m-208bhs/6650560",
      ],
      [
        "Apex Nano",
        "213RDS",
        24900,
        "Camp EZ RV - Livingston",
        18360,
        6540,
        "Trade from 2026 J.D. Power Low Retail $20,400 × 0.9 = $18,360 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-213rds/6650561/values",
        "m-213rds/6650561",
      ],
      [
        "Apex Nano",
        "216RKS",
        27999,
        "Bill's Happy Camper RV Sales and Service",
        19215,
        8784,
        "Trade from 2026 J.D. Power Low Retail $21,350 × 0.9 = $19,215 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-216rks/6650562/values",
        "m-216rks/6650562",
      ],
      [
        "Apex Nano",
        "224RBS",
        24999,
        "General RV Center - Mesa",
        18855,
        6144,
        "Trade from 2026 J.D. Power Low Retail $20,950 × 0.9 = $18,855 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-224rbs/6650563/values",
        "m-224rbs/6650563",
      ],
      [
        "Apex Nano",
        "228BHS",
        28995,
        "RV Specialist",
        18945,
        10050,
        "Trade from 2026 J.D. Power Low Retail $21,050 × 0.9 = $18,945 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-228bhs/6650564/values",
        "m-228bhs/6650564",
      ],
      [
        "Apex Ultra-Lite",
        "188RBST",
        29714,
        "",
        22005,
        7709,
        "Trade from 2026 J.D. Power Low Retail $24,450 × 0.9 = $22,005 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-188rbst/6650565/values",
        "m-188rbst/6650565",
      ],
      [
        "Apex Ultra-Lite",
        "241BHS",
        35721,
        "",
        23985,
        11736,
        "Trade from 2026 J.D. Power Low Retail $26,650 × 0.9 = $23,985 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-241bhs/6650566/values",
        "m-241bhs/6650566",
      ],
      [
        "Apex Ultra-Lite",
        "242BARV",
        33495,
        "",
        24705,
        8790,
        "Trade from 2026 J.D. Power Low Retail $27,450 × 0.9 = $24,705 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-242barv/6650567/values",
        "m-242barv/6650567",
      ],
      [
        "Apex Ultra-Lite",
        "246BARV",
        35128,
        "",
        26055,
        9073,
        "Trade from 2026 J.D. Power Low Retail $28,950 × 0.9 = $26,055 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-246barv/6650569/values",
        "m-246barv/6650569",
      ],
      [
        "Apex",
        "ULTRA-LITE 293RLDS",
        42999,
        "General RV Center - Salisbury, Salisbury, NC",
        25335,
        17664,
        "Trade from 2026 J.D. Power Low Retail $28,150 × 0.9 = $25,335 (Apex-by-Coachmen brand path — not listed under Coachmen-by-Forest-River). Source: https://www.jdpower.com/rvs/2026/apex-by-coachmen/m-293rlds/6650575/values",
        "m-293rlds/6650575",
      ],
    ] as const
    for (const [
      model,
      floor,
      ask,
      dealer,
      trade,
      delta,
      exactNote,
      path,
    ] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Coachmen" &&
          row.model === model &&
          row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && /not found/i.test(span.text))
      ).toBe(false)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href.includes("/2026/apex-by-coachmen/") &&
              span.href.includes(path) &&
              span.label === "JDP values"
          )
      ).toBe(true)
    }

    const barv242 = deals.find(
      (deal) => deal.model === "Apex Ultra-Lite" && deal.floor === "242BARV"
    )
    expect(
      barv242?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" && span.text.includes("asterisk on card")
        )
    ).toBe(true)

    const apex293 = deals.find(
      (deal) => deal.model === "Apex" && deal.floor === "ULTRA-LITE 293RLDS"
    )
    expect(
      apex293?.notes
        .flat()
        .some(
          (span) => span.type === "link" && span.href.includes("rvtrader.com")
        )
    ).toBe(true)
  })

  it("leaves Apex floors verified absent from 2026 and 2025 lists without trades", () => {
    const missing = [
      [
        "Apex Nano",
        "181RB",
        20999,
        "Camp Rite RV Sales, Loganville, GA",
        "JDP checked 2025–2026 Apex-by-Coachmen (Nano + full make list): no 181RB. No prior-year exact-floor Low Retail found. Trade/delta left blank — no comparable.",
      ],
      [
        "Apex Nano",
        "183BH",
        25114,
        "RV Dynasty, Bunker Hill, IN",
        "JDP checked 2025–2026 Apex-by-Coachmen (Nano + full make list): no 183BH. No prior-year exact-floor Low Retail found. Trade/delta left blank — no comparable.",
      ],
      [
        "Apex Ultra-Lite",
        "244RBS",
        32995,
        "",
        "JDP checked 2025–2026 Apex-by-Coachmen Ultra-Lite: no 244RBS. No prior-year exact-floor Low Retail found. Trade/delta left blank — no comparable.",
      ],
    ] as const
    for (const [model, floor, ask, dealer, exactNote] of missing) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Coachmen" &&
          row.model === model &&
          row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade: null, delta: null })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && /not found/i.test(span.text))
      ).toBe(false)
    }
  })

  it("applies prior-year Apex proxy trades on 26BHX, 24RBX, 29BHX, and 289TBSS", () => {
    const rows = [
      [
        "Apex Ultra-Lite",
        "26BHX",
        27999,
        "Bill's Happy Camper RV Sales and Service, Mill Hall, PA",
        23355,
        4644,
        "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $25,950 × 0.9 = $23,355 (Apex-by-Coachmen X Series). 2026 unused because absent from 2026 Apex-by-Coachmen list. Source: https://www.jdpower.com/rvs/2025/apex-by-coachmen/m-26-bhx/6641641/values",
        "m-26-bhx/6641641",
      ],
      [
        "Apex Ultra-Lite X Series",
        "24RBX",
        25980,
        "Bobby Combs RV, Caldwell, ID",
        22545,
        3435,
        "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $25,050 × 0.9 = $22,545 (Apex-by-Coachmen X Series). 2026 unused because absent from 2026 Apex-by-Coachmen list. Source: https://www.jdpower.com/rvs/2025/apex-by-coachmen/m-24-rbx/6641640/values",
        "m-24-rbx/6641640",
      ],
      [
        "Apex Ultra-Lite X Series",
        "29BHX",
        25328,
        "Forest River RV Little Rock by Camping World",
        24165,
        1163,
        "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $26,850 × 0.9 = $24,165 (Apex-by-Coachmen X Series). 2026 unused because absent from 2026 Apex-by-Coachmen list. Source: https://www.jdpower.com/rvs/2025/apex-by-coachmen/m-29-bhx/6641642/values",
        "m-29-bhx/6641642",
      ],
      [
        "Apex Ultra-Lite",
        "289TBSS",
        34999,
        "Franklinville, NC",
        25965,
        9034,
        "TRADE FROM 2023 (not 2026): J.D. Power Low Retail $28,850 × 0.9 = $25,965 (Apex-by-Coachmen M-289 TBSS). Floor absent from 2024–2026 Apex lists (2025 has 291 TBSS only — different code, not used). Source: https://www.jdpower.com/rvs/2023/apex-by-coachmen/m-289-tbss/6620293/values",
        "m-289-tbss/6620293",
      ],
    ] as const
    for (const [
      model,
      floor,
      ask,
      dealer,
      trade,
      delta,
      exactNote,
      path,
    ] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Coachmen" &&
          row.model === model &&
          row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && /not found/i.test(span.text))
      ).toBe(false)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href.includes("/apex-by-coachmen/") &&
              span.href.includes(path) &&
              span.label === "JDP values"
          )
      ).toBe(true)
    }
  })

  it("applies JDP trades on Coachmen Beyond", () => {
    const priced = [
      [
        "22C AWD",
        142000,
        "Delta, OH",
        115560,
        26440,
        "$128,400",
        "m-22-c-awd-ford/6640384",
      ],
      [
        "22D AWD",
        142986,
        "Albemarle, NC",
        114120,
        28866,
        "$126,800",
        "m-22-d-awd-ford/6640383",
      ],
      [
        "22RB AWD",
        141785,
        "Lewisville, TX",
        119385,
        22400,
        "$132,650",
        "m-22-rb-awd-ford/6640385",
      ],
    ] as const
    for (const [floor, ask, dealer, trade, delta, lowRetail, path] of priced) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Coachmen" &&
          row.model === "Beyond" &&
          row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "text" &&
              span.text.includes(`JDP Low Retail ${lowRetail}`)
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href.includes(path) &&
              span.label === "JDP values"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && /not found/i.test(span.text))
      ).toBe(false)
    }
    expect(deals.filter((deal) => deal.model === "Beyond")).toHaveLength(7)
  })

  it("applies JDP trades on Catalina Legacy Edition", () => {
    const priced = [
      [
        "243RBS",
        25495,
        "RV Dynasty, Bunker Hill, IN",
        27090,
        -1595,
        "$30,100",
        "m-243-rbs/6648716",
      ],
      [
        "263BHSCK",
        28833,
        "RV Wholesalers, Lakeview, OH",
        28260,
        573,
        "$31,400",
        "m-263-bhsck/6648717",
      ],
      [
        "263FKDS",
        36519,
        "Palmetto State RV, Greer SC",
        31005,
        5514,
        "$34,450",
        "m-263-fkds/6648718",
      ],
      [
        "273DBHCK",
        27495,
        "RV Dynasty, Bunker Hill, IN",
        28665,
        -1170,
        "$31,850",
        "m-273-dbhck/6648719",
      ],
      [
        "283RKS",
        31995,
        "Alpin Haus - Amsterdam, Amsterdam NY",
        28800,
        3195,
        "$32,000",
        "m-283-rks/6648720",
      ],
      [
        "293QBCK",
        28995,
        "RV Dynasty, Bunker Hill IN",
        29025,
        -30,
        "$32,250",
        "m-293-qbck/6648721",
      ],
      [
        "293TQBSCK",
        27999,
        "Cheyenne Camping Center Co, Walcott IA",
        29475,
        -1476,
        "$32,750",
        "m-293-tqbsck/6648722",
      ],
    ] as const
    for (const [floor, ask, dealer, trade, delta, lowRetail, path] of priced) {
      const deal = deals.find(
        (row) => row.model === "Catalina Legacy Edition" && row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "text" &&
              span.text.includes(`JDP Low Retail ${lowRetail}`)
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href.includes(path) &&
              span.label === "JDP values"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && /not found/i.test(span.text))
      ).toBe(false)
    }
    expect(
      deals.filter((deal) => deal.model === "Catalina Legacy Edition")
    ).toHaveLength(10)
  })

  it("leaves verified-missing Legacy and Beyond floors without trade or a not-found claim", () => {
    const missing = [
      [
        "Catalina Legacy Edition",
        "283RNR",
        33995,
        "Triple H RVs, Haleyville AL",
        "Real 2026 Coachmen floor; JDP has no 283RNR (2026 Legacy closest codes are 283 RKS etc. — different floors, not used). Trade/delta left blank — no comparable.",
      ],
    ] as const
    for (const [model, floor, ask, dealer, exactNote] of missing) {
      const deal = deals.find(
        (row) => row.model === model && row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade: null, delta: null })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && /not found/i.test(span.text))
      ).toBe(false)
    }
  })

  it("applies catch-up JDP trades on mapped Beyond, Legacy, and Summit floors", () => {
    const rows = [
      [
        "Beyond",
        "22C",
        144998,
        "Reno, NV",
        115560,
        29438,
        "Trade from 2026 J.D. Power Low Retail $128,400 × 0.9 = $115,560 (Coachmen-by-Forest-River Beyond M-22 C AWD Ford; matched dealer 22C to JDP M-22 C). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-22-c-awd-ford/6640384/values",
        "m-22-c-awd-ford/6640384",
      ],
      [
        "Beyond",
        "22D-EB",
        139995,
        "Myrtle Beach, SC",
        114120,
        25875,
        "Trade from 2026 J.D. Power Low Retail $126,800 × 0.9 = $114,120 (Coachmen-by-Forest-River Beyond M-22 D AWD Ford; matched dealer 22D-EB to JDP M-22 D (closest 2026 Beyond D floor)). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-22-d-awd-ford/6640383/values",
        "m-22-d-awd-ford/6640383",
      ],
      [
        "Beyond",
        "22RB",
        145000,
        "Delta, OH",
        119385,
        25615,
        "Trade from 2026 J.D. Power Low Retail $132,650 × 0.9 = $119,385 (Coachmen-by-Forest-River Beyond M-22 RB AWD Ford; matched dealer 22RB to JDP M-22 RB). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-22-rb-awd-ford/6640385/values",
        "m-22-rb-awd-ford/6640385",
      ],
      [
        "Catalina Legacy Edition",
        "243RBSLE",
        26980,
        "Eagle Country RV, Eagle River, WI",
        27090,
        -110,
        "Trade from 2026 J.D. Power Low Retail $30,100 × 0.9 = $27,090 (Catalina Legacy M-243 RBS; dealer floor 243RBSLE mapped to JDP M-243 RBS (Legacy; LE suffix not on JDP code)). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-243-rbs/6648716/values",
        "m-243-rbs/6648716",
      ],
      [
        "Catalina Legacy Edition",
        "293QBCKLE",
        30944,
        "RV Value Mart - Asheboro, Franklinville NC",
        29025,
        1919,
        "Trade from 2026 J.D. Power Low Retail $32,250 × 0.9 = $29,025 (Catalina Legacy M-293 QBCK; dealer floor 293QBCKLE mapped to JDP M-293 QBCK (Legacy; LE suffix not on JDP code)). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-293-qbck/6648721/values",
        "m-293-qbck/6648721",
      ],
      [
        "Catalina Summit Series 7",
        "184BHS",
        24995,
        "Campers Inn RV of Johnstown",
        20025,
        4970,
        "Trade from 2026 J.D. Power Low Retail $22,250 × 0.9 = $20,025 (Catalina Summit M-184 BHSX; dealer floor 184BHS mapped to closest 2026 Summit M-184 BHSX). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-184-bhsx/6648743/values",
        "m-184-bhsx/6648743",
      ],
      [
        "Beyond",
        "22RBBC",
        159985,
        "Fountain Valley, CA",
        119385,
        40600,
        "Trade from 2026 J.D. Power Low Retail $132,650 × 0.9 = $119,385 (Beyond M-22 RB AWD Ford; dealer listings brand this as Beyond 22RBBC (rear wet bath); JDP codes it M-22 RB in Beyond series (not Beyond Li)). Source: https://www.jdpower.com/rvs/2026/coachmen-by-forest-river/m-22-rb-awd-ford/6640385/values",
        "m-22-rb-awd-ford/6640385",
      ],
      [
        "Catalina Summit Series 7",
        "184RBS",
        19999,
        "Camp Rite RV Sales",
        17910,
        2089,
        "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $19,900 × 0.9 = $17,910 (Catalina Summit M-184 RBS). 2026 unused because absent from 2026 Summit list (2026 has BHSX/MKS only for 184). Source: https://www.jdpower.com/rvs/2025/coachmen-by-forest-river/m-184-rbs/6639404/values",
        "m-184-rbs/6639404",
      ],
      [
        "Catalina Summit Series 8",
        "221MKE",
        26895,
        "Meyer's RV of Egg Harbor",
        20160,
        6735,
        "TRADE FROM 2025 (not 2026): J.D. Power Low Retail $22,400 × 0.9 = $20,160 (Catalina Summit M-221 MKE). 2026 unused because absent from 2026 Summit list (2026 has M-221 EPIC only). Source: https://www.jdpower.com/rvs/2025/coachmen-by-forest-river/m-221-mke/6639393/values",
        "m-221-mke/6639393",
      ],
    ] as const
    for (const [
      model,
      floor,
      ask,
      dealer,
      trade,
      delta,
      exactNote,
      path,
    ] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Coachmen" &&
          row.model === model &&
          row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && span.text === exactNote)
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && /not found/i.test(span.text))
      ).toBe(false)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href.includes(path) &&
              span.label === "JDP values"
          )
      ).toBe(true)
    }
  })

  it("applies JDP trades on Catalina Summit Series 7", () => {
    const rows = [
      [
        "134BHX",
        11929,
        "Moix RV Hot Springs Landing, Hot Springs AR",
        15390,
        -3461,
        "$17,100",
        "m-134-bhx/6648736",
      ],
      [
        "134RDX",
        11599,
        "Bayer RV, Dublin TX",
        15390,
        -3791,
        "$17,100",
        "m-134-rdx/6648737",
      ],
      [
        "134REX",
        16995,
        "RV Central",
        16605,
        390,
        "$18,450",
        "m-134-rex/6648739",
      ],
      [
        "134RKX",
        12900,
        "Riley's RV World",
        15390,
        -2490,
        "$17,100",
        "m-134-rkx/6648738",
      ],
      [
        "154RBX",
        14900,
        "Riley's RV World",
        16785,
        -1885,
        "$18,650",
        "m-154-rbx/6648741",
      ],
      [
        "164BHX",
        14900,
        "Riley's RV World",
        16785,
        -1885,
        "$18,650",
        "m-164-bhx/6648742",
      ],
      [
        "184BHSX",
        18830,
        "RV Value Mart - Ephrata",
        20025,
        -1195,
        "$22,250",
        "m-184-bhsx/6648743",
      ],
      [
        "184MKS",
        18999,
        "Bayer RV",
        20970,
        -1971,
        "$23,300",
        "m-184-mks/6648744",
      ],
    ] as const
    for (const [floor, ask, dealer, trade, delta, lowRetail, path] of rows) {
      const deal = deals.find(
        (row) => row.model === "Catalina Summit Series 7" && row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "text" &&
              span.text.includes(`JDP Low Retail ${lowRetail}`)
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href.includes(path) &&
              span.label === "JDP values"
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && /not found/i.test(span.text))
      ).toBe(false)
    }
    expect(
      deals.filter((deal) => deal.model === "Catalina Summit Series 7")
    ).toHaveLength(10)
  })

  it("applies JDP trades on Catalina Summit Series 8", () => {
    const rows = [
      [
        "211BH",
        18594,
        "Kunes RV Lake Mills",
        19800,
        -1206,
        "$22,000",
        "m-211-bh/6648729",
      ],
      [
        "221EPIC",
        20995,
        "RV Dynasty",
        21015,
        -20,
        "$23,350",
        "m-221-epic/6648730",
      ],
      [
        "231BHS",
        22894,
        "RV Value Mart - Manheim",
        22995,
        -101,
        "$25,550",
        "m-231-bhs/6648731",
      ],
      [
        "231MKS",
        22495,
        "RV Dynasty",
        24300,
        -1805,
        "$27,000",
        "m-231-mks/6648732",
      ],
      [
        "261BHS",
        25594,
        "Kunes Freedom RV",
        23985,
        1609,
        "$26,650",
        "m-261-bhs/6648734",
      ],
      [
        "261BH",
        16995,
        "RV Dynasty",
        20520,
        -3525,
        "$22,800",
        "m-261-bh/6648733",
      ],
      [
        "271DBS",
        27399,
        "Bill's Happy Camper RV Sales and Service",
        21510,
        5889,
        "$23,900",
        "m-271-dbs/6650074",
      ],
      [
        "281QBUNK",
        27929,
        "Moix RV McGaugh Outpost",
        27270,
        659,
        "$30,300",
        "m-281-qbunk/6648735",
      ],
    ] as const
    for (const [floor, ask, dealer, trade, delta, lowRetail, path] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Coachmen" &&
          row.model === "Catalina Summit Series 8" &&
          row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "text" &&
              span.text.includes(`JDP Low Retail ${lowRetail}`)
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href.includes(path) &&
              span.label === "JDP values"
          )
      ).toBe(true)
    }
    expect(
      deals.filter((deal) => deal.model === "Catalina Summit Series 8")
    ).toHaveLength(9)
  })

  it("leaves only floors with no usable JDP match blank", () => {
    const missing = [
      ["Apex Nano", "181RB", 20999, "Camp Rite RV Sales, Loganville, GA"],
      ["Apex Nano", "183BH", 25114, "RV Dynasty, Bunker Hill, IN"],
      ["Apex Ultra-Lite", "244RBS", 32995, ""],
      [
        "Catalina Legacy Edition",
        "283RNR",
        33995,
        "Triple H RVs, Haleyville AL",
      ],
      ["Ahara", "297MK", 74849, "RV Value Mart - Asheboro, Franklinville, NC"],
      ["Tandara", "235ML", 38204, "Glampers RV"],
      ["Tandara", "295RL", 54990, "Berryland Campers"],
      [
        "Cherokee Arctic Wolf",
        "285OPT",
        38995,
        "Bunker Hill, IN",
      ],
      [
        "Cherokee Arctic Wolf",
        "289PANO",
        45887,
        "Buckeye RV Jeffersonville, Jeffersonville, OH",
      ],
      [
        "Impression",
        "301ML",
        52777,
        "Thrills RV, Columbia City, IN",
      ],
      [
        "Sandstorm",
        "2710",
        62980,
        "Bobby Combs RV – Yuma, AZ",
      ],
      [
        "Wildcat",
        "36FUN",
        71990,
        "Family RV Center, Sweetwater, TX",
      ],
      [
        "Wildcat XL",
        "30BAM",
        64999,
        "Ron Hoover RV & Marine – Georgetown, TX",
      ],
      [
        "Eagle",
        "28CRT",
        56500,
        "Bus Supply Company Inc, McComb, MS",
      ],
      [
        "Avalanche",
        "321RL",
        76995,
        "Bish's RV – Anderson, IN, Anderson, IN",
      ],
      [
        "Cougar Half-Ton",
        "23MLE",
        41745,
        "Dad's Camper Outlet, Picayune, MS",
      ],
      [
        "Cougar Half-Ton",
        "24RDS",
        44995,
        "Alpin Haus - Orange County, Middletown, NY",
      ],
      [
        "Cougar Half-Ton",
        "26RES",
        39981,
        "Holman Motors, Inc., Batavia, OH",
      ],
      [
        "Cougar Half-Ton",
        "26RKE",
        55995,
        "RV Corral, Eugene, OR",
      ],
      [
        "Cougar Half-Ton",
        "27SGS",
        41452,
        "McKee Auto Center, Perry, IA",
      ],
      [
        "Cougar Half-Ton",
        "28RLI",
        51997,
        "Camping World, Akron, OH",
      ],
      [
        "Cougar Half-Ton",
        "29MBD",
        49966,
        "Camping World, Roscoe, IL",
      ],
      [
        "Cougar Half-Ton",
        "29RLI",
        53998,
        "Leach Camper Sales of Lincoln, Lincoln, NE",
      ],
    ] as const
    const verifiedMiss = new Set(["297MK", "235ML", "295RL"])
    const askNoTrade = deals.filter(
      (deal) => deal.ask != null && deal.trade == null
    )
    expect(askNoTrade.map((deal) => [deal.model, deal.floor])).toEqual(
      missing.map(([model, floor]) => [model, floor])
    )
    for (const [model, floor, ask, dealer] of missing) {
      const deal = deals.find(
        (row) => row.model === model && row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade: null, delta: null })
      if (!verifiedMiss.has(floor)) {
        expect(
          deal?.notes
            .flat()
            .some(
              (span) => span.type === "text" && /not found/i.test(span.text)
            )
        ).toBe(false)
      }
    }
  })

  it("does not claim JDP Low Retail is missing unless the miss was verified", () => {
    const pending =
      "Trade and delta pending J.D. Power Low Retail × 0.9 lookup."
    const falseMiss = deals.filter((deal) =>
      deal.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            /JDP Low Retail not found|no 2026 value/i.test(span.text)
        )
    )
    expect(falseMiss).toEqual([])

    const lite274 = deals.find(
      (deal) => deal.model === "Chaparral Lite" && deal.floor === "274BH"
    )
    expect(lite274).toMatchObject({ trade: 40770, delta: 5480 })
    expect(
      lite274?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text.includes("TRADE FROM 2025 (not 2026)") &&
            span.text.includes("m-274-bh/6643414")
        )
    ).toBe(true)
    expect(
      lite274?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text.includes("JDP has no 2026 Chaparral Lite 274BH")
        )
    ).toBe(false)

    expect(
      deals.filter((deal) =>
        deal.notes
          .flat()
          .some((span) => span.type === "text" && span.text === pending)
      ).length
    ).toBe(0)
  })

  it("applies JDP trades on Catalina Trail Blazer", () => {
    const trail = [
      ["26TH", 23495, "RV Dynasty", 25560, -2065, "$28,400", "m-26-th/6648746"],
      ["27THS", 31495, "RV Dynasty", 30960, 535, "$34,400", "m-27-ths/6648747"],
      [
        "28THS",
        33495,
        "RV Dynasty",
        30960,
        2535,
        "$34,400",
        "m-28-ths/6648748",
      ],
      [
        "29THS",
        28995,
        "RV Dynasty",
        29790,
        -795,
        "$33,100",
        "m-29-ths/6648749",
      ],
    ] as const
    for (const [floor, ask, dealer, trade, delta, lowRetail, path] of trail) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Coachmen" &&
          row.model === "Catalina Trail Blazer" &&
          row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "text" &&
              span.text.includes(`JDP Low Retail ${lowRetail}`)
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "link" &&
              span.href.includes(path) &&
              span.label === "JDP values"
          )
      ).toBe(true)
    }
    expect(
      deals.filter((deal) => deal.model === "Catalina Trail Blazer")
    ).toHaveLength(4)
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
    expect(priced.map((deal) => deal.delta)).toEqual([
      -10004, -6760, -5628, -5469, -5252, -5190, -3791, -3525, -3461, -2490,
      -2065, -2000, -1971, -1885, -1885, -1862, -1805, -1595, -1476, -1206,
      -1195, -1170, -831, -795, -586, -343, -110, -101, -30, -20, 390, 535, 573,
      659, 1163, 1340, 1609, 1665, 1919, 2089, 2535, 3005, 3080, 3149, 3185, 3195, 3435, 3498, 3570, 4103, 4310,
      4644, 4790, 4875, 4970, 5127, 5243, 5385, 5386, 5480, 5514, 5774, 5834, 5889, 5890, 5965, 6144, 6414, 6438, 6471, 6540,
      6554, 6735, 6900, 7201, 7294, 7370, 7709, 7811, 7840, 7980, 8010, 8356, 8670, 8784, 8790, 8814, 8828, 9034,
      9073, 9314, 9324, 9794, 9835, 9864, 9865, 9877, 10050, 10308, 10414, 10421, 10493, 10708, 10859, 10859, 11385, 11395, 11413, 11726, 11736, 11884, 12053, 12283, 12731, 12745, 13013, 13013, 13019, 13075, 13165, 13194, 13360, 13584,
      14139, 14370, 14805, 15072, 15173, 15373, 15379, 15689, 15697, 16095, 16193, 16667, 16667, 16859, 16898, 17460, 17577, 17664, 17740, 17755, 18228, 18256, 18256, 19530, 21524, 21793, 22400, 22745, 22925, 23268, 25615, 25875,
      26440, 27222, 28866, 29438, 40600,
    ])
    expect(empty.length).toBe(257)
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

    const byJayco = visibleDeals(
      deals,
      { manufacturer: "", year: "", model: "" },
      DEFAULT_SORT_KEY,
      DEFAULT_SORT_DIR,
      "jayco"
    )
    expect(byJayco).toHaveLength(20)
    expect(byJayco.every((deal) => deal.manufacturer === "Jayco")).toBe(true)

    const byKeystone = visibleDeals(
      deals,
      { manufacturer: "", year: "", model: "" },
      DEFAULT_SORT_KEY,
      DEFAULT_SORT_DIR,
      "keystone"
    )
    expect(byKeystone).toHaveLength(62)
    expect(byKeystone.every((deal) => deal.manufacturer === "Keystone")).toBe(
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

  it("cascades East To West models and prices Ahara and Tandara floors", () => {
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
    expect(rows.find((deal) => deal.floor === "297MK")).toMatchObject({
      ask: 74849,
      trade: null,
      delta: null,
    })
    expect(rows.find((deal) => deal.floor === "325RL")).toMatchObject({
      ask: 68995,
      trade: 51255,
      delta: 17740,
    })
    expect(rows.find((deal) => deal.floor === "365RL")).toMatchObject({
      ask: 66999,
      trade: 53415,
      delta: 13584,
    })
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
      "Jayco",
      "Keystone",
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

  it("cascades Jayco models and prices Eagle HT, Eagle SLE, North Point 310RLTS, and Pinnacle 32RLTS", () => {
    const options = filterOptions(deals, {
      manufacturer: "Jayco",
      year: "",
      model: "",
    })
    expect(options.manufacturer).toEqual([
      "Coachmen",
      "East To West",
      "Forest River",
      "Jayco",
      "Keystone",
    ])
    expect(options.model).toEqual([
      "Eagle",
      "Eagle HT",
      "Eagle SLE",
      "North Point",
      "Pinnacle",
    ])
    expect(options.model).not.toContain("Brookstone")
    expect(options.model).not.toContain("Flagstaff Classic")

    const rows = matching(deals, {
      manufacturer: "Jayco",
      year: "",
      model: "Eagle SLE",
    })
    expect(rows).toHaveLength(4)
    expect(rows.map((deal) => deal.floor)).toEqual([
      "24MLE",
      "28BHU",
      "28RKS",
      "30RLT",
    ])
    expect(rows.find((deal) => deal.floor === "24MLE")).toMatchObject({
      ask: 32995,
      trade: 25155,
      delta: 7840,
    })
    expect(rows.find((deal) => deal.floor === "28BHU")).toMatchObject({
      ask: 34991,
      trade: 27180,
      delta: 7811,
    })
    expect(rows.find((deal) => deal.floor === "28RKS")).toMatchObject({
      ask: 39911,
      trade: 27180,
      delta: 12731,
    })
    expect(rows.find((deal) => deal.floor === "30RLT")).toMatchObject({
      ask: 44250,
      trade: 29880,
      delta: 14370,
    })
    expect(
      rows
        .filter(
          (deal) =>
            deal.floor !== "24MLE" &&
            deal.floor !== "28BHU" &&
            deal.floor !== "28RKS" &&
            deal.floor !== "30RLT"
        )
        .every((deal) => deal.ask == null && deal.delta == null)
    ).toBe(true)

    const eagleHt = matching(deals, {
      manufacturer: "Jayco",
      year: "",
      model: "Eagle HT",
    })
    expect(eagleHt).toHaveLength(8)
    expect(eagleHt.map((deal) => deal.floor)).toEqual([
      "25RUC",
      "26REC",
      "27MLC",
      "28CRT",
      "29DDB",
      "29RLC",
      "30CRT",
      "31QCD",
    ])
    expect(eagleHt.find((deal) => deal.floor === "25RUC")).toMatchObject({
      ask: 42911,
      trade: 31185,
      delta: 11726,
    })
    expect(eagleHt.find((deal) => deal.floor === "26REC")).toMatchObject({
      ask: 39999,
      trade: 31185,
      delta: 8814,
    })
    expect(eagleHt.find((deal) => deal.floor === "27MLC")).toMatchObject({
      ask: 43750,
      trade: 33885,
      delta: 9865,
    })
    expect(eagleHt.find((deal) => deal.floor === "28CRT")).toMatchObject({
      ask: 52999,
      trade: 37620,
      delta: 15379,
    })
    expect(eagleHt.find((deal) => deal.floor === "29DDB")).toMatchObject({
      ask: 39991,
      trade: 34605,
      delta: 5386,
    })
    expect(eagleHt.find((deal) => deal.floor === "29RLC")).toMatchObject({
      ask: 49677,
      trade: 34605,
      delta: 15072,
    })
    expect(eagleHt.find((deal) => deal.floor === "30CRT")).toMatchObject({
      ask: 49988,
      trade: 37935,
      delta: 12053,
    })
    expect(eagleHt.find((deal) => deal.floor === "31QCD")).toMatchObject({
      ask: 50050,
      trade: 37305,
      delta: 12745,
    })
    expect(
      eagleHt
        .filter(
          (deal) =>
            deal.floor !== "25RUC" &&
            deal.floor !== "26REC" &&
            deal.floor !== "27MLC" &&
            deal.floor !== "28CRT" &&
            deal.floor !== "29DDB" &&
            deal.floor !== "29RLC" &&
            deal.floor !== "30CRT" &&
            deal.floor !== "31QCD"
        )
        .every((deal) => deal.ask == null && deal.delta == null)
    ).toBe(true)

    const northPoint = matching(deals, {
      manufacturer: "Jayco",
      year: "",
      model: "North Point",
    })
    expect(northPoint).toHaveLength(1)
    expect(northPoint.map((deal) => deal.floor)).toEqual(["310RLTS"])
    expect(northPoint[0]).toMatchObject({
      ask: 77798,
      dealer: "Camping World, Georgetown, KY",
      trade: 61605,
      delta: 16193,
    })

    const pinnacle = matching(deals, {
      manufacturer: "Jayco",
      year: "",
      model: "Pinnacle",
    })
    expect(pinnacle).toHaveLength(1)
    expect(pinnacle.map((deal) => deal.floor)).toEqual(["32RLTS"])
    expect(pinnacle[0]).toMatchObject({
      ask: 84179,
      dealer: "Camping World, Davenport, IA",
      trade: 67320,
      delta: 16859,
    })
  })

  it("cascades Keystone models and prices Alpine 3011CK", () => {
    const options = filterOptions(deals, {
      manufacturer: "Keystone",
      year: "",
      model: "",
    })
    expect(options.manufacturer).toEqual([
      "Coachmen",
      "East To West",
      "Forest River",
      "Jayco",
      "Keystone",
    ])
    expect(options.model).toEqual([
      "Alpine",
      "Alpine Avalanche Edition",
      "Arcadia",
      "Arcadia Select",
      "Arcadia Super Lite",
      "Avalanche",
      "Cougar",
      "Cougar Half-Ton",
      "Cougar Sport",
      "Impact",
      "Montana",
      "Montana High Country",
      "Sprinter",
      "Sprinter Limited",
    ])
    expect(options.model).not.toContain("Other")
    expect(options.model).not.toContain("Brookstone")
    expect(options.model).not.toContain("Eagle")

    const alpine = matching(deals, {
      manufacturer: "Keystone",
      year: "",
      model: "Alpine",
    })
    expect(alpine).toHaveLength(4)
    expect(alpine.map((deal) => deal.floor)).toEqual([
      "3011CK",
      "3100 RE",
      "3100RE",
      "3303CK",
    ])
    expect(alpine.find((deal) => deal.floor === "3011CK")).toMatchObject({
      ask: 77998,
      dealer: "Fun Town RV–San Antonio, Cibolo, TX",
      trade: 56205,
      delta: 21793,
    })
    expect(alpine.find((deal) => deal.floor === "3100RE")).toMatchObject({
      ask: 73966,
      dealer: "Holman Motors, Inc., Batavia, OH",
      trade: 55710,
      delta: 18256,
    })
    expect(alpine.find((deal) => deal.floor === "3100 RE")).toMatchObject({
      ask: 73966,
      dealer: "Holman Motors, Inc., Batavia, OH",
      trade: 55710,
      delta: 18256,
    })
    expect(alpine.find((deal) => deal.floor === "3303CK")).toMatchObject({
      ask: 75524,
      dealer: "Camping World, Tyler, TX",
      trade: 62505,
      delta: 13019,
    })
    expect(
      alpine
        .filter(
          (deal) =>
            deal.floor !== "3011CK" &&
            deal.floor !== "3100RE" &&
            deal.floor !== "3100 RE" &&
            deal.floor !== "3303CK"
        )
        .every((deal) => deal.ask == null && deal.delta == null)
    ).toBe(true)

    const avalancheEdition = matching(deals, {
      manufacturer: "Keystone",
      year: "",
      model: "Alpine Avalanche Edition",
    })
    expect(avalancheEdition).toHaveLength(2)
    expect(avalancheEdition.map((deal) => deal.floor)).toEqual([
      "321RL",
      "338GK",
    ])
    expect(avalancheEdition.find((deal) => deal.floor === "321RL")).toMatchObject({
      ask: 66988,
      dealer: "RV Roadway, Calera, AL",
      trade: 51615,
      delta: 15373,
    })
    expect(avalancheEdition.find((deal) => deal.floor === "338GK")).toMatchObject({
      ask: 69998,
      dealer: "Fun Town RV – Amarillo, Amarillo, TX",
      trade: 53100,
      delta: 16898,
    })

    const avalanche = matching(deals, {
      manufacturer: "Keystone",
      year: "",
      model: "Avalanche",
    })
    expect(avalanche).toHaveLength(2)
    expect(avalanche.map((deal) => deal.floor)).toEqual(["302RS", "321RL"])
    expect(avalanche.find((deal) => deal.floor === "321RL")).toMatchObject({
      ask: 76995,
      dealer: "Bish's RV – Anderson, IN, Anderson, IN",
      trade: null,
      delta: null,
    })
    expect(avalanche.find((deal) => deal.floor === "302RS")).toMatchObject({
      ask: null,
      dealer: "",
      trade: null,
      delta: null,
    })

    const arcadia = matching(deals, {
      manufacturer: "Keystone",
      year: "",
      model: "Arcadia",
    })
    expect(arcadia).toHaveLength(1)
    expect(arcadia[0]).toMatchObject({
      floor: "3260RL",
      ask: 58567,
      dealer: "Buckeye RV Jeffersonville, Jeffersonville, OH",
      trade: 48690,
      delta: 9877,
    })

    const arcadiaSelect = matching(deals, {
      manufacturer: "Keystone",
      year: "",
      model: "Arcadia Select",
    })
    expect(arcadiaSelect).toHaveLength(5)
    expect(arcadiaSelect.map((deal) => deal.floor)).toEqual([
      "21SRK",
      "24SRE",
      "25SRD",
      "27SBH",
      "28SLS",
    ])
    expect(arcadiaSelect.find((deal) => deal.floor === "21SRK")).toMatchObject({
      ask: 34995,
      dealer: "Bish's RV, Anderson, IN",
      trade: 26325,
      delta: 8670,
    })
    expect(arcadiaSelect.find((deal) => deal.floor === "24SRE")).toMatchObject({
      ask: 38998,
      dealer: "Fun Town RV – Texarkana, Texarkana, AR",
      trade: 27585,
      delta: 11413,
    })
    expect(arcadiaSelect.find((deal) => deal.floor === "25SRD")).toMatchObject({
      ask: 32800,
      dealer: "Zoomers RV, Wabash, IN",
      trade: 26910,
      delta: 5890,
    })
    expect(arcadiaSelect.find((deal) => deal.floor === "27SBH")).toMatchObject({
      ask: 33999,
      dealer: "Gillette Interstate RV, Haslett, MI",
      trade: 27585,
      delta: 6414,
    })
    expect(arcadiaSelect.find((deal) => deal.floor === "28SLS")).toMatchObject({
      ask: 34995,
      dealer: "Schieks RV - Fond du lac, WI, Fond Du Lac, WI",
      trade: 29610,
      delta: 5385,
    })
    expect(
      arcadiaSelect
        .filter(
          (deal) =>
            deal.floor !== "21SRK" &&
            deal.floor !== "24SRE" &&
            deal.floor !== "25SRD" &&
            deal.floor !== "27SBH" &&
            deal.floor !== "28SLS"
        )
        .every((deal) => deal.ask == null && deal.delta == null)
    ).toBe(true)

    const arcadiaSuperLite = matching(deals, {
      manufacturer: "Keystone",
      year: "",
      model: "Arcadia Super Lite",
    })
    expect(arcadiaSuperLite).toHaveLength(5)
    expect(arcadiaSuperLite.map((deal) => deal.floor)).toEqual([
      "242SLMD",
      "260SLCL",
      "292SLRL",
      "294SLRD",
      "308SLBH",
    ])
    expect(arcadiaSuperLite.find((deal) => deal.floor === "242SLMD")).toMatchObject({
      ask: 43692,
      dealer: "Buckeye RV Jeffersonville, Jeffersonville, OH",
      trade: 38565,
      delta: 5127,
    })
    expect(
      arcadiaSuperLite.find((deal) => deal.floor === "260SLCL")
    ).toMatchObject({
      ask: 43694,
      dealer: "Camping World, Scott City, MO",
      trade: 40545,
      delta: 3149,
    })
    expect(
      arcadiaSuperLite.find((deal) => deal.floor === "292SLRL")
    ).toMatchObject({
      ask: 46295,
      dealer: "Camping World (Kansas City, KS), Kansas City, KS",
      trade: 43110,
      delta: 3185,
    })
    expect(arcadiaSuperLite.find((deal) => deal.floor === "294SLRD")).toMatchObject({
      ask: 49379,
      dealer: "Camping World (Coldwater, MI), Coldwater, MI",
      trade: 43605,
      delta: 5774,
    })
    expect(
      arcadiaSuperLite.find((deal) => deal.floor === "308SLBH")
    ).toMatchObject({
      ask: 47995,
      dealer: "Ski's Truck & RV Sales, Rockville, IN",
      trade: 38160,
      delta: 9835,
    })
    expect(
      arcadiaSuperLite
        .filter(
          (deal) =>
            deal.floor !== "242SLMD" &&
            deal.floor !== "260SLCL" &&
            deal.floor !== "292SLRL" &&
            deal.floor !== "294SLRD" &&
            deal.floor !== "308SLBH"
        )
        .every((deal) => deal.ask == null && deal.delta == null)
    ).toBe(true)

    const rows = matching(deals, {
      manufacturer: "Keystone",
      year: "",
      model: "Cougar",
    })
    expect(rows).toHaveLength(11)
    expect(rows.find((deal) => deal.floor === "24RDS")).toMatchObject({
      ask: 43434,
      dealer: "Camping World (San Diego, CA), San Diego, CA",
      trade: 34110,
      delta: 9324,
    })
    expect(rows.find((deal) => deal.floor === "260MLE")).toMatchObject({
      ask: 55900,
      dealer: "Marlette RV, Marlette, MI",
      trade: 44505,
      delta: 11395,
    })
    expect(rows.find((deal) => deal.floor === "27SGS")).toMatchObject({
      ask: 47224,
      dealer: "Camping World, Myrtle Beach, SC",
      trade: 36810,
      delta: 10414,
    })
    expect(rows.find((deal) => deal.floor === "290RLS")).toMatchObject({
      ask: 61995,
      dealer: "Crestview RV Superstore, Selma, TX",
      trade: 45900,
      delta: 16095,
    })
    expect(rows.find((deal) => deal.floor === "316RLS")).toMatchObject({
      ask: 57204,
      dealer: "Bayird RV - Outdoor & Marine, Mountain Home, AR",
      trade: 47340,
      delta: 9864,
    })
    expect(rows.find((deal) => deal.floor === "320RDS")).toMatchObject({
      ask: 58796,
      dealer: "Buckeye RV Wilmington, Wilmington, OH",
      trade: 48375,
      delta: 10421,
    })
    expect(rows.find((deal) => deal.floor === "32BHS")).toMatchObject({
      ask: 58098,
      dealer: "Camping World, Dover, FL",
      trade: 39870,
      delta: 18228,
    })
    expect(rows.find((deal) => deal.floor === "350LLK")).toMatchObject({
      ask: 66402,
      dealer: "Bayird RV - Outdoor & Marine, Mountain Home, AR",
      trade: 48825,
      delta: 17577,
    })
    expect(rows.find((deal) => deal.floor === "355FBS")).toMatchObject({
      ask: 63985,
      dealer: "Meyer's RV Superstore Ripley, Ripley, WV",
      trade: 50625,
      delta: 13360,
    })
    expect(rows.find((deal) => deal.floor === "360MBI")).toMatchObject({
      ask: 66698,
      dealer: "Camping World, Oshkosh, WI",
      trade: 51525,
      delta: 15173,
    })
    expect(rows.find((deal) => deal.floor === "364BHL")).toMatchObject({
      ask: 62379,
      dealer: "Camping World, Davenport, IA",
      trade: 49185,
      delta: 13194,
    })
    expect(
      rows
        .filter(
          (deal) =>
            deal.floor !== "24RDS" &&
            deal.floor !== "260MLE" &&
            deal.floor !== "27SGS" &&
            deal.floor !== "290RLS" &&
            deal.floor !== "316RLS" &&
            deal.floor !== "320RDS" &&
            deal.floor !== "32BHS" &&
            deal.floor !== "350LLK" &&
            deal.floor !== "355FBS" &&
            deal.floor !== "360MBI" &&
            deal.floor !== "364BHL"
        )
        .every((deal) => deal.ask == null && deal.delta == null)
    ).toBe(true)
    expect(rows.map((deal) => deal.floor)).toEqual([
      "24RDS",
      "260MLE",
      "27SGS",
      "290RLS",
      "316RLS",
      "320RDS",
      "32BHS",
      "350LLK",
      "355FBS",
      "360MBI",
      "364BHL",
    ])

    const halfTon = matching(deals, {
      manufacturer: "Keystone",
      year: "",
      model: "Cougar Half-Ton",
    })
    expect(halfTon).toHaveLength(10)
    expect(halfTon.find((deal) => deal.floor === "23MLE")).toMatchObject({
      ask: 41745,
      dealer: "Dad's Camper Outlet, Picayune, MS",
      trade: null,
      delta: null,
    })
    expect(halfTon.find((deal) => deal.floor === "24RDS")).toMatchObject({
      ask: 44995,
      dealer: "Alpin Haus - Orange County, Middletown, NY",
      trade: null,
      delta: null,
    })
    expect(halfTon.find((deal) => deal.floor === "26RES")).toMatchObject({
      ask: 39981,
      dealer: "Holman Motors, Inc., Batavia, OH",
      trade: null,
      delta: null,
    })
    expect(halfTon.find((deal) => deal.floor === "26RKE")).toMatchObject({
      ask: 55995,
      dealer: "RV Corral, Eugene, OR",
      trade: null,
      delta: null,
    })
    expect(halfTon.find((deal) => deal.floor === "27SGS")).toMatchObject({
      ask: 41452,
      dealer: "McKee Auto Center, Perry, IA",
      trade: null,
      delta: null,
    })
    expect(halfTon.find((deal) => deal.floor === "28RLI")).toMatchObject({
      ask: 51997,
      dealer: "Camping World, Akron, OH",
      trade: null,
      delta: null,
    })
    expect(halfTon.find((deal) => deal.floor === "29MBD")).toMatchObject({
      ask: 49966,
      dealer: "Camping World, Roscoe, IL",
      trade: null,
      delta: null,
    })
    expect(halfTon.find((deal) => deal.floor === "29RLI")).toMatchObject({
      ask: 53998,
      dealer: "Leach Camper Sales of Lincoln, Lincoln, NE",
      trade: null,
      delta: null,
    })
    expect(
      halfTon
        .filter(
          (deal) =>
            deal.floor !== "23MLE" &&
            deal.floor !== "24RDS" &&
            deal.floor !== "26RES" &&
            deal.floor !== "26RKE" &&
            deal.floor !== "27SGS" &&
            deal.floor !== "28RLI" &&
            deal.floor !== "29MBD" &&
            deal.floor !== "29RLI"
        )
        .every((deal) => deal.ask == null && deal.delta == null)
    ).toBe(true)
    expect(halfTon.map((deal) => deal.floor)).toEqual([
      "23MLE",
      "24RDS",
      "26RES",
      "26RKE",
      "27SGS",
      "28RLI",
      "29MBD",
      "29RLI",
      "30REP",
      "32BHS",
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
