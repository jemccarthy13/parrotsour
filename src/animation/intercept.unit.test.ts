import { vi, describe, it, expect } from "vitest"
import { PictureCanvasState } from "../canvas/canvastypes"
import { PaintBrush } from "../canvas/draw/paintbrush"
import { BlueAir } from "../classes/aircraft/blueair"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../classes/groups/group"
import { Point } from "../classes/point"
import { PicAnimationHandler } from "./intercept"

const testHandler = new PicAnimationHandler()

const blueAir = new AircraftGroup({ sx: 400, sy: 200 })
const redgroup = new AircraftGroup({ sx: 200, sy: 200 })

vi.spyOn(PaintBrush, "drawAltitudes").mockImplementation(vi.fn())

//@ts-expect-error only mockImplement minimum required for test to function
// error is missing properties of the rest of "context"
vi.spyOn(PaintBrush, "getContext").mockImplementation(() => {
  return { putImageData: vi.fn(), canvas: { width: 500, height: 500 } }
})

describe("PicAnimationHandler", () => {
  const resetMock = vi.fn()

  BlueAir.set(new AircraftGroup({ sx: 400, sy: 200, nContacts: 4 }))

  const p: PictureCanvasState = {
    answer: {
      pic: "",
      groups: [redgroup],
    },
    reDraw: vi.fn(),
  }

  it("applies_blue_logic", () => {
    testHandler.applyBlueLogic(blueAir, [redgroup], SensorType.ARROW)
    expect(
      Math.abs(blueAir[0].getIntent().getDesiredHeading() - 270)
    ).toBeLessThan(5)
  })

  it("applies_logic_no_change", () => {
    // when logic is applied to a group,
    // if not near a border, group doesn't maneuver, and isn't too close
    // to blue, there is no change to the group
    redgroup[0].updateIntent({ desiredHeading: 120 })

    const prevRedGroup = { ...redgroup[0] }

    testHandler.applyLogic(redgroup, p, SensorType.ARROW, resetMock)
    expect(redgroup[0].getCenterOfMass()).toEqual(new Point(224, 200))
    expect(
      Math.abs(blueAir[0].getIntent().getDesiredHeading() - 270)
    ).toBeLessThan(5)

    expect(redgroup[0]).toEqual(prevRedGroup)
  })

  it("applies_logic_near_border", () => {
    const borderRed = new AircraftGroup({ sx: 5, sy: 200 })

    // @sonarlint-ignore-next
    const grp: AircraftGroup = Object.assign({}, borderRed)

    // when logic is applied to a group,
    // if near a border, group intent will be to maneuver back onto canvas
    grp[0].updateIntent({ desiredHeading: 270 })

    expect(Math.abs(grp[0].getIntent().getDesiredHeading() - 270)).toBeLessThan(
      5
    )
    testHandler.applyLogic(borderRed, p, SensorType.ARROW, resetMock)
    expect(redgroup[0].getCenterOfMass()).toEqual(new Point(224, 200))

    // updated intended heading from 270 to now be 90
    expect(Math.abs(grp[0].getIntent().getDesiredHeading() - 90)).toBeLessThan(
      5
    )
  })

  it("maneuvers_when_criteria_met", () => {
    const mvrRed = new AircraftGroup({ sx: 325, sy: 200 })

    mvrRed.setManeuvers(1)

    expect(mvrRed.doesManeuvers()).toEqual(true)
    const beforeIntent = mvrRed[0].getIntent().getDesiredHeading()

    testHandler.applyLogic(mvrRed, p, SensorType.ARROW, resetMock)
    expect(redgroup[0].getCenterOfMass()).toEqual(new Point(224, 200))

    expect(mvrRed.doesManeuvers()).toEqual(false)
    expect(mvrRed[0].getIntent().getDesiredHeading()).not.toEqual(beforeIntent)
  })

  it("does_not_maneuver_criteria_not_met", () => {
    const mvrRed = new AircraftGroup({ sx: 5, sy: 200 })

    mvrRed.setManeuvers(1)

    expect(mvrRed.doesManeuvers()).toEqual(true)
    const beforeIntent = mvrRed[0].getIntent().getDesiredHeading()

    testHandler.applyLogic(mvrRed, p, SensorType.ARROW, resetMock)
    expect(redgroup[0].getCenterOfMass()).toEqual(new Point(224, 200))

    // still capable of maneuvering
    // still heading in the same desired direction
    expect(mvrRed.doesManeuvers()).toEqual(true)
    expect(mvrRed[0].getIntent().getDesiredHeading()).toEqual(beforeIntent)
  })
})
