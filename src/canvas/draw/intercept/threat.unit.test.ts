import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { PIXELS_TO_NM } from "../../../utils/psmath"
import { BlueInThe, PictureCanvasState } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import { testProps } from "./mockutils.unit.test"
import { PictureInfo } from "./pictureclamp"

import DrawThreat from "./threat"

import TestCanvas from "../../../testutils/testcanvas"

describe("DrawThreat", () => {
  let dThreat: DrawThreat

  TestCanvas.useContext(800, 500)

  let testState: PictureCanvasState = {
    bullseye: new Point(400, 400),
    blueAir: new AircraftGroup({ sx: 600, sy: 200, hdg: 270, nContacts: 4 }),
    answer: { pic: "3 grp ladder", groups: [] },
    reDraw: jest.fn(),
  }

  beforeEach(() => {
    jest.restoreAllMocks()

    PaintBrush.clearCanvas()

    dThreat = new DrawThreat()

    testState = {
      bullseye: new Point(400, 400),
      blueAir: new AircraftGroup({ sx: 600, sy: 200, hdg: 270, nContacts: 4 }),
      answer: { pic: "3 grp ladder", groups: [] },
      reDraw: jest.fn(),
    }

    dThreat.initialize(testProps, testState)
  })

  it("drawinfo_threat", () => {
    expect(true).toEqual(true)

    const p = {
      dataTrailType: SensorType.ARROW,
      sx: 500,
      sy: 200,
      nContacts: 1,
      hdg: 90,
      alts: [20],
    }
    dThreat.groups = [new AircraftGroup({ ...p })]

    dThreat.drawInfo()

    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })

  it("hot_threat_answer", () => {
    expect(true).toEqual(true)

    const p = {
      dataTrailType: SensorType.ARROW,
      sx: 500,
      sy: 200,
      nContacts: 1,
      hdg: 90,
      alts: [20],
    }
    dThreat.groups = [new AircraftGroup({ ...p })]

    dThreat.drawInfo()
    expect(dThreat.getAnswer()).toEqual(
      "[FTR C/S], THREAT GROUP BRAA " + "257/13 20k HOT HOSTILE"
    )
  })

  it("flank_threat_answer", () => {
    expect(true).toEqual(true)

    const p = {
      dataTrailType: SensorType.ARROW,
      sx: 500,
      sy: 200,
      nContacts: 1,
      hdg: 110,
      alts: [20],
    }
    dThreat.groups = [new AircraftGroup({ ...p })]

    dThreat.drawInfo()
    expect(dThreat.getAnswer()).toEqual(
      "[FTR C/S], THREAT GROUP BRAA " + "250/14 20k FLANK SOUTHEAST HOSTILE"
    )
  })

  it("beam_n_threat_answer", () => {
    expect(true).toEqual(true)

    const p = {
      dataTrailType: SensorType.ARROW,
      sx: 500,
      sy: 200,
      nContacts: 1,
      hdg: 10,
      alts: [20],
    }
    dThreat.groups = [new AircraftGroup({ ...p })]

    dThreat.drawInfo()
    expect(dThreat.getAnswer()).toEqual(
      "[FTR C/S], THREAT GROUP BRAA " + "279/18 20k BEAM NORTH HOSTILE"
    )
  })

  it("beam_s_threat_answer", () => {
    expect(true).toEqual(true)

    const p = {
      dataTrailType: SensorType.ARROW,
      sx: 500,
      sy: 200,
      nContacts: 1,
      hdg: 170,
      alts: [20],
    }
    dThreat.groups = [new AircraftGroup({ ...p })]

    dThreat.drawInfo()
    expect(dThreat.getAnswer()).toEqual(
      "[FTR C/S], THREAT GROUP BRAA " + "244/20 20k BEAM SOUTH HOSTILE"
    )
  })

  it("drag_threat_answer", () => {
    expect(true).toEqual(true)

    const p = {
      dataTrailType: SensorType.ARROW,
      sx: 500,
      sy: 200,
      nContacts: 1,
      hdg: 270,
      alts: [20],
    }
    dThreat.groups = [new AircraftGroup({ ...p })]

    dThreat.drawInfo()
    expect(dThreat.getAnswer()).toEqual(
      "[FTR C/S], THREAT GROUP BRAA " + "263/25 20k DRAG WEST HOSTILE"
    )
  })

  it("tests_benign_functions", () => {
    expect(dThreat.formatWeighted()).toEqual("")
    expect(dThreat.formatDimensions()).toEqual("")

    dThreat.create()
    dThreat.groups = dThreat.createGroups(new Point(100, 100), [1])
    expect(dThreat.getNumGroups()).toEqual(1)
    expect(dThreat.groups.length).toEqual(1)

    expect(dThreat.numGroupsToCreate).toEqual(0)
    dThreat.chooseNumGroups()
    expect(dThreat.numGroupsToCreate).toEqual(1)
  })

  it("tests_getPictureInfo_with_start", () => {
    const startPt = new Point(100, 100)
    const pInfo: PictureInfo = dThreat.getPictureInfo(startPt)
    expect(pInfo.start).toEqual(startPt)
    expect(pInfo.deep).toEqual(5 * PIXELS_TO_NM)
    expect(pInfo.wide).toEqual(5 * PIXELS_TO_NM)
  })

  it("tests_getPictureInfo_random_start", () => {
    const pInfo: PictureInfo = dThreat.getPictureInfo()

    const bPos = testState.blueAir.getCenterOfMass(testProps.dataStyle)

    const start = pInfo.start

    expect(start).toBeDefined()
    if (start) {
      const startBraa = bPos.getBR(start)
      expect(startBraa.range).toBeLessThanOrEqual(35)
    }
  })

  it("tests_getPictureInfo_random_start_NS", () => {
    const newProps = { ...testProps }
    newProps.orientation.orient = BlueInThe.NORTH
    dThreat.initialize(newProps, testState)

    const pInfo: PictureInfo = dThreat.getPictureInfo()
    const bPos = testState.blueAir.getCenterOfMass(testProps.dataStyle)
    const start = pInfo.start

    expect(start).toBeDefined()
    if (start) {
      const startBraa = bPos.getBR(start)
      expect(startBraa.range).toBeLessThanOrEqual(40)
    }
  })
})
