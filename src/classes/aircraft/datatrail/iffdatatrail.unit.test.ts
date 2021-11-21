import { PaintBrush } from "../../../canvas/draw/paintbrush"
import { Point } from "../../point"
import { IDMatrix } from "../id"
import { IFFDataTrail } from "./iffdatatrail"

import TestCanvas from "../../../testutils/testcanvas"

TestCanvas.useContext()

describe("IFFDataTrail", () => {
  afterEach(() => {
    PaintBrush.clearCanvas()
  })

  it("draws_correctly", () => {
    const datatrail = new IFFDataTrail(new Point(50, 50), 90)
    datatrail.draw(90, IDMatrix.FRIEND)
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })

  it("doesnt_draw_hos_sus", () => {
    const datatrail = new IFFDataTrail(new Point(50, 50), 90)
    datatrail.draw(90, IDMatrix.HOSTILE)
    datatrail.draw(90, IDMatrix.SUSPECT)
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })
})
