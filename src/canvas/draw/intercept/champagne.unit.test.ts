import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { AircraftGroup, GroupParams } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import TestCanvas from "../../../testutils/testcanvas"
import { PIXELS_TO_NM } from "../../../utils/math"
import { BlueInThe, PictureCanvasState } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import DrawChampange from "./champagne"
import { testProps } from "./mockutils.unit.test"
import { PictureInfo } from "./pictureclamp"

let testState: PictureCanvasState
let p: Partial<GroupParams>
let champ: DrawChampange

/**
 * Test the azimuth picture drawer
 */
describe("DrawChamp", () => {
  beforeEach(() => {
    TestCanvas.useContext(800, 500)

    testState = {
      bullseye: new Point(400, 400),
      blueAir: new AircraftGroup({ sx: 600, sy: 400, hdg: 270, nContacts: 4 }),
      answer: { pic: "3 grp champ", groups: [] },
      reDraw: jest.fn(),
    }

    p = {
      dataTrailType: SensorType.ARROW,
      sx: 200,
      sy: 200,
      nContacts: 4,
      hdg: 90,
      alts: [20, 20, 20, 20],
    }

    testProps.displaySettings.canvasConfig.orient = BlueInThe.EAST
    champ = new DrawChampange()
    champ.initialize(testProps, testState)
  })

  beforeAll(() => {
    testProps.displaySettings.canvasConfig.orient = BlueInThe.EAST
  })

  beforeEach(() => {
    PaintBrush.clearCanvas()
  })

  it("hot_champ", () => {
    const nlg = new AircraftGroup(p)
    const slg = new AircraftGroup({ ...p, sy: 250, alts: [15, 15, 15, 15] })
    const tg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 225,
      alts: [15, 15, 15, 15],
    })

    champ.groups = [tg, nlg, slg]
    champ.drawInfo()

    expect(champ.getAnswer()).toEqual(
      "THREE GROUP CHAMPAGNE 12 WIDE 12 DEEP, " +
        "SOUTH LEAD GROUP BULLSEYE 308/55, 15k HOSTILE HEAVY 4 CONTACTS " +
        "NORTH LEAD GROUP BULLSEYE 317/64, 20k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 15k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("champ_labels_EW", () => {
    const updatedProps = { ...testProps }

    updatedProps.displaySettings.canvasConfig.orient = BlueInThe.NORTH

    champ.initialize(updatedProps, testState)

    const nlg = new AircraftGroup({ ...p, sx: 200, sy: 250 })
    const slg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 250,
      alts: [15, 15, 15, 15],
    })
    const tg = new AircraftGroup({
      ...p,
      sx: 175,
      sy: 300,
      alts: [15, 15, 15, 15],
    })

    champ.groups = [tg, nlg, slg]
    champ.drawInfo()

    expect(champ.getAnswer()).toEqual(
      "THREE GROUP CHAMPAGNE 12 WIDE 12 DEEP, " +
        "WEST LEAD GROUP BULLSEYE 308/55, 20k HOSTILE HEAVY 4 CONTACTS " +
        "EAST LEAD GROUP BULLSEYE 301/66, 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 15k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("weighted_N_champ", () => {
    champ.initialize(testProps, testState)
    const nlg = new AircraftGroup(p)
    const slg = new AircraftGroup({
      ...p,
      sx: 200,
      sy: 250,
      alts: [15, 15, 15, 15],
    })
    const tg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 200,
      alts: [15, 15, 15, 15],
    })

    champ.groups = [tg, nlg, slg]
    champ.drawInfo()

    expect(champ.getAnswer()).toEqual(
      "THREE GROUP CHAMPAGNE 12 WIDE 12 DEEP, WEIGHTED NORTH, " +
        "SOUTH LEAD GROUP BULLSEYE 308/55, 15k HOSTILE HEAVY 4 CONTACTS " +
        "NORTH LEAD GROUP BULLSEYE 317/64, 20k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 15k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("weighted_S_champ", () => {
    champ.initialize(testProps, testState)
    const nlg = new AircraftGroup(p)
    const slg = new AircraftGroup({
      ...p,
      sx: 200,
      sy: 250,
      alts: [15, 15, 15, 15],
    })
    const tg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 250,
      alts: [15, 15, 15, 15],
    })

    champ.groups = [tg, nlg, slg]
    champ.drawInfo()

    expect(champ.getAnswer()).toEqual(
      "THREE GROUP CHAMPAGNE 12 WIDE 12 DEEP, WEIGHTED SOUTH, " +
        "SOUTH LEAD GROUP BULLSEYE 308/55, 15k HOSTILE HEAVY 4 CONTACTS " +
        "NORTH LEAD GROUP BULLSEYE 317/64, 20k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 15k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("tests_simple_functions", () => {
    champ.create() // empty
    expect(champ.groups.length).toEqual(0)
    champ.chooseNumGroups()
    expect(champ.numGroupsToCreate).toEqual(3)

    const pt = new Point(100, 100)
    const pInfo: PictureInfo = champ.getPictureInfo(pt)

    expect(pInfo.start).toEqual(pt)
    expect(pInfo.deep).toBeGreaterThanOrEqual(7 * PIXELS_TO_NM)
    expect(pInfo.deep).toBeLessThanOrEqual(35 * PIXELS_TO_NM)
    expect(pInfo.wide).toBeGreaterThanOrEqual(7 * PIXELS_TO_NM)
    expect(pInfo.wide).toBeLessThanOrEqual(35 * PIXELS_TO_NM)
  })

  it("creates_groups", () => {
    const updatedProps = { ...testProps, isHardMode: true }

    champ.initialize(updatedProps, testState)
    const pt = new Point(100, 100)
    const grps = champ.createGroups(pt, [1, 1, 1])

    expect(grps.length).toEqual(3)
    expect(grps[0].getStrength()).toEqual(1)
    expect(grps[1].getStrength()).toEqual(1)
    expect(grps[2].getStrength()).toEqual(1)
    expect(grps[0].getLabel()).toEqual("TRAIL GROUP")
    expect(grps[1].getLabel()).toEqual("NORTH LEAD GROUP")
    expect(grps[2].getLabel()).toEqual("SOUTH LEAD GROUP")
  })

  it("creates_groups_NS", () => {
    testProps.displaySettings.canvasConfig.orient = BlueInThe.NORTH
    const updatedProps = { ...testProps }

    champ.initialize(updatedProps, testState)
    const pt = new Point(100, 100)
    const grps = champ.createGroups(pt, [1, 1, 1])

    expect(grps.length).toEqual(3)
    expect(grps[0].getStrength()).toEqual(1)
    expect(grps[1].getStrength()).toEqual(1)
    expect(grps[2].getStrength()).toEqual(1)
    expect(grps[0].getLabel()).toEqual("TRAIL GROUP")
    expect(grps[1].getLabel()).toEqual("WEST LEAD GROUP")
    expect(grps[2].getLabel()).toEqual("EAST LEAD GROUP")
  })
})
