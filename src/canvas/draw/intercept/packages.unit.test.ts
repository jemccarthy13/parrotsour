import { vi } from "vitest"
import { BlueAir } from "../../../classes/aircraft/blueair"
import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { Bullseye } from "../../../classes/bullseye/bullseye"
import { AircraftGroup, GroupParams } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import TestCanvas from "../../../testutils/testcanvas"
import { BlueInThe, PictureCanvasState } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import { testProps } from "./mockutils.unit.test"
import { Package } from "./package"
import DrawPackage from "./packages"
import { PictureFactory } from "./picturefactory"
describe("DrawPackages", () => {
  let testState: PictureCanvasState
  let p: Partial<GroupParams>
  let pkg: DrawPackage

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

    pkg = PictureFactory.getPictureDraw("package") as DrawPackage
    pkg.initialize(testProps, testState)
    pkg.chooseNumGroups(2)
    pkg.createGroups(new Point(-1, -1), [1, 1])
    pkg.drawInfo()
  })

  it("casts_correctly", () => {
    const pkg: Package = new Package()
    const pt = new Point(50, 50)

    pkg.setBullseyePt(pt)
    expect(pkg.getBullseyePt()).toEqual(pt)
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

    pkg.pictures[0].groups = [sg2]
    pkg.pictures[1].groups = [sg1]

    expect(pkg.getAnswer()).toEqual(
      "2 PACKAGES AZIMUTH 42 NORTH PACKAGE BULLSEYE 276/44 " +
        "SOUTH PACKAGE BULLSEYE 230/57"
    )
  })

  it("2_pkgs_az_anchor_south", () => {
    expect(true).toEqual(true)
    const sg1 = new AircraftGroup({
      ...p,
      sx: 225,
      sy: 420,
      alts: [15],
      nContacts: 1,
    })
    const sg2 = new AircraftGroup({
      ...p,
      sx: 150,
      sy: 200,
      alts: [10],
      nContacts: 1,
    })

    pkg.pictures[0].groups = [sg1]
    pkg.pictures[1].groups = [sg2]

    expect(pkg.getAnswer()).toEqual(
      "2 PACKAGES AZIMUTH 55 SOUTH PACKAGE BULLSEYE 262/38 " +
        "NORTH PACKAGE BULLSEYE 312/75"
    )
    expect(pkg.getPictureInfo().deep).toEqual(-1)
  })

  // Issue # 8 - Package tests
  // -- az BlueInThe.NORTH
  // -- rng BlueInThe.EAST
  // -- rng BlueInThe.NORTH
  // -- equidistant, anchor highest
  // -- equidistant, equal height, anchor heaviest
  // -- >40, tryAgain
  // -- get picture info??
})
