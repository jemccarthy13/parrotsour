import { describe, it, expect } from "vitest"
import { sleep, formatT, getTimeStamp } from "./time"

describe("pstime", () => {
  it("sleeps_for_duration", async () => {
    let v = false
    const callback = () => {
      v = true
    }

    const { promise } = sleep(100, callback)

    await Promise.all([promise]).then(() => {
      expect(v).toEqual(true)
    })
  })

  it("sleeps_for_duration", () => {
    let v = false
    const callback = () => {
      v = true
    }

    const { cancel } = sleep(5000, callback)

    cancel()
    expect(v).toEqual(false)
  })

  it("formatT", () => {
    expect(formatT(1)).toEqual("01")
    expect(formatT(10)).toEqual("10")
    expect(formatT(100)).toEqual("100")
  })

  it("getTimeStamp", () => {
    const d = new Date()

    d.setHours(10)
    d.setMinutes(40)
    d.setSeconds(22)
    expect(getTimeStamp(d)).toEqual("10:40:22")
  })

  it("getTimeStamp", () => {
    const d = new Date()
    const str = d.toString()

    expect(getTimeStamp()).toEqual(str.substring(16, 24))
  })
})
