import { describe, it, expect } from "vitest"
import { Point } from "../point"
import Tasking from "./tasking"

describe("Taskings", () => {
  it("initializes_empty", () => {
    const tasking = new Tasking()

    expect(tasking.toString()).toEqual("// TASKING NONE // NONE // NONE")
    expect(tasking.getLocationXY()).toEqual(undefined)
  })

  it("initializes_has_getters", () => {
    const tasking = new Tasking({
      id: "id001",
      locationXY: new Point(300, 300),
      locationStr: "88AG",
      description: "SMACK",
    })

    expect(tasking.toString()).toEqual("// TASKING id001 // 88AG // SMACK")
    expect(tasking.getLocationXY()).toEqual(new Point(300, 300))
  })
})
