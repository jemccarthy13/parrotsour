import { AircraftGroup } from "../../classes/groups/group"
import { aiProcess } from "./aiprocess"

describe("AI Processing", () => {
  it("processes_text_with_cgrs", () => {
    const send = jest.fn()
    const grp = new AircraftGroup()

    grp.setLabel("VR01")

    aiProcess(
      { text: "VR01 proceed 88AG", voice: false },
      { pic: "hello", groups: [grp] },
      send
    )

    expect(send).toHaveBeenCalled()
  })

  it("processes_text_no_cgrs", () => {
    const send = jest.fn()
    const grp = new AircraftGroup()

    grp.setLabel("VR01")

    aiProcess(
      { text: "VR01 proceed 123 456", voice: false },
      { pic: "hello", groups: [grp] },
      send
    )

    expect(send).toHaveBeenCalled()
  })

  it("processes_text_unknown_asset", () => {
    const send = jest.fn()
    const grp = new AircraftGroup()

    grp.setLabel("VR01")

    aiProcess(
      { text: "VR02 proceed 123 456", voice: false },
      { pic: "hello", groups: [grp] },
      send
    )

    expect(send).toHaveBeenCalled()
    expect(send).toHaveBeenCalledWith("SYSTEM", "No such callsign")
  })

  it("processes_text_no_asset", () => {
    const send = jest.fn()
    const grp = new AircraftGroup()

    grp.setLabel("VR01")

    aiProcess(
      { text: "run to the", voice: false },
      { pic: "hello", groups: [grp] },
      send
    )

    expect(send).toHaveBeenCalled()
    expect(send).toHaveBeenCalledWith("SYSTEM", "I don't understand")
  })
})
