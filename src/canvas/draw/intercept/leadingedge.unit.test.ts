import { vi, it, expect, describe, afterEach, beforeEach } from "vitest"
import { BlueAir } from "../../../classes/aircraft/blueair"
import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { Bullseye } from "../../../classes/bullseye/bullseye"
import { AircraftGroup, GroupParams } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import TestCanvas from "../../../testutils/testcanvas"
import { BlueInThe, PictureCanvasState } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import DrawLeadEdge from "./leadingedge"
import { testProps } from "./mockutils.unit.test"
import { PictureFactory } from "./picturefactory"

describe("DrawPackages", () => {
  let testState: PictureCanvasState
  let p: Partial<GroupParams>
  let le: DrawLeadEdge

  afterEach(() => {
    PaintBrush.clearCanvas()
  })

  beforeEach(() => {
    vi.restoreAllMocks()
    TestCanvas.useContext(800, 500)

    Bullseye.generate(new Point(400, 400))

    testState = {
      answer: { pic: "3 grp ladder", groups: [] },
      reDraw: vi.fn(),
    }

    BlueAir.set(new AircraftGroup({ sx: 600, sy: 200, hdg: 270, nContacts: 4 }))

    p = {
      dataTrailType: SensorType.ARROW,
      sx: 200,
      sy: 200,
      nContacts: 4,
      hdg: 90,
      alts: [20, 20, 20, 20],
    }

    testProps.orientation.orient = BlueInThe.EAST

    le = PictureFactory.getPictureDraw("leading edge") as DrawLeadEdge
    le.initialize(testProps, testState)
    le.chooseNumGroups(2)
    le.createGroups(new Point(-1, -1), [1, 1])
    le.drawInfo()
  })

  it("2_pkgs_az_single_groups", () => {
    const sg1 = new AircraftGroup({
      ...p,
      sy: 380,
      alts: [15],
      nContacts: 1,
    })
    const sg2 = new AircraftGroup({
      ...p,
      sy: 550,
      alts: [10],
      nContacts: 1,
    })

    le.groups = [sg1, sg2]
    expect(le.getAnswer().includes("2 GROUPS, LEADING EDGE")).toEqual(true)
  })
})
