import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { AircraftGroup, GroupParams } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { FORMAT } from "../../../classes/supportedformats"
import {
  BlueInThe,
  PictureCanvasProps,
  PictureCanvasState,
} from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import DrawLadder from "./ladder"
import { testProps } from "./mockutils.unit.test"
import * as PSMath from "../../../utils/psmath"
import TestCanvas from "../../../testutils/testcanvas"

let testState: PictureCanvasState
let p: Partial<GroupParams>
let ladder: DrawLadder

jest.mock("./cap", () => {
  //nothing
})

/**
 * Test the azimuth picture drawer
 */
describe("DrawLadder", () => {
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
      sy: 200,
      nContacts: 4,
      hdg: 90,
      alts: [20, 20, 20, 20],
    }

    testProps.orientation.orient = BlueInThe.EAST
    ladder = new DrawLadder()
    ladder.initialize(testProps, testState)

    jest.restoreAllMocks()
  })

  it("simple_functions", () => {
    ladder.create()
    expect(ladder.dimensions.deep).toEqual(0)
    expect(ladder.dimensions.wide).toEqual(0)
    expect(ladder.groups.length).toEqual(0)

    expect(ladder.formatWeighted()).toEqual("")
  })

  it("chooses_grps_for_n_contacts", () => {
    jest
      .spyOn(PSMath, "randomNumber")
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(5)

    ladder.chooseNumGroups(1)
    expect(ladder.numGroupsToCreate).toEqual(3)
    ladder.chooseNumGroups(4)
    expect(ladder.numGroupsToCreate).toEqual(4)
    ladder.chooseNumGroups(6)
    expect(ladder.numGroupsToCreate).toEqual(5)
    ladder.chooseNumGroups(0)
    expect(ladder.numGroupsToCreate).toEqual(5)
    jest.restoreAllMocks()
  })

  it("hot_ladder", () => {
    const lg = new AircraftGroup(p)
    const mg = new AircraftGroup({ ...p, sx: 180, alts: [15, 15, 15, 15] })
    const tg = new AircraftGroup({
      ...p,
      sx: 150,
      alts: [15, 15, 15, 15],
    })

    ladder.groups = [lg, mg, tg]
    ladder.drawInfo()

    expect(ladder.getAnswer()).toEqual(
      "3 GROUP LADDER 12 DEEP, " +
        "LEAD GROUP BULLSEYE 305/68, 15k HOSTILE HEAVY 4 CONTACTS " +
        "MIDDLE GROUP SEPARATION 7 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("hot_ladder_ipe", () => {
    const lg = new AircraftGroup(p)
    const mg = new AircraftGroup({ ...p, sx: 180, alts: [15, 15, 15, 15] })
    const tg = new AircraftGroup({
      ...p,
      sx: 150,
      alts: [15, 15, 15, 15],
    })

    ladder.groups = [lg, mg, tg]
    ladder.drawInfo()

    const updatedProps = { ...testProps, format: FORMAT.IPE }
    ladder.initialize(updatedProps, testState)

    expect(ladder.getAnswer()).toEqual(
      "3 GROUP LADDER 12 DEEP, " +
        "LEAD GROUP BULLSEYE 305/68, 15k HOSTILE HEAVY 4 CONTACTS " +
        "MIDDLE GROUP RANGE 7 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("ladder_labels_EW", () => {
    const updatedProps = { ...testProps }
    updatedProps.orientation.orient = BlueInThe.NORTH

    ladder.initialize(updatedProps, testState)

    const lg = new AircraftGroup({ ...p, sy: 250 })
    const mg = new AircraftGroup({
      ...p,
      sy: 275,
      alts: [15, 15, 15, 15],
    })
    const tg = new AircraftGroup({
      ...p,
      sy: 300,
      alts: [15, 15, 15, 15],
    })

    ladder.groups = [lg, mg, tg]
    ladder.drawInfo()

    expect(ladder.getAnswer()).toEqual(
      "3 GROUP LADDER 12 DEEP, " +
        "LEAD GROUP BULLSEYE 297/49, 15k HOSTILE HEAVY 4 CONTACTS " +
        "MIDDLE GROUP SEPARATION 6 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("ladder_4_grps", () => {
    testProps.orientation.orient = BlueInThe.EAST
    ladder.initialize(testProps, testState)

    const lg = new AircraftGroup({ ...p })
    const grp2 = new AircraftGroup({
      ...p,
      sx: 225,
      alts: [15, 15, 15, 15],
    })
    const grp3 = new AircraftGroup({
      ...p,
      sx: 250,
      alts: [17],
      nContacts: 1,
    })
    const tg = new AircraftGroup({
      ...p,
      sx: 275,
      alts: [15, 15],
      nContacts: 2,
    })

    ladder.groups = [lg, grp2, grp3, tg]
    ladder.drawInfo()

    expect(ladder.getAnswer()).toEqual(
      "4 GROUP LADDER 18 DEEP, TRACK EAST. " +
        "LEAD GROUP BULLSEYE 333/55, 15k HOSTILE 2 CONTACTS " +
        "2ND GROUP SEPARATION 6 17k HOSTILE " +
        "3RD GROUP 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("ladder_5_grps", () => {
    testProps.orientation.orient = BlueInThe.EAST
    ladder.initialize(testProps, testState)

    const lg = new AircraftGroup({ ...p })
    const grp2 = new AircraftGroup({
      ...p,
      sx: 225,
      alts: [15, 15, 15, 15],
    })
    const grp3 = new AircraftGroup({
      ...p,
      sx: 250,
      alts: [17],
      nContacts: 1,
    })
    const grp4 = new AircraftGroup({
      ...p,
      sx: 275,
      alts: [10],
      nContacts: 1,
    })
    const tg = new AircraftGroup({
      ...p,
      sx: 300,
      alts: [15, 15],
      nContacts: 2,
    })

    ladder.groups = [lg, grp2, grp3, grp4, tg]
    ladder.drawInfo()

    expect(ladder.getAnswer()).toEqual(
      "5 GROUP LADDER 25 DEEP, TRACK EAST. " +
        "LEAD GROUP BULLSEYE 339/52, 15k HOSTILE 2 CONTACTS " +
        "2ND GROUP SEPARATION 6 10k HOSTILE " +
        "3RD GROUP 17k HOSTILE " +
        "4TH GROUP 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("gets_picture_info", () => {
    ladder.numGroupsToCreate = 3
    const pInfo = ladder.getPictureInfo()
    expect(pInfo.deep).toBeLessThan(45 * PSMath.PIXELS_TO_NM)
    expect(pInfo.deep).toBeLessThan(45 * PSMath.PIXELS_TO_NM)
    expect(pInfo.wide).toEqual(5 * PSMath.PIXELS_TO_NM)
  })

  it("creates_groups_vanilla", () => {
    jest.spyOn(PSMath, "randomHeading").mockReturnValue(90)
    jest.spyOn(PSMath, "randomNumber").mockReturnValue(1)
    ladder.numGroupsToCreate = 3
    ladder.seps = [40, 40, 40]
    const startPos = new Point(100, 100)
    const groups = ladder.createGroups(startPos, [1, 1, 1]) // three single contact groups
    expect(groups[0].getHeading()).toEqual(91)
    expect(groups[1].getHeading()).toEqual(91)
    expect(groups[2].getHeading()).toEqual(91)
    expect(groups[0].getStartPos()).toEqual(new Point(140, 100))
    expect(groups[1].getStartPos()).toEqual(new Point(180, 100))
    expect(groups[2].getStartPos()).toEqual(new Point(220, 100))
  })

  it("creates_groups_hardMode", () => {
    jest
      .spyOn(PSMath, "randomHeading")
      .mockReturnValueOnce(90)
      .mockReturnValueOnce(120)
      .mockReturnValueOnce(80)
      .mockReturnValueOnce(135)
      .mockReturnValueOnce(15)
      .mockReturnValueOnce(150)
    jest.spyOn(PSMath, "randomNumber").mockReturnValue(1)

    const updatedProps: PictureCanvasProps = { ...testProps, isHardMode: true }
    ladder.initialize(updatedProps, testState)
    ladder.numGroupsToCreate = 3
    ladder.seps = [40, 40, 40]
    const startPos = new Point(100, 100)
    const groups = ladder.createGroups(startPos, [1, 1, 1]) // three single contact groups
    expect(groups[0].getHeading()).toEqual(121)
    expect(groups[1].getHeading()).toEqual(81)
    expect(groups[2].getHeading()).toEqual(136)
    expect(groups[0].getStartPos()).toEqual(new Point(140, 100))
    expect(groups[1].getStartPos()).toEqual(new Point(180, 100))
    expect(groups[2].getStartPos()).toEqual(new Point(220, 100))
  })

  it("creates_groups_NS", () => {
    jest.spyOn(PSMath, "randomHeading").mockReturnValue(90)
    jest.spyOn(PSMath, "randomNumber").mockReturnValue(1)

    const updatedProps: PictureCanvasProps = { ...testProps }
    updatedProps.orientation.orient = BlueInThe.NORTH

    ladder.initialize(updatedProps, testState)
    ladder.numGroupsToCreate = 3
    ladder.seps = [40, 40, 40]
    const startPos = new Point(100, 100)
    const groups = ladder.createGroups(startPos, [1, 1, 1]) // three single contact groups
    expect(groups[0].getHeading()).toEqual(91)
    expect(groups[1].getHeading()).toEqual(91)
    expect(groups[2].getHeading()).toEqual(91)
    expect(groups[0].getStartPos()).toEqual(new Point(100, 140))
    expect(groups[1].getStartPos()).toEqual(new Point(100, 180))
    expect(groups[2].getStartPos()).toEqual(new Point(100, 220))
  })

  // Issue #7 -- write echelon tests for TDD
})
