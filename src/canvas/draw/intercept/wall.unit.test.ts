import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { AircraftGroup, GroupParams } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import TestCanvas from "../../../testutils/testcanvas"
import { BlueInThe, PictureCanvasState } from "../../canvastypes"
import { testProps } from "./mockutils.unit.test"
import DrawWall from "./wall"
import * as PSMath from "../../../utils/psmath"
import { PaintBrush } from "../paintbrush"

let testState: PictureCanvasState
let p: Partial<GroupParams>
let wall: DrawWall

describe("DrawWall", () => {
  TestCanvas.useContext(800, 500)

  beforeEach(() => {
    PaintBrush.clearCanvas()
  })

  function setBlueInTheNorth() {
    const updatedProps = { ...testProps }
    updatedProps.orientation.orient = BlueInThe.NORTH
    const updatedState = {
      ...testState,
      blueAir: new AircraftGroup({ sx: 200, sy: 50, hdg: 180, nContacts: 4 }),
    }
    wall.initialize(updatedProps, updatedState)
  }

  beforeEach(() => {
    testState = {
      bullseye: new Point(400, 400),
      blueAir: new AircraftGroup({
        sx: 600,
        sy: 400,
        hdg: 270,
        nContacts: 4,
      }),
      answer: { pic: "3 grp ladder", groups: [] },
      reDraw: jest.fn(),
    }

    p = {
      dataTrailType: SensorType.ARROW,
      sx: 200,
      sy: 100,
      nContacts: 4,
      hdg: 90,
      alts: [20, 20, 20, 20],
    }

    testProps.orientation.orient = BlueInThe.EAST
    wall = new DrawWall()
    wall.initialize(testProps, testState)

    jest.restoreAllMocks()
  })

  it("simple_functions", () => {
    const created = new DrawWall().create()
    expect(created.formatPicTitle()).toEqual("0 GROUP WALL")
  })

  it("chooses_num_groups_for_n_contacts", () => {
    wall.chooseNumGroups(1)
    expect(wall.numGroupsToCreate).toEqual(3)
    wall.chooseNumGroups(2)
    expect(wall.numGroupsToCreate).toEqual(3)
    wall.chooseNumGroups(3)
    expect(wall.numGroupsToCreate).toEqual(3)
    jest
      .spyOn(PSMath, "randomNumber")
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(5)
    wall.chooseNumGroups(4)
    expect(wall.numGroupsToCreate).toEqual(4)
    wall.chooseNumGroups(5)
    expect(wall.numGroupsToCreate).toEqual(5)
    wall.chooseNumGroups(6)
    expect(wall.numGroupsToCreate).toEqual(3)
    wall.chooseNumGroups(0)
    expect(wall.numGroupsToCreate).toEqual(5)
  })

  it("gets_pic_dimensions", () => {
    jest.spyOn(PSMath, "randomNumber").mockReturnValue(10 * PSMath.PIXELS_TO_NM)
    wall.numGroupsToCreate = 3
    const startPt = new Point(100, 100)
    const pInfo = wall.getPictureInfo(startPt)
    expect(pInfo.wide).toEqual(2 * 10 * PSMath.PIXELS_TO_NM)
    expect(pInfo.deep).toEqual(20 * PSMath.PIXELS_TO_NM)
    expect(pInfo.start).toEqual(startPt)
  })

  it("creates_groups", () => {
    jest.spyOn(PSMath, "randomHeading").mockReturnValue(90)
    jest.spyOn(PSMath, "randomNumber").mockReturnValue(0)
    wall.seps = [0, 20 * PSMath.PIXELS_TO_NM, 20 * PSMath.PIXELS_TO_NM]
    wall.numGroupsToCreate = 3
    const startPt = new Point(100, 100)
    const grps = wall.createGroups(startPt, [1, 2, 3])
    expect(grps[0].getStartPos()).toEqual(startPt)
    expect(grps[0].getHeading()).toEqual(90)
    expect(grps[0].getStrength()).toEqual(1)
    expect(grps[1].getStartPos()).toEqual(new Point(100, 180))
    expect(grps[1].getHeading()).toEqual(90)
    expect(grps[1].getStrength()).toEqual(2)
    expect(grps[2].getStartPos()).toEqual(new Point(100, 260))
    expect(grps[2].getHeading()).toEqual(90)
    expect(grps[2].getStrength()).toEqual(3)
  })

  it("creates_groups_hard_mode", () => {
    const updatedProps = { ...testProps }
    updatedProps.isHardMode = true
    wall.initialize(updatedProps, testState)
    jest
      .spyOn(PSMath, "randomHeading")
      .mockReturnValueOnce(90)
      .mockReturnValueOnce(90)
      .mockReturnValueOnce(120)
      .mockReturnValueOnce(240)
    jest.spyOn(PSMath, "randomNumber").mockReturnValue(0)
    wall.seps = [0, 20 * PSMath.PIXELS_TO_NM, 20 * PSMath.PIXELS_TO_NM]
    wall.numGroupsToCreate = 3
    const startPt = new Point(100, 100)
    const grps = wall.createGroups(startPt, [1, 2, 3])
    expect(grps[0].getStartPos()).toEqual(startPt)
    expect(grps[0].getHeading()).toEqual(90)
    expect(grps[0].getStrength()).toEqual(1)
    expect(grps[1].getStartPos()).toEqual(new Point(100, 180))
    expect(grps[1].getHeading()).toEqual(120)
    expect(grps[1].getStrength()).toEqual(2)
    expect(grps[2].getStartPos()).toEqual(new Point(100, 260))
    expect(grps[2].getHeading()).toEqual(240)
    expect(grps[2].getStrength()).toEqual(3)
  })

  it("creates_groups_ns", () => {
    setBlueInTheNorth()
    jest.spyOn(PSMath, "randomHeading").mockReturnValue(90)
    jest.spyOn(PSMath, "randomNumber").mockReturnValue(0)
    wall.seps = [0, 20 * PSMath.PIXELS_TO_NM, 20 * PSMath.PIXELS_TO_NM]
    wall.numGroupsToCreate = 3
    const startPt = new Point(100, 100)
    const grps = wall.createGroups(startPt, [1, 2, 3])
    expect(grps[0].getStartPos()).toEqual(startPt)
    expect(grps[0].getHeading()).toEqual(90)
    expect(grps[0].getStrength()).toEqual(1)
    expect(grps[1].getStartPos()).toEqual(new Point(180, 100))
    expect(grps[1].getHeading()).toEqual(90)
    expect(grps[1].getStrength()).toEqual(2)
    expect(grps[2].getStartPos()).toEqual(new Point(260, 100))
    expect(grps[2].getHeading()).toEqual(90)
    expect(grps[2].getStrength()).toEqual(3)
  })

  it("draws_info", () => {
    const group1 = new AircraftGroup(p)
    const group2 = new AircraftGroup({ ...p, sy: 180, alts: [13, 13, 13, 13] })
    const group3 = new AircraftGroup({
      ...p,
      sy: 265,
      alts: [15, 15, 15],
      nContacts: 3,
    })
    wall.groups = [group1, group2, group3]
    wall.drawInfo()
    expect(wall.dimensions.wide).toEqual(40)
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })

  it("draws", () => {
    TestCanvas.useContext()
    jest.spyOn(PSMath, "randomHeading").mockReturnValue(90)
    jest
      .spyOn(PSMath, "randomNumber")
      .mockReturnValueOnce(3) // num groups
      .mockReturnValueOnce(1) // 1 contact, first group
      .mockReturnValueOnce(2) // 2 contacts, second group
      .mockReturnValueOnce(80) // separation 1-2
      .mockReturnValueOnce(80) // separation 2-3
      .mockReturnValueOnce(0) // heading offset 1
      .mockReturnValueOnce(15) // alt single 1
      .mockReturnValueOnce(50) // mvr chance
      .mockReturnValueOnce(0) // heading offset 2
      .mockReturnValueOnce(17) // alt 2-1
      .mockReturnValueOnce(17) // alt 2-2
      .mockReturnValueOnce(80) // mvr chance
      .mockReturnValueOnce(0) // heading offset 3
      .mockReturnValueOnce(20) // alt 3-1
      .mockReturnValueOnce(20) // alt 3-2
      .mockReturnValueOnce(20) // alt 3-3
      .mockReturnValueOnce(20) // alt 3-4
      .mockReturnValueOnce(0) // mvr chance
    wall.draw(false, 7, new Point(100, 100))
    expect(TestCanvas.getCanvas()).toMatchSnapshot()

    expect(wall.groups[0].doesManeuvers()).toEqual(true)
    expect(wall.groups[1].doesManeuvers()).toEqual(false)
    expect(wall.groups[2].doesManeuvers()).toEqual(false)

    expect(wall.formatWeighted()).toEqual("")
  })
})
