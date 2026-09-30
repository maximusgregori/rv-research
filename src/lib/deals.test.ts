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

    const jayco = deals.filter((deal) => deal.manufacturer === "Jayco")
    expect(jayco).toHaveLength(JAYCO_FIFTH_WHEELS.length)
    expect(jayco.map((deal) => [deal.model, deal.floor])).toEqual(
      JAYCO_FIFTH_WHEELS.map(([model, floor]) => [model, floor])
    )
    expect(
      jayco.every(
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
    expect(
      keystone.every(
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
    expect(priced).toHaveLength(71)

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

  it("applies 2025 JDP proxy trades on Coachmen Adrenaline", () => {
    const rows = [
      [
        "21LT",
        34699,
        "RV Value Mart - Manheim",
        27405,
        7294,
        "$30,450",
        "m-21-lt/6639477",
        "M-21 LT",
      ],
      [
        "27LT",
        35986,
        "Uwharrie RV, Albemarle, NC",
        27630,
        8356,
        "$30,700",
        "m-27-lt/6639479",
        "M-27 LT",
      ],
      [
        "30GS",
        59999,
        "General RV Center - Tampa, Dover, FL",
        38475,
        21524,
        "$42,750",
        "m-30-gs/6639482",
        "M-30 GS",
      ],
    ] as const
    for (const [
      floor,
      ask,
      dealer,
      trade,
      delta,
      lowRetail,
      path,
      modelName,
    ] of rows) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Coachmen" &&
          row.model === "Adrenaline" &&
          row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade, delta })
      const noteText = deal?.notes
        .flat()
        .filter((span) => span.type === "text")
        .map((span) => span.text)
        .join("")
      expect(noteText).toContain("TRADE FROM 2025 (not 2026)")
      expect(noteText).toContain(
        "absent from the 2026 Coachmen-by-Forest-River JDP list"
      )
      expect(noteText).toContain(`${lowRetail} × 0.9`)
      expect(noteText).toContain(modelName)
      expect(noteText).not.toMatch(/not found/i)
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

  it("prices new Apex asks without inventing trades", () => {
    const apexUltra = deals.find(
      (deal) => deal.model === "Apex" && deal.floor === "ULTRA-LITE 293RLDS"
    )
    expect(apexUltra).toMatchObject({
      ask: 42999,
      dealer: "General RV Center - Salisbury, Salisbury, NC",
      trade: null,
      delta: null,
    })

    const apexNano = deals.find(
      (deal) => deal.model === "Apex Nano" && deal.floor === "181RB"
    )
    expect(apexNano).toMatchObject({
      ask: 20999,
      dealer: "Camp Rite RV Sales, Loganville, GA",
      trade: null,
      delta: null,
    })
  })

  it("prices Apex Ultra-Lite 188–246 asks without inventing trades or dealers", () => {
    const floors = [
      ["188RBST", 29714],
      ["241BHS", 35721],
      ["242BARV", 33495],
      ["244RBS", 32995],
      ["246BARV", 35128],
    ] as const

    for (const [floor, ask] of floors) {
      const deal = deals.find(
        (row) =>
          row.manufacturer === "Coachmen" &&
          row.model === "Apex Ultra-Lite" &&
          row.floor === floor
      )
      expect(deal).toMatchObject({
        ask,
        dealer: "",
        trade: null,
        delta: null,
      })
      expect(deal?.notes.length).toBeGreaterThan(0)
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
  })

  it("prices Apex Ultra-Lite 26BHX, 289TBSS, and X Series asks without inventing trades", () => {
    const ultra26 = deals.find(
      (deal) => deal.model === "Apex Ultra-Lite" && deal.floor === "26BHX"
    )
    expect(ultra26).toMatchObject({
      ask: 27999,
      dealer: "Bill's Happy Camper RV Sales and Service, Mill Hall, PA",
      trade: null,
      delta: null,
    })

    const ultra289 = deals.find(
      (deal) => deal.model === "Apex Ultra-Lite" && deal.floor === "289TBSS"
    )
    expect(ultra289).toMatchObject({
      ask: 34999,
      dealer: "Franklinville, NC",
      trade: null,
      delta: null,
    })

    const x24 = deals.find(
      (deal) =>
        deal.model === "Apex Ultra-Lite X Series" && deal.floor === "24RBX"
    )
    expect(x24).toMatchObject({
      ask: 25980,
      dealer: "Bobby Combs RV, Caldwell, ID",
      trade: null,
      delta: null,
    })

    const x29 = deals.find(
      (deal) =>
        deal.model === "Apex Ultra-Lite X Series" && deal.floor === "29BHX"
    )
    expect(x29).toMatchObject({
      ask: 25328,
      dealer: "Forest River RV Little Rock by Camping World",
      trade: null,
      delta: null,
    })
  })

  it("prices Apex Nano 183BH, 184BH, and 185BH without inventing trades", () => {
    const nano183 = deals.find(
      (deal) => deal.model === "Apex Nano" && deal.floor === "183BH"
    )
    expect(nano183).toMatchObject({
      ask: 25114,
      dealer: "RV Dynasty, Bunker Hill, IN",
      trade: null,
      delta: null,
    })

    const nano184 = deals.find(
      (deal) => deal.model === "Apex Nano" && deal.floor === "184BH"
    )
    expect(nano184).toMatchObject({
      ask: 22200,
      dealer: "Trailer Source Inc. Wheat Ridge RV Center, Wheat Ridge, CO",
      trade: null,
      delta: null,
    })

    const nano185 = deals.find(
      (deal) => deal.model === "Apex Nano" && deal.floor === "185BH"
    )
    expect(nano185).toMatchObject({
      ask: 21961,
      dealer: "RV Dynasty, Bunker Hill, IN",
      trade: null,
      delta: null,
    })
  })

  it("prices Apex Nano 186BH through 208BHS without inventing trades", () => {
    const nano186 = deals.find(
      (deal) => deal.model === "Apex Nano" && deal.floor === "186BH"
    )
    expect(nano186).toMatchObject({
      ask: 20495,
      dealer: "RV Specialist, Goshen, IN",
      trade: null,
      delta: null,
    })

    const nano187 = deals.find(
      (deal) => deal.model === "Apex Nano" && deal.floor === "187RB"
    )
    expect(nano187).toMatchObject({
      ask: 22400,
      dealer: "RV Dynasty, Bunker Hill, IN",
      trade: null,
      delta: null,
    })

    const nano190 = deals.find(
      (deal) => deal.model === "Apex Nano" && deal.floor === "190RBS"
    )
    expect(nano190).toMatchObject({
      ask: 19995,
      dealer: "RV Specialist",
      trade: null,
      delta: null,
    })

    const nano194 = deals.find(
      (deal) => deal.model === "Apex Nano" && deal.floor === "194BHS"
    )
    expect(nano194).toMatchObject({
      ask: 24900,
      dealer: "Minneapolis Trailer Sales",
      trade: null,
      delta: null,
    })

    const nano203 = deals.find(
      (deal) => deal.model === "Apex Nano" && deal.floor === "203RBK"
    )
    expect(nano203).toMatchObject({
      ask: 21995,
      dealer: "RV Specialist",
      trade: null,
      delta: null,
    })

    const nano208 = deals.find(
      (deal) => deal.model === "Apex Nano" && deal.floor === "208BHS"
    )
    expect(nano208).toMatchObject({
      ask: 23339,
      dealer: "Carolina RV",
      trade: null,
      delta: null,
    })
  })

  it("prices Apex Nano 213RDS, 216RKS, 224RBS, and 228BHS without inventing trades", () => {
    const nano213 = deals.find(
      (deal) =>
        deal.manufacturer === "Coachmen" &&
        deal.model === "Apex Nano" &&
        deal.floor === "213RDS"
    )
    expect(nano213).toMatchObject({
      ask: 24900,
      dealer: "Camp EZ RV - Livingston",
      trade: null,
      delta: null,
    })

    const nano216 = deals.find(
      (deal) =>
        deal.manufacturer === "Coachmen" &&
        deal.model === "Apex Nano" &&
        deal.floor === "216RKS"
    )
    expect(nano216).toMatchObject({
      ask: 27999,
      dealer: "Bill's Happy Camper RV Sales and Service",
      trade: null,
      delta: null,
    })

    const nano224 = deals.find(
      (deal) =>
        deal.manufacturer === "Coachmen" &&
        deal.model === "Apex Nano" &&
        deal.floor === "224RBS"
    )
    expect(nano224).toMatchObject({
      ask: 24999,
      dealer: "General RV Center - Mesa",
      trade: null,
      delta: null,
    })

    const nano228 = deals.find(
      (deal) =>
        deal.manufacturer === "Coachmen" &&
        deal.model === "Apex Nano" &&
        deal.floor === "228BHS"
    )
    expect(nano228).toMatchObject({
      ask: 28995,
      dealer: "RV Specialist",
      trade: null,
      delta: null,
    })
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
        "243RBSLE",
        26980,
        "Eagle Country RV, Eagle River, WI",
      ],
      [
        "Catalina Legacy Edition",
        "283RNR",
        33995,
        "Triple H RVs, Haleyville AL",
      ],
      [
        "Catalina Legacy Edition",
        "293QBCKLE",
        30944,
        "RV Value Mart - Asheboro, Franklinville NC",
      ],
      ["Beyond", "22C", 144998, "Reno, NV"],
      ["Beyond", "22D-EB", 139995, "Myrtle Beach, SC"],
      ["Beyond", "22RBBC", 159985, "Fountain Valley, CA"],
      ["Beyond", "22RB", 145000, "Delta, OH"],
    ] as const
    for (const [model, floor, ask, dealer] of missing) {
      const deal = deals.find(
        (row) => row.model === model && row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade: null, delta: null })
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "text" &&
              span.text.includes(
                `Exact floor ${floor} was checked on the 2026 JDP ${model} series page and is not listed`
              )
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && /not found/i.test(span.text))
      ).toBe(false)
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

  it("leaves verified-missing Summit floors without trade or a not-found claim", () => {
    const missing = [
      [
        "Catalina Summit Series 7",
        "184BHS",
        24995,
        "Campers Inn RV of Johnstown",
      ],
      ["Catalina Summit Series 7", "184RBS", 19999, "Camp Rite RV Sales"],
      ["Catalina Summit Series 8", "221MKE", 26895, "Meyer's RV of Egg Harbor"],
    ] as const
    for (const [model, floor, ask, dealer] of missing) {
      const deal = deals.find(
        (row) => row.model === model && row.floor === floor
      )
      expect(deal).toMatchObject({ ask, dealer, trade: null, delta: null })
      expect(
        deal?.notes
          .flat()
          .some(
            (span) =>
              span.type === "text" &&
              span.text.includes(
                `Exact floor ${floor} was checked on 2026 JDP Catalina Summit and is not listed`
              )
          )
      ).toBe(true)
      expect(
        deal?.notes
          .flat()
          .some((span) => span.type === "text" && /not found/i.test(span.text))
      ).toBe(false)
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
    expect(
      lite274?.notes
        .flat()
        .some(
          (span) =>
            span.type === "text" &&
            span.text.includes("JDP has no 2026 Chaparral Lite 274BH")
        )
    ).toBe(true)

    expect(
      deals.filter((deal) =>
        deal.notes
          .flat()
          .some((span) => span.type === "text" && span.text === pending)
      ).length
    ).toBe(24)
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
      -5252, -3791, -3525, -3461, -2490, -2065, -1971, -1885, -1885, -1805,
      -1595, -1476, -1206, -1195, -1170, -795, -586, -101, -30, -20, 390, 535,
      573, 659, 1609, 2535, 3195, 5514, 5889, 7294, 8356, 13165, 21524, 22400,
      26440, 28866,
    ])
    expect(empty.length).toBe(381)
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

  it("cascades Jayco models and keeps those rows unpriced", () => {
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
      model: "Eagle HT",
    })
    expect(rows).toHaveLength(8)
    expect(rows.every((deal) => deal.ask == null && deal.delta == null)).toBe(
      true
    )
    expect(rows.map((deal) => deal.floor)).toEqual([
      "25RUC",
      "26REC",
      "27MLC",
      "28CRT",
      "29DDB",
      "29RLC",
      "30CRT",
      "31QCD",
    ])
  })

  it("cascades Keystone models and keeps those rows unpriced", () => {
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

    const rows = matching(deals, {
      manufacturer: "Keystone",
      year: "",
      model: "Cougar",
    })
    expect(rows).toHaveLength(11)
    expect(rows.every((deal) => deal.ask == null && deal.delta == null)).toBe(
      true
    )
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
