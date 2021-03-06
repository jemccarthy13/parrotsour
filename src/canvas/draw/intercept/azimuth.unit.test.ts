import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { AircraftGroup, GroupParams } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { BlueInThe, PictureCanvasState } from "../../canvastypes"
import DrawAzimuth from "./azimuth"
import { testProps } from "./mockutils.unit.test"

import * as PSMath from "../../../utils/psmath"
import TestCanvas from "../../../testutils/testcanvas"
import { PaintBrush } from "../paintbrush"

let testState: PictureCanvasState
let p: Partial<GroupParams>
let azimuth: DrawAzimuth

beforeAll(() => {
  TestCanvas.useContext(800, 500)

  testState = {
    bullseye: new Point(400, 400),
    blueAir: new AircraftGroup({ sx: 600, sy: 400, hdg: 270, nContacts: 4 }),
    answer: { pic: "2 grps az", groups: [] },
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

  azimuth = new DrawAzimuth()
  azimuth.initialize(testProps, testState)
})

beforeEach(() => {
  PaintBrush.clearCanvas()
})

/**
 * Test the azimuth picture drawer
 */
describe("DrawAzimuth", () => {
  it("hot_azimuth", () => {
    const ng = new AircraftGroup(p)
    const sg = new AircraftGroup({ ...p, sy: 250, alts: [15, 15, 15, 15] })

    azimuth.groups = [ng, sg]
    azimuth.drawInfo()

    expect(sg.getAltitudes()).toEqual([15, 15, 15, 15])

    expect(azimuth.getAnswer()).toEqual(
      "TWO GROUPS AZIMUTH 12 " +
        "SOUTH GROUP BULLSEYE 308/55, 15k HOSTILE HEAVY 4 CONTACTS " +
        "NORTH GROUP BULLSEYE 317/64, 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("different_track_dirs_echelon", () => {
    const ng = new AircraftGroup(p)
    const sg = new AircraftGroup({
      ...p,
      sy: 250,
      hdg: 180,
      alts: [15, 15, 15, 15],
    })

    azimuth.groups = [ng, sg]
    azimuth.drawInfo()
    expect(azimuth.getAnswer()).toEqual(
      "TWO GROUPS AZIMUTH 7 OPENING ECHELON SOUTHWEST, " +
        "NORTH GROUP BULLSEYE 312/58, 20k TRACK EAST HOSTILE HEAVY 4 CONTACTS " +
        "SOUTH GROUP 15k TRACK SOUTH HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("different_track_dirs", () => {
    const ng = new AircraftGroup(p)
    const sg = new AircraftGroup({
      ...p,
      sx: 250,
      sy: 300,
      hdg: 180,
      alts: [15, 15, 15, 15],
    })

    azimuth.groups = [ng, sg]
    azimuth.drawInfo()
    expect(azimuth.getAnswer()).toEqual(
      "TWO GROUPS AZIMUTH 12 " +
        "SOUTH GROUP BULLSEYE 295/44, 15k TRACK SOUTH HOSTILE HEAVY 4 CONTACTS " +
        "NORTH GROUP BULLSEYE 305/53, 20k TRACK EAST HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("labels_EW", () => {
    const updatedProps = testProps
    updatedProps.orientation.orient = BlueInThe.NORTH

    azimuth.initialize(updatedProps, testState)

    const ng = new AircraftGroup({ ...p, sx: 200, sy: 200, hdg: 1 })
    const sg = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 200,
      hdg: 1,
      alts: [15, 15, 15, 15],
    })

    azimuth.groups = [ng, sg]
    azimuth.drawInfo()
    expect(azimuth.getAnswer()).toEqual(
      "TWO GROUPS AZIMUTH 12 TRACK NORTH. " +
        "WEST GROUP BULLSEYE 320/73, 20k HOSTILE HEAVY 4 CONTACTS " +
        "EAST GROUP BULLSEYE 313/81, 15k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("EW_anchor_pris", () => {
    const updatedProps = testProps
    updatedProps.orientation.orient = BlueInThe.NORTH

    const updatedState = testState
    updatedState.blueAir = new AircraftGroup({
      sx: 400,
      sy: 50,
      hdg: 270,
      nContacts: 4,
    })
    azimuth.initialize(updatedProps, testState)

    const ng = new AircraftGroup({ ...p, sx: 200, sy: 180, hdg: 1 })
    const sg = new AircraftGroup({
      ...p,
      sx: 250,
      sy: 180,
      hdg: 1,
      alts: [15, 15, 15, 15],
    })

    azimuth.groups = [ng, sg]
    azimuth.drawInfo()
    expect(azimuth.getAnswer()).toEqual(
      "TWO GROUPS AZIMUTH 12 TRACK NORTH. " +
        "EAST GROUP BULLSEYE 331/70, 15k HOSTILE HEAVY 4 CONTACTS " +
        "WEST GROUP BULLSEYE 322/77, 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("includes_stacks", () => {
    azimuth.initialize(testProps, testState)

    const ng = new AircraftGroup({
      ...p,
      sx: 200,
      sy: 200,
      hdg: 1,
      nContacts: 3,
      alts: [45, 35, 25],
    })
    const sg = new AircraftGroup({
      ...p,
      sx: 250,
      sy: 200,
      hdg: 1,
      nContacts: 2,
      alts: [36, 24],
    })

    azimuth.groups = [ng, sg]
    azimuth.drawInfo()
    expect(azimuth.getAnswer()).toEqual(
      "TWO GROUPS AZIMUTH 11 TRACK NORTH. " +
        "EAST GROUP BULLSEYE 327/66, STACK 36k AND 24k HOSTILE 2 CONTACTS " +
        "WEST GROUP BULLSEYE 319/73, STACK 45k 35k AND 25k HOSTILE HEAVY 3 CONTACTS"
    )
  })

  it("includes_stacks", () => {
    azimuth.initialize(testProps, testState)

    const ng = new AircraftGroup({
      ...p,
      sx: 200,
      sy: 200,
      hdg: 1,
      nContacts: 4,
      alts: [46, 45, 35, 25],
    })
    const sg = new AircraftGroup({
      ...p,
      sx: 250,
      sy: 200,
      hdg: 1,
      nContacts: 1,
      alts: [36],
    })

    azimuth.groups = [ng, sg]
    azimuth.drawInfo()
    expect(azimuth.getAnswer()).toEqual(
      "TWO GROUPS AZIMUTH 9 TRACK NORTH. " +
        "EAST GROUP BULLSEYE 326/67, 36k HOSTILE " +
        "WEST GROUP STACK 46k 35k AND 25k HOSTILE HEAVY 4 CONTACTS 2 HIGH 1 MEDIUM 1 LOW"
    )
  })

  it("simple_functions", () => {
    expect(azimuth.formatWeighted()).toEqual("")
    azimuth.chooseNumGroups()
    expect(azimuth.numGroupsToCreate).toEqual(2)

    jest.spyOn(PSMath, "randomNumber").mockReturnValue(10)
    const pInfo = azimuth.getPictureInfo()
    expect(pInfo.deep).toEqual(7 * PSMath.PIXELS_TO_NM)
    expect(pInfo.wide).toEqual(10 * PSMath.PIXELS_TO_NM)

    const az = azimuth.create()
    expect(az.groups.length).toEqual(0)
    expect(az.dimensions.deep).toEqual(0)
    expect(az.dimensions.wide).toEqual(0)
  })

  it("creates_groups_ns", () => {
    const updatedProps = { ...testProps }
    updatedProps.orientation.orient = BlueInThe.NORTH
    const startPos = new Point(100, 100)
    azimuth.dimensions.wide = 40
    const groups = azimuth.createGroups(startPos, [1, 1])

    expect(groups[0].getStartPos()).toEqual(new Point(100, 100))
    expect(groups[1].getStartPos()).toEqual(new Point(140, 100))
  })
})
