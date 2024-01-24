import { describe, afterEach, it, expect, beforeEach, vi } from "vitest"
import { BlueAir } from "../../../classes/aircraft/blueair"
import { Bullseye } from "../../../classes/bullseye/bullseye"
import { AircraftGroup } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import TestCanvas from "../../../testutils/testcanvas"
import { BlueInThe, PictureCanvasState } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import { testProps } from "./mockutils.unit.test"
import { PictureFactory } from "./picturefactory"
import DrawPOD from "./pod"

describe("DrawPOD", () => {
  const testState: PictureCanvasState = {
    answer: { pic: "3 grp ladder", groups: [] },
    reDraw: vi.fn(),
  }
  const le: DrawPOD = PictureFactory.getPictureDraw("pod") as DrawPOD

  const newTestProps = { ...testProps }

  afterEach(() => {
    PaintBrush.clearCanvas()
  })

  beforeEach(() => {
    vi.restoreAllMocks()
    TestCanvas.useContext(800, 500)

    Bullseye.generate(new Point(400, 400))

    BlueAir.set(new AircraftGroup({ sx: 600, sy: 200, hdg: 270, nContacts: 4 }))

    newTestProps.orientation.orient = BlueInThe.EAST

    le.initialize(newTestProps, testState)
    le.chooseNumGroups()
    le.createGroups()
    le.drawInfo()
  })

  it("has_benign_measurements", () => {
    expect(le.getPictureInfo().deep).toEqual(20)
    expect(le.getPictureInfo().wide).toEqual(20)
  })

  it("has_no_weighted", () => {
    expect(le.formatWeighted()).toEqual("")
  })

  it("has_placeholder_title_and_dimensions", () => {
    expect(le.formatPicTitle()).toEqual("CORE")
    expect(le.formatDimensions()).toEqual("CORE")
  })

  it("tests_creation_pod", () => {
    expect(le.getNumGroups()).toBeGreaterThan(2)
    expect(le.getNumGroups()).toBeLessThan(14)
    expect(le.getAnswer().includes("Note: This is core")).toEqual(true)
  })

  it("formats_core_single", () => {
    const le = PictureFactory.getPictureDraw("pod") as DrawPOD

    vi.spyOn(le, "chooseNumGroups").mockImplementation(
      () => (le.numGroupsToCreate = 1)
    )

    le.initialize(newTestProps, testState)
    le.chooseNumGroups()
    le.createGroups()
    le.drawInfo()

    expect(le.getAnswer()).toMatch(/SINGLE GROUP.*/i)
  })

  it("formats_core_multiple", () => {
    const le = PictureFactory.getPictureDraw("pod") as DrawPOD

    vi.spyOn(le, "chooseNumGroups").mockImplementation(
      () => (le.numGroupsToCreate = 3)
    )

    le.initialize(newTestProps, testState)
    le.chooseNumGroups()
    le.createGroups()
    le.drawInfo()

    expect(le.getAnswer()).toMatch(/3 GROUPS.*/i)
  })
})
