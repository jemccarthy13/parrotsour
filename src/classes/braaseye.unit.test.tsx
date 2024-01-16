import { afterEach, expect, it, describe } from "vitest"
import { PaintBrush } from "../canvas/draw/paintbrush"
import TestCanvas from "../testutils/testcanvas"
import { PIXELS_TO_NM } from "../utils/math"
import { Braaseye } from "./braaseye"
import { Bullseye } from "./bullseye/bullseye"
import { Point } from "./point"

describe("Braaseye", () => {
  TestCanvas.useContext(100, 50)

  afterEach(() => {
    TestCanvas.setDimensions(100, 50)
    PaintBrush.clearCanvas()
  })

  const bluePos = new Point(10, 10)
  const bullseye = new Point(5, 10)
  const toPoint = new Point(20, 10)

  Bullseye.generate(bullseye)

  it("constructs_correctly", () => {
    const braaseye = new Braaseye(toPoint, bluePos)

    expect(braaseye.braa.bearing).toEqual("090")
    expect(braaseye.braa.bearingNum).toEqual(90)
    expect(braaseye.braa.range).toEqual(Math.floor(10 / PIXELS_TO_NM))
    expect(braaseye.bull.bearing).toEqual("090")
    expect(braaseye.bull.bearingNum).toEqual(90)
    expect(braaseye.bull.range).toEqual(Math.floor(15 / PIXELS_TO_NM))
  })

  it("draws_correctly_noOffset", () => {
    const braaseye = new Braaseye(toPoint, bluePos)

    braaseye.draw(true, true)
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })

  it("draws_correctly_withOffset", () => {
    const braaseye = new Braaseye(toPoint, bluePos)

    braaseye.draw(true, true, -10, 10)
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })

  it("draws_correctly_braaFirst", () => {
    const braaseye = new Braaseye(toPoint, bluePos)

    braaseye.draw(true, false, -10, 10)
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })
})
