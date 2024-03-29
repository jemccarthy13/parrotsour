import { expect, it, describe, beforeAll, afterEach } from "vitest"
import { PaintBrush } from "../canvas/draw/paintbrush"
import TestCanvas from "../testutils/testcanvas"
import { BRAA } from "./braa"

describe("BRAA", () => {
  beforeAll(() => {
    TestCanvas.useContext(50, 20)
  })

  afterEach(() => {
    PaintBrush.clearCanvas()
  })

  it("constructs_correctly", () => {
    const br = new BRAA(90, 20)

    expect(br.bearing).toEqual("090")
    expect(br.range).toEqual(20)
    expect(br.bearingNum).toEqual(90)
  })

  it("converts_to_pretty_string", () => {
    const br = new BRAA(90, 20)

    expect(br.toString()).toEqual("090/20")
  })

  it("draws_correctly", () => {
    const br = new BRAA(90, 20)

    br.draw(10, 10, "black", true)
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })

  it("draws_only_when_showmeasure_true", () => {
    const br = new BRAA(90, 20)

    br.draw(10, 10, "green", false)
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })
})
