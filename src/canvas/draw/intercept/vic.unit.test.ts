import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { AircraftGroup, GroupParams } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { FORMAT } from "../../../classes/supportedformats"
import TestCanvas from "../../../testutils/testcanvas"
import * as PSMath from "../../../utils/math"
import {
  BlueInThe,
  PictureCanvasProps,
  PictureCanvasState,
} from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import { testProps } from "./mockutils.unit.test"
import DrawVic from "./vic"

let testState: PictureCanvasState
let p: Partial<GroupParams>
let vic: DrawVic

jest.mock("./cap", () => {
  //nothing
})

/**
 * Test the azimuth picture drawer
 */
describe("DrawVic", () => {
  function setBlueInTheNorth() {
    const updatedProps = { ...testProps }

    updatedProps.displaySettings.canvasConfig.orient = BlueInThe.NORTH
    const updatedState = {
      ...testState,
      blueAir: new AircraftGroup({ sx: 200, sy: 50, hdg: 180, nContacts: 4 }),
    }

    vic.initialize(updatedProps, updatedState)
  }

  afterEach(() => {
    PaintBrush.clearCanvas()
  })

  beforeEach(() => {
    TestCanvas.useContext(800, 500)

    testState = {
      bullseye: new Point(400, 400),
      blueAir: new AircraftGroup({ sx: 600, sy: 400, hdg: 270, nContacts: 4 }),
      answer: { pic: "3 grp ladder", groups: [] },
      reDraw: jest.fn(),
    }

    p = {
      dataTrailType: SensorType.ARROW,
      sx: 200,
      sy: 400,
      nContacts: 4,
      hdg: 90,
      alts: [20, 20, 20, 20],
    }

    testProps.displaySettings.canvasConfig.orient = BlueInThe.EAST
    vic = new DrawVic()
    vic.initialize(testProps, testState)

    jest.restoreAllMocks()
  })

  it("simple_functions", () => {
    vic.create()
    expect(vic.dimensions.deep).toEqual(0)
    expect(vic.dimensions.wide).toEqual(0)
    expect(vic.groups.length).toEqual(0)
  })

  it("chooses_grps_for_n_contacts", () => {
    vic.chooseNumGroups()
    expect(vic.numGroupsToCreate).toEqual(3)
  })

  it("hot_vic", () => {
    const lg = new AircraftGroup(p)
    const ntg = new AircraftGroup({
      ...p,
      sx: 155,
      sy: 450,
      alts: [15, 15, 15, 15],
    })
    const stg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 350,
      alts: [13, 13, 13, 13],
    })

    vic.groups = [lg, ntg, stg]
    vic.drawInfo()

    expect(vic.getAnswer()).toEqual(
      "3 GROUP VIC 12 DEEP, 25 WIDE, " +
        "LEAD GROUP BULLSEYE 266/44, 20k HOSTILE HEAVY 4 CONTACTS " +
        "NORTH TRAIL GROUP 15k HOSTILE HEAVY 4 CONTACTS " +
        "SOUTH TRAIL GROUP 13k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("hot_vic_ipe", () => {
    const lg = new AircraftGroup(p)
    const ntg = new AircraftGroup({
      ...p,
      sx: 155,
      sy: 450,
      alts: [15, 15, 15, 15],
    })
    const stg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 350,
      alts: [13, 13, 13, 13],
    })

    vic.groups = [lg, ntg, stg]
    vic.drawInfo()

    const updatedProps = { ...testProps, format: FORMAT.IPE }

    vic.initialize(updatedProps, testState)

    expect(vic.getAnswer()).toEqual(
      "3 GROUP VIC 12 DEEP, 25 WIDE, " +
        "LEAD GROUP BULLSEYE 266/44, 20k HOSTILE HEAVY 4 CONTACTS " +
        "NORTH TRAIL GROUP 15k HOSTILE HEAVY 4 CONTACTS " +
        "SOUTH TRAIL GROUP 13k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("vic_labels_EW", () => {
    setBlueInTheNorth()
    const p2 = { ...p, hdg: 359 }
    const lg = new AircraftGroup(p2)
    const ntg = new AircraftGroup({
      ...p2,
      sx: 175,
      sy: 450,
      alts: [15, 15, 15, 15],
    })
    const stg = new AircraftGroup({
      ...p2,
      sx: 220,
      sy: 450,
      alts: [13, 13, 13, 13],
    })

    vic.groups = [lg, ntg, stg]
    vic.drawInfo()

    expect(vic.getAnswer()).toEqual(
      "3 GROUP VIC 12 DEEP, 11 WIDE, " +
        "LEAD GROUP BULLSEYE 277/47, 20k HOSTILE HEAVY 4 CONTACTS " +
        "WEST TRAIL GROUP 15k HOSTILE HEAVY 4 CONTACTS " +
        "EAST TRAIL GROUP 13k HOSTILE HEAVY 4 CONTACTS"
    )

    stg.setLabel("EAST")
    ntg.setLabel("WEST")
    vic.groups = [lg, stg, ntg]

    expect(vic.getAnswer()).toEqual(
      "3 GROUP VIC 12 DEEP, 11 WIDE, " +
        "LEAD GROUP BULLSEYE 277/47, 20k HOSTILE HEAVY 4 CONTACTS " +
        "EAST TRAIL GROUP 15k HOSTILE HEAVY 4 CONTACTS " +
        "WEST TRAIL GROUP 13k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("gets_picture_info", () => {
    vic.numGroupsToCreate = 3
    const pInfo = vic.getPictureInfo()

    expect(pInfo.deep).toBeLessThan(45 * PSMath.PIXELS_TO_NM)
    expect(pInfo.deep).toBeLessThan(45 * PSMath.PIXELS_TO_NM)
    expect(pInfo.wide).toBeLessThan(45 * PSMath.PIXELS_TO_NM)
  })

  it("creates_groups_vanilla", () => {
    jest.spyOn(PSMath, "randomHeading").mockReturnValue(90)
    jest.spyOn(PSMath, "randomNumber").mockReturnValue(20)
    vic.numGroupsToCreate = 3
    vic.dimensions = vic.getPictureInfo()
    const startPos = new Point(100, 100)
    const groups = vic.createGroups(startPos, [1, 1, 1]) // three single contact groups

    expect(groups[0].getHeading()).toEqual(90)
    expect(groups[1].getHeading()).toEqual(110)
    expect(groups[2].getHeading()).toEqual(110)
    expect(groups[0].getStartPos()).toEqual(new Point(120, 110))
    expect(groups[1].getStartPos()).toEqual(new Point(100, 100))
    expect(groups[2].getStartPos()).toEqual(new Point(100, 120))
  })

  it("creates_groups_hardMode", () => {
    jest
      .spyOn(PSMath, "randomHeading")
      .mockReturnValueOnce(90)
      .mockReturnValueOnce(80)
      .mockReturnValueOnce(125)

    jest
      .spyOn(PSMath, "randomNumber")
      .mockReturnValueOnce(20)
      .mockReturnValueOnce(20)
      .mockReturnValue(1)

    const updatedProps: PictureCanvasProps = { ...testProps, isHardMode: true }

    vic.initialize(updatedProps, testState)
    vic.numGroupsToCreate = 3
    vic.dimensions = vic.getPictureInfo()
    const startPos = new Point(100, 100)
    const groups = vic.createGroups(startPos, [1, 1, 1]) // three single contact groups

    expect(groups[0].getHeading()).toEqual(125)
    expect(groups[1].getHeading()).toEqual(91)
    expect(groups[2].getHeading()).toEqual(81)
    expect(groups[0].getStartPos()).toEqual(new Point(120, 110))
    expect(groups[1].getStartPos()).toEqual(new Point(100, 100))
    expect(groups[2].getStartPos()).toEqual(new Point(100, 120))
  })

  it("creates_groups_NS", () => {
    jest.spyOn(PSMath, "randomHeading").mockReturnValue(90)
    jest.spyOn(PSMath, "randomNumber").mockReturnValue(1)

    const updatedProps: PictureCanvasProps = { ...testProps }

    updatedProps.displaySettings.canvasConfig.orient = BlueInThe.NORTH

    vic.initialize(updatedProps, testState)
    vic.numGroupsToCreate = 3
    const startPos = new Point(100, 100)
    const groups = vic.createGroups(startPos, [1, 1, 1]) // three single contact groups

    expect(groups[0].getHeading()).toEqual(90)
    expect(groups[1].getHeading()).toEqual(91)
    expect(groups[2].getHeading()).toEqual(91)
    expect(groups[0].getStartPos()).toEqual(new Point(100, 100))
    expect(groups[1].getStartPos()).toEqual(new Point(100, 100))
    expect(groups[2].getStartPos()).toEqual(new Point(100, 100))
  })

  /**
   *       ->
   *                        <--
   *       ->  ->
   */
  it("vic_weighted_south", () => {
    // p = x:200, y:400
    const lg = new AircraftGroup(p)
    const ntg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 200,
      alts: [15, 15, 15, 15],
    })
    const stg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 400,
      alts: [13, 13, 13, 13],
    })

    vic.groups = [lg, ntg, stg]
    vic.drawInfo()
    expect(vic.getAnswer().includes("WEIGHTED SOUTH")).toEqual(true)
  })

  /**
   *       ->  ->
   *                        <--
   *       ->
   */
  it("vic_weighted_north", () => {
    const lg = new AircraftGroup(p)
    const ntg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 400,
      alts: [15, 15, 15, 15],
    })
    const stg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 500,
      alts: [13, 13, 13, 13],
    })

    vic.groups = [lg, ntg, stg]
    vic.drawInfo()
    expect(vic.getAnswer().includes("WEIGHTED NORTH")).toEqual(true)
  })

  /**
   *          V
   *
   *
   *         A
   *
   *         A     A
   */
  it("vic_weighted_west", () => {
    setBlueInTheNorth()
    const lg = new AircraftGroup(p)
    const ntg = new AircraftGroup({
      ...p,
      sx: 200,
      sy: 200,
      alts: [15, 15, 15, 15],
    })
    const stg = new AircraftGroup({
      ...p,
      sx: 250,
      sy: 200,
      alts: [13, 13, 13, 13],
    })

    vic.groups = [lg, ntg, stg]
    vic.drawInfo()
    expect(vic.getAnswer().includes("WEIGHTED WEST")).toEqual(true)
  })

  /**
   *          V
   *
   *
   *               A
   *
   *         A     A
   */
  it("vic_weighted_east", () => {
    setBlueInTheNorth()
    const lg = new AircraftGroup(p)
    const ntg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 200,
      alts: [15, 15, 15, 15],
    })
    const stg = new AircraftGroup({
      ...p,
      sx: 200,
      sy: 200,
      alts: [13, 13, 13, 13],
    })

    vic.groups = [lg, ntg, stg]
    vic.drawInfo()
    expect(vic.getAnswer().includes("WEIGHTED EAST")).toEqual(true)
  })
})
