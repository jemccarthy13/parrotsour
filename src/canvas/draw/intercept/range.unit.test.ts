import { vi, describe, it, expect, beforeAll, beforeEach } from "vitest"
import { BlueAir } from "../../../classes/aircraft/blueair"
import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { Bullseye } from "../../../classes/bullseye/bullseye"
import { AircraftGroup, GroupParams } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import TestCanvas from "../../../testutils/testcanvas"
import * as PSMath from "../../../utils/math"
import {
  BlueInThe,
  PictureCanvasProps,
  PictureCanvasState,
} from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import { testProps } from "./mockutils.unit.test"
import DrawRange from "./range"

let testState: PictureCanvasState
let p: Partial<GroupParams>
let range: DrawRange

beforeAll(() => {
  TestCanvas.useContext(800, 500)

  BlueAir.set(new AircraftGroup({ sx: 400, sy: 200, hdg: 270, nContacts: 4 }))
})

beforeEach(() => {
  Bullseye.generate(new Point(300, 300))
  PaintBrush.clearCanvas()

  testState = {
    answer: { pic: "2 grps az", groups: [] },
    reDraw: vi.fn(),
  }

  p = {
    dataTrailType: SensorType.ARROW,
    sx: 200,
    sy: 200,
    nContacts: 4,
    hdg: 90,
    alts: [20, 20, 20, 20],
  }

  range = new DrawRange()
  range.initialize(testProps, testState)
})

describe("DrawRange", () => {
  it("hot_ns_range", () => {
    const ng = new AircraftGroup({ ...p })
    const sg = new AircraftGroup({ ...p, sx: 250, alts: [15, 15, 15, 15] })

    range.groups = [ng, sg]
    range.drawInfo()

    expect(sg.getAltitudes()).toEqual([15, 15, 15, 15])

    expect(range.getAnswer()).toEqual(
      "TWO GROUPS RANGE 12, " +
        "LEAD GROUP BULLSEYE 344/22, 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("ew_range", () => {
    const updatedProps = { ...testProps }

    updatedProps.orientation.orient = BlueInThe.NORTH
    range.initialize(updatedProps, testState)
    const ng = new AircraftGroup({ ...p })
    const sg = new AircraftGroup({ ...p, sy: 250, alts: [15, 15, 15, 15] })

    range.groups = [ng, sg]
    range.drawInfo()

    expect(sg.getAltitudes()).toEqual([15, 15, 15, 15])

    expect(range.getAnswer()).toEqual(
      "TWO GROUPS RANGE 12, " +
        "LEAD GROUP BULLSEYE 319/29, 20k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 15k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("echelon_range", () => {
    const updatedProps = { ...testProps }

    updatedProps.orientation.orient = BlueInThe.NORTH
    range.initialize(updatedProps, testState)
    const ng = new AircraftGroup({ ...p })
    const sg = new AircraftGroup({
      ...p,
      sx: 225,
      sy: 250,
      alts: [15, 15, 15, 15],
    })

    range.groups = [ng, sg]
    range.drawInfo()

    expect(sg.getAltitudes()).toEqual([15, 15, 15, 15])

    expect(range.getAnswer()).toEqual(
      "TWO GROUPS RANGE 12, ECHELON SOUTHEAST, TRACK EAST. " +
        "LEAD GROUP BULLSEYE 307/15, 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("echelon_range", () => {
    const updatedProps = { ...testProps }

    updatedProps.orientation.orient = BlueInThe.EAST
    range.initialize(updatedProps, testState)
    const ng = new AircraftGroup({ ...p })
    const sg = new AircraftGroup({
      ...p,
      sx: 225,
      sy: 250,
      alts: [15, 15, 15, 15],
    })

    range.groups = [ng, sg]
    range.drawInfo()

    expect(sg.getAltitudes()).toEqual([15, 15, 15, 15])

    expect(range.getAnswer()).toEqual(
      "TWO GROUPS RANGE 6, ECHELON NORTHWEST, TRACK EAST. " +
        "LEAD GROUP BULLSEYE 307/15, 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("simple_functions", () => {
    expect(range.formatWeighted()).toEqual("")
    range.chooseNumGroups()
    expect(range.numGroupsToCreate).toEqual(2)

    vi.spyOn(PSMath, "randomNumber").mockReturnValue(10)
    const pInfo = range.getPictureInfo()

    expect(pInfo.deep).toEqual(10)
    expect(pInfo.wide).toEqual(-1)

    const rng = range.create()

    expect(rng.groups.length).toEqual(0)
    expect(rng.dimensions.deep).toEqual(0)
    expect(rng.dimensions.wide).toEqual(0)
  })

  it("creates_groups_ns", () => {
    const updatedProps = { ...testProps }

    updatedProps.orientation.orient = BlueInThe.NORTH
    range.initialize(updatedProps, testState)
    const startPos = new Point(100, 100)

    range.dimensions.deep = 40
    const groups = range.createGroups(startPos, [1, 1])

    expect(groups[0].getStartPos()).toEqual(new Point(100, 100))
    expect(groups[1].getStartPos()).toEqual(new Point(100, 140))
  })

  it("creates_groups_ns_hardMode", () => {
    vi.spyOn(PSMath, "randomHeading").mockImplementation(() => -100)

    const updatedProps: PictureCanvasProps = { ...testProps, isHardMode: true }

    updatedProps.orientation.orient = BlueInThe.NORTH
    range.initialize(updatedProps, testState)
    const startPos = new Point(100, 100)

    range.dimensions.deep = 40
    const groups = range.createGroups(startPos, [1, 1])

    expect(groups[0].getStartPos()).toEqual(new Point(100, 100))
    expect(groups[1].getStartPos()).toEqual(new Point(100, 140))
    expect(groups[1].getHeading()).toEqual(-100)
  })

  it("creates_groups_ew", () => {
    const updatedProps = { ...testProps }

    updatedProps.orientation.orient = BlueInThe.EAST
    range.initialize(updatedProps, testState)
    const startPos = new Point(100, 100)

    range.dimensions.deep = 40
    const groups = range.createGroups(startPos, [1, 1])

    expect(groups[0].getStartPos()).toEqual(new Point(100, 100))
    expect(groups[1].getStartPos()).toEqual(new Point(140, 100))
  })
})
