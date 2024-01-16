import { describe, it, expect } from "vitest"
import { FORMAT } from "../classes/supportedformats"
import {
  randomNumber,
  randomHeading,
  getDegDeltaBetween,
  headingToRadians,
  toDegrees,
  toRadians,
} from "./math"

describe("psmath", () => {
  it("randomNumber", () => {
    const a = [0, 0]

    for (let x = 0; x < 2000; x++) {
      const b = randomNumber(0, 1)

      a[b]++
    }

    const chi1 = ((0.539 - a[0]) ^ (0.539 - a[0])) / a[0]
    const chi2 = ((0.4602 - a[1]) ^ (0.4602 - a[1])) / a[1]
    const x2 = chi1 + chi2

    expect(x2).toBeLessThanOrEqual(0.01)
  })

  it("randomHeading_ALSA", () => {
    for (let x = 0; x < 2000; x++) {
      const hdg = randomHeading(FORMAT.ALSA, 270)

      expect(hdg).toBeGreaterThanOrEqual(0)
      expect(hdg).toBeLessThanOrEqual(360)
    }
  })

  it("randomHeading_IPE", () => {
    for (let x = 0; x < 2000; x++) {
      const hdg = randomHeading(FORMAT.IPE, 270)

      expect(hdg).toBeGreaterThanOrEqual(45)
      expect(hdg).toBeLessThanOrEqual(135)
    }
  })

  it("randomHeading_basedonblue", () => {
    for (let x = 0; x < 2000; x++) {
      const hdg = randomHeading(FORMAT.IPE, 90)

      expect(hdg).toBeGreaterThanOrEqual(225)
      expect(hdg).toBeLessThanOrEqual(315)
    }
  })

  it("randomHeading_bluehdg_undef", () => {
    for (let x = 0; x < 2000; x++) {
      const hdg = randomHeading(FORMAT.IPE)

      expect(hdg).toBeGreaterThanOrEqual(134)
      expect(hdg).toBeLessThanOrEqual(224)
    }
  })

  it("toRads_toDeg", () => {
    expect(toDegrees(6.283185307179586)).toEqual(360)
    expect(toRadians(360)).toEqual(6.283185307179586)
  })

  it("hdg_to_rads", () => {
    expect(headingToRadians(360)).toEqual({
      headAngle: 5.235987755982989,
      offset: 0,
      radians: 1.5707963267948966,
    })

    expect(headingToRadians(45)).toEqual({
      headAngle: 4.4505895925855405,
      offset: 5.497787143782138,
      radians: 0.7853981633974483,
    })
  })

  it("delta_between", () => {
    expect(getDegDeltaBetween(90, 110, undefined)).toEqual(20)
    expect(getDegDeltaBetween(90, 110, "LEFT")).toEqual(-340)
    expect(getDegDeltaBetween(90, 70, undefined)).toEqual(-20)
  })
})
