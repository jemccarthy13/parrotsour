import { expect, it, describe, afterEach } from "vitest"
import { PaintBrush } from "../../canvas/draw/paintbrush"
import TestCanvas from "../../testutils/testcanvas"
import { IDMatrix } from "../aircraft/id"
import { AircraftGroup } from "./group"
import { drawGroupCap } from "./groupcap"

describe("draw_group_cap", () => {
  TestCanvas.useContext()

  afterEach(() => {
    PaintBrush.clearCanvas()
  })

  it("draws_capping_group", () => {
    const grp = new AircraftGroup({
      nContacts: 4,
      hdg: 135,
      id: IDMatrix.HOSTILE,
      sx: 50,
      sy: 50,
    })
    grp.setCapping(true)
    drawGroupCap(grp)
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })

  it("draws_singleship_cap", () => {
    const grp = new AircraftGroup({
      nContacts: 1,
      hdg: 135,
      id: IDMatrix.HOSTILE,
      sx: 50,
      sy: 50,
    })
    grp.setCapping(true)
    drawGroupCap(grp)
    expect(TestCanvas.getCanvas()).toMatchSnapshot()
  })
})
