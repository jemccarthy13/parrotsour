import {
  vi,
  it,
  expect,
  describe,
  beforeEach,
  afterAll,
  afterEach,
} from "vitest"
import { BlueAir } from "../../../classes/aircraft/blueair"
import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { BRAA } from "../../../classes/braa"
import { Braaseye } from "../../../classes/braaseye"
import { Bullseye } from "../../../classes/bullseye/bullseye"
import { AircraftGroup, GroupParams } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import TestCanvas from "../../../testutils/testcanvas"
import * as PSMath from "../../../utils/math"
import { PictureCanvasState } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import DrawEA from "./ea"
import { testProps } from "./mockutils.unit.test"
import { PictureFactory } from "./picturefactory"

describe("DrawEA", () => {
  let testState: PictureCanvasState
  let p: Partial<GroupParams>
  let draw: DrawEA

  TestCanvas.useContext(800, 500)

  beforeEach(() => {
    const startX = 200
    const startY = 200

    p = {
      dataTrailType: SensorType.ARROW,
      sx: startX,
      sy: startY,
      nContacts: 4,
      hdg: 90,
      alts: [20, 20, 20, 20],
    }

    Bullseye.generate(new Point(400, 400))

    testState = {
      answer: { pic: "2 grps az", groups: [] },
      reDraw: vi.fn(),
    }
    BlueAir.set(new AircraftGroup({ sx: 600, sy: 400, hdg: 270, nContacts: 4 }))

    draw = PictureFactory.getPictureDraw("ea") as DrawEA
    draw.initialize(testProps, testState)
    draw.chooseNumGroups(1)
    draw.createGroups(new Point(startX, startY), [1])

    const sg = new AircraftGroup(p)

    draw.eaPic.groups = [sg]
    draw.groups = [sg]
    draw.drawInfo()
  })

  afterEach(() => {
    PaintBrush.clearCanvas()
    vi.restoreAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
    vi.restoreAllMocks()
  })

  it("draws_request_0", () => {
    PaintBrush.clearCanvas()
    vi.spyOn(PSMath, "randomNumber").mockReturnValue(0)
    draw.drawInfo() // first time request type = 0
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })

  it("draws_request_1", () => {
    PaintBrush.clearCanvas()
    vi.spyOn(PSMath, "randomNumber")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1)
    draw.drawInfo() // 2nd time request type = 1
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })

  it("draws_request_2", () => {
    PaintBrush.clearCanvas()
    vi.spyOn(PSMath, "randomNumber")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(2)
    draw.drawInfo() // 3d time request type = 2
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })

  it("getsPicInfo", () => {
    const initPt = new Point(100, 100)
    const pInfo = draw.getPictureInfo(initPt)

    expect(pInfo.start).toEqual(initPt)
    expect(pInfo.deep).toEqual(-1) // draw.eaInfo isn't set
    expect(pInfo.wide).toEqual(-1)
  })

  it("music_singlegroup_singlecontact", () => {
    const sg = new AircraftGroup({ ...p, hdg: 5, alts: [10], nContacts: 1 })

    Bullseye.generate(new Point(100, 50))
    sg.setBraaseye(new Braaseye(new Point(50, 50), new Point(50, 50)))
    sg.setLabel("SINGLE GROUP")
    draw.groups = [sg]
    draw.eaInfo = {
      grp: sg,
      strBR: new BRAA(100, 10),
      query: "hi",
    }
    draw.requestType = 0
    expect(draw.getAnswer()).toEqual(
      "SINGLE GROUP BULLSEYE 270/12, 10k TRACK NORTH HOSTILE"
    )
  })

  it("bogey_dope_hot", () => {
    draw.getPictureInfo()
    draw.requestType = 1
    draw.getAnswer()
    expect(draw.getAnswer()).toEqual(
      "GROUP BRAA 297/98 20k, HOT HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("bogey_dope_oth_aspect", () => {
    const sg = new AircraftGroup({ ...p, hdg: 150 })

    draw.groups = [sg]
    draw.getPictureInfo()
    draw.requestType = 1
    draw.getAnswer()
    expect(draw.getAnswer()).toEqual(
      "GROUP BRAA 289/99 20k, FLANK SOUTHEAST HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("music_singlegroup_multicontact", () => {
    const sg = new AircraftGroup({ ...p, hdg: 5, alts: [10, 15], nContacts: 2 })

    Bullseye.generate(new Point(100, 50))
    sg.setBraaseye(new Braaseye(new Point(50, 50), new Point(50, 50)))
    sg.setLabel("SINGLE GROUP")
    draw.groups = [sg]
    draw.eaInfo = {
      grp: sg,
      strBR: new BRAA(100, 10),
      query: "hi",
    }
    draw.requestType = 0
    expect(draw.getAnswer()).toEqual(
      "SINGLE GROUP BULLSEYE 270/12, 15k TRACK NORTH " +
        "HOSTILE 2 CONTACTS LINE ABREAST 3"
    )
  })

  it("bogey_dope_hot", () => {
    draw.getPictureInfo()
    draw.requestType = 1
    draw.getAnswer()
    expect(draw.getAnswer()).toEqual(
      "GROUP BRAA 297/98 20k, HOT HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("bogey_dope_oth_aspect", () => {
    const sg = new AircraftGroup({ ...p, hdg: 150 })

    draw.groups = [sg]
    draw.getPictureInfo()
    draw.requestType = 1
    expect(draw.getAnswer()).toEqual(
      "GROUP BRAA 289/99 20k, FLANK SOUTHEAST HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("bogey_dope_multi_group", () => {
    const ng = new AircraftGroup({ ...p, hdg: 150, sx: 50, sy: 400 })
    const sg = new AircraftGroup({
      ...p,
      hdg: 90,
      sx: 400,
      sy: 400,
      nContacts: 1,
      alts: [5],
    })

    ng.setLabel("EAST GROUP")
    sg.setLabel("WEST GROUP")
    draw.groups = [ng, sg]
    draw.getPictureInfo()
    draw.requestType = 1
    expect(draw.getAnswer()).toEqual("WEST GROUP BRAA 265/38 05k, HOT HOSTILE")
    draw.groups = [sg, ng]
    expect(draw.getAnswer()).toEqual("WEST GROUP BRAA 265/38 05k, HOT HOSTILE")
  })

  it("has_drawpic_functions", () => {
    expect(draw.formatPicTitle()).toEqual("")
    expect(draw.formatDimensions()).toEqual("")
    expect(draw.formatWeighted()).toEqual("")

    const warn = vi.spyOn(console, "warn").mockImplementation(vi.fn())

    draw.applyLabels()
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it("selects_strobe_query", () => {
    const sg = new AircraftGroup({ ...p, hdg: 150 })

    draw.groups = [sg]
    vi.spyOn(PSMath, "randomNumber")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(7)
      .mockReturnValueOnce(1)
    draw.drawInfo()
    expect(draw.eaInfo.query).toEqual(sg.getLabel())

    vi.spyOn(PSMath, "randomNumber")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(65)
      .mockReturnValueOnce(1)
    draw.drawInfo()
    expect(draw.eaInfo.query).toEqual("289")
  })

  it("formats_strobe_not_hot", () => {
    const sg = new AircraftGroup({
      ...p,
      sx: 100,
      sy: 400,
      hdg: 150,
      alts: [10],
      nContacts: 1,
    })

    sg.setLabel("STROBE GROUP")
    draw.groups = [sg]
    draw.eaInfo.grp = sg
    draw.drawInfo()
    draw.requestType = 2

    expect(draw.eaInfo.strBR.range).toEqual(116)
    expect(draw.getAnswer()).toEqual(
      "EAGLE01 STROBE RANGE 116, 10k BEAM SOUTHEAST, HOSTILE, STROBE GROUP"
    )
  })

  it("formats_strobe_hot", () => {
    const sg = new AircraftGroup({
      ...p,
      sx: 100,
      sy: 400,
      hdg: 90,
      alts: [10],
      nContacts: 1,
    })

    sg.setLabel("STROBE GROUP")
    draw.groups = [sg]
    draw.eaInfo.grp = sg
    draw.drawInfo()
    draw.requestType = 2

    expect(draw.eaInfo.strBR.range).toEqual(113)
    expect(draw.getAnswer()).toEqual(
      "EAGLE01 STROBE RANGE 113, 10k HOT, HOSTILE, STROBE GROUP"
    )
  })
})
