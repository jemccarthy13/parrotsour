import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { AircraftGroup, GroupParams } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import TestCanvas from "../../../testutils/testcanvas"
import { BlueInThe, PictureCanvasState } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import DrawLeadEdge from "./leadingedge"
import { testProps } from "./mockutils.unit.test"
import { PictureFactory } from "./picturefactory"
import DrawPOD from "./pod"

describe("DrawPackages", () => {
  let testState: PictureCanvasState
  let p: Partial<GroupParams>
  let le: DrawPOD

  afterEach(() => {
    PaintBrush.clearCanvas()
  })

  beforeEach(() => {
    jest.restoreAllMocks()
    TestCanvas.useContext(800, 500)

    testState = {
      bullseye: new Point(400, 400),
      blueAir: new AircraftGroup({ sx: 600, sy: 200, hdg: 270, nContacts: 4 }),
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

    le = PictureFactory.getPictureDraw("pod") as DrawPOD
    le.initialize(testProps, testState)
    le.chooseNumGroups()
    le.createGroups()
    le.drawInfo()
  })

  it("2_pkgs_az_single_groups", () => {
    expect(le.getAnswer().includes("Note: This is core")).toEqual(true)
  })
})
