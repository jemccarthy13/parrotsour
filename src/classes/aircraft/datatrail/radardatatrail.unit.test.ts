import { Point } from "../../point"
import { RadarDataTrail } from "./radardatatrail"

describe("RadarDataTrail", () => {
  it("needs_to_function", () => {
    const startPt = new Point(50, 50)
    const rdrData = new RadarDataTrail(startPt, 90)
    const prevData = rdrData.getDataTrail()

    rdrData.move(90)
    expect(prevData).not.toEqual(rdrData.getDataTrail())
  })
})
