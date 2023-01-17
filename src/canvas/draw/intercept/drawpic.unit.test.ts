import { AircraftGroup } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { snackActions } from "../../../components/alert/psalert"
import TestCanvas from "../../../testutils/testcanvas"
import { PictureCanvasState } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import DrawAzimuth from "./azimuth"
import { testProps } from "./mockutils.unit.test"

jest.mock("../../../components/alert/psalert", () => ({
  snackActions: {
    success: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    toast: jest.fn(),
  },
}))

describe("DrawPic", () => {
  const draw = new DrawAzimuth()

  const testState: PictureCanvasState = {
    bullseye: new Point(100, 100),
    blueAir: new AircraftGroup({ sx: 400, sy: 400, nContacts: 1 }),
    answer: { pic: "", groups: [] },
    reDraw: jest.fn(),
  }

  beforeAll(() => {
    TestCanvas.useContext(800, 500)
  })

  afterEach(() => {
    PaintBrush.clearCanvas()
  })

  it("simple_functions", () => {
    expect(draw.getNumGroups()).toEqual(0)
    jest.mock("../../../classes/groups/group")
    draw.groups = [new AircraftGroup()]
    expect(draw.getNumGroups()).toEqual(1)
    jest.restoreAllMocks()
  })

  it("assigns_contacts_too_few_contacts", () => {
    const snackSpy = jest
      .spyOn(snackActions, "warning")
      .mockImplementation(jest.fn())

    const nCts = draw.assignContacts(2, 1)

    expect(snackSpy).toHaveBeenCalledTimes(1)
    expect(nCts.length).toEqual(2)
    expect(nCts[0]).toEqual(1) // 1 from assign contacts
    expect(nCts[1]).toEqual(0) // 0 for random (none leftover after init assign)
  })

  it("assigns_contacts_all", () => {
    const nCts = draw.assignContacts(1, 3)

    expect(nCts.length).toEqual(1)
    expect(nCts[0]).toEqual(3)
  })

  it("assigns_contacts_random", () => {
    const nCts = draw.assignContacts(1, 0)

    expect(nCts.length).toEqual(1)
    expect(nCts[0]).toEqual(0)
  })

  it("anchors_closest_to_ftrs", () => {
    draw.initialize(testProps, testState)
    const grp1 = new AircraftGroup({ sx: 300, sy: 400 })
    const grp2 = new AircraftGroup({ sx: 200, sy: 400 })

    draw.groups = [grp1, grp2]
    draw.drawInfo()
    draw.checkAnchor(grp1, grp2)
    expect(grp1.isAnchor()).toEqual(true)
    expect(grp2.isAnchor()).toEqual(false)
    expect(grp1.getUseBull()).toEqual(true)
    expect(grp2.getUseBull()).toEqual(false)

    draw.checkAnchor(grp2, grp1)
    expect(grp1.isAnchor()).toEqual(true)
    expect(grp2.isAnchor()).toEqual(false)
    expect(grp1.getUseBull()).toEqual(true)
    expect(grp2.getUseBull()).toEqual(false)
  })

  it("anchors_highest", () => {
    draw.initialize(testProps, testState)
    const grp1 = new AircraftGroup({
      sx: 300,
      sy: 400,
      alts: [10],
      nContacts: 1,
    })
    const grp2 = new AircraftGroup({
      sx: 300,
      sy: 400,
      alts: [20],
      nContacts: 1,
    })

    draw.groups = [grp1, grp2]
    draw.drawInfo()
    draw.checkAnchor(grp1, grp2)
    expect(grp2.isAnchor()).toEqual(true)
    expect(grp1.isAnchor()).toEqual(false)
    expect(grp2.getUseBull()).toEqual(true)
    expect(grp1.getUseBull()).toEqual(false)

    const grp3 = new AircraftGroup({
      sx: 300,
      sy: 400,
      alts: [20],
      nContacts: 1,
    })
    const grp4 = new AircraftGroup({
      sx: 300,
      sy: 400,
      alts: [19],
      nContacts: 1,
    })

    draw.groups = [grp3, grp4]
    draw.drawInfo()
    draw.checkAnchor(grp3, grp4)
    expect(grp3.isAnchor()).toEqual(true)
    expect(grp4.isAnchor()).toEqual(false)
    expect(grp3.getUseBull()).toEqual(true)
    expect(grp4.getUseBull()).toEqual(false)
  })

  it("anchors_heaviest", () => {
    draw.initialize(testProps, testState)
    const grp1 = new AircraftGroup({
      sx: 300,
      sy: 400,
      alts: [20],
      nContacts: 1,
    })
    const grp2 = new AircraftGroup({
      sx: 300,
      sy: 400,
      alts: [20, 20, 20],
      nContacts: 3,
    })

    draw.groups = [grp1, grp2]
    draw.drawInfo()
    draw.checkAnchor(grp1, grp2)

    expect(grp2.isAnchor()).toEqual(true)
    expect(grp1.isAnchor()).toEqual(false)
    expect(grp2.getUseBull()).toEqual(true)
    expect(grp1.getUseBull()).toEqual(false)

    draw.checkAnchor(grp2, grp1)

    expect(grp2.isAnchor()).toEqual(true)
    expect(grp1.isAnchor()).toEqual(false)
    expect(grp2.getUseBull()).toEqual(true)
    expect(grp1.getUseBull()).toEqual(false)
  })
})
