import { getRestrictedStartPos, _clampPictureInContext } from "./pictureclamp"

import { BlueInThe } from "../../canvastypes"
import { Point } from "../../../classes/point"
import { PIXELS_TO_NM } from "../../../utils/psmath"

import { _howFarOut } from "./pictureclamp"
import { AircraftGroup } from "../../../classes/groups/group"
import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { PaintBrush } from "../paintbrush"

const TEN_NM = PIXELS_TO_NM * 10

beforeAll(() => {
  const canvas = document.createElement("canvas")
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = canvas.getContext("2d")!
  canvas.width = 800
  canvas.height = 500
  PaintBrush.use(ctx)
})

/**
 * Test the "_howFarOut" function.
 *
 * Expect the function to return the signed distance to
 * offset to be back in the range.
 *
 * I.e. If my max == 100 and x == 105, I have to move -5
 * to be back inside the range.
 * Convsersely, if my min == 0 and x == -10, I have to move +5
 * to be back inside the range.
 */
describe("_howFarOut", () => {
  it("howFarOut_belowMin0", () => {
    const result = _howFarOut(-100, 0, 100)
    expect(result).toEqual(100)
  })

  it("howFarOut_atMin", () => {
    const result = _howFarOut(-100, 0, 100)
    expect(result).toEqual(100)
  })

  it("howFarOut_belowMinNeg", () => {
    const result = _howFarOut(-100, -10, 100)
    expect(result).toEqual(90)
  })

  it("howFarOut_belowCustomMin", () => {
    const result = _howFarOut(-100, 5, 100)
    expect(result).toEqual(105)
  })

  it("howFarOut_inRange", () => {
    const result = _howFarOut(60, 0, 100)
    expect(result).toEqual(0)
  })

  it("howFarOut_atMax", () => {
    const result = _howFarOut(100, 0, 100)
    expect(result).toEqual(0)
  })

  it("howFarOut_atMin", () => {
    const result = _howFarOut(0, 0, 100)
    expect(result).toEqual(0)
  })

  it("howFarOut_aboveMax", () => {
    const result = _howFarOut(101, 0, 100)
    expect(result).toEqual(-1)
  })
})

/**
 * Test the ability to clamp a picture to be drawn
 * within the canvas.
 */
describe("_clampPictureInContext", () => {
  it("clampAZ_negX_posY_BlueInEast", () => {
    const startPt = new Point(-400, 1000)
    const result = _clampPictureInContext(
      {
        wide: TEN_NM,
        start: startPt,
      },
      BlueInThe.EAST
    )

    const ctx = PaintBrush.getContext()
    expect(result.x).toEqual(1 + 7 * PIXELS_TO_NM)
    expect(result.y).toEqual(
      startPt.y -
        (startPt.y - (ctx.canvas.height - 1 - 7 * PIXELS_TO_NM - TEN_NM))
    )
  })

  it("clampAZ_negX_negY_BlueInEast", () => {
    const drawDistance = PIXELS_TO_NM * 19
    const startPt = new Point(-400, -1000)
    const result = _clampPictureInContext(
      {
        wide: drawDistance,
        start: startPt,
      },
      BlueInThe.EAST
    )

    expect(result.x).toEqual(1 + 7 * PIXELS_TO_NM)
    expect(result.y).toEqual(1 + 7 * PIXELS_TO_NM)
  })

  it("clampRng_posX_negY_BlueInEast", () => {
    const startPt = new Point(1000, -500)
    const result = _clampPictureInContext(
      {
        deep: TEN_NM,
        start: startPt,
      },
      BlueInThe.EAST
    )

    const ctx = PaintBrush.getContext()
    expect(result.x).toEqual(
      startPt.x - (startPt.x - (ctx.canvas.width - 1 - TEN_NM))
    )
    expect(result.y).toEqual(1 + 7 * PIXELS_TO_NM)
  })

  it("clampRng_posX_posY_BlueInEast", () => {
    const startPt = new Point(1000, 1000)
    const result = _clampPictureInContext(
      {
        deep: TEN_NM,
        start: startPt,
      },
      BlueInThe.EAST
    )

    const ctx = PaintBrush.getContext()
    expect(result.x).toEqual(
      startPt.x - (startPt.x - (ctx.canvas.width - 1 - TEN_NM))
    )
    expect(result.y).toEqual(
      startPt.y -
        (startPt.y - (ctx.canvas.height - 1 - 7 * PIXELS_TO_NM)) -
        7 * PIXELS_TO_NM
    )
  })

  it("clampAz_posX_posY_BlueInNorth", () => {
    const startPt = new Point(1000, 1000)
    const result = _clampPictureInContext(
      {
        deep: TEN_NM,
        start: startPt,
      },
      BlueInThe.NORTH
    )
    const ctx = PaintBrush.getContext()

    expect(result.x).toEqual(
      startPt.x - (startPt.x - (ctx.canvas.width - 1 - 7 * PIXELS_TO_NM))
    )
    expect(result.y).toEqual(
      startPt.y -
        (startPt.y - (ctx.canvas.height - 1 - 7 * PIXELS_TO_NM)) -
        TEN_NM
    )
  })

  it("clamp_warns_no_point_provided", () => {
    const warnSpy = jest.spyOn(global.console, "warn").mockImplementation()
    const result = _clampPictureInContext({}, BlueInThe.EAST)

    expect(warnSpy).toBeCalledTimes(1)
    warnSpy.mockRestore()

    const ctx = PaintBrush.getContext()
    expect(result.x).toBeLessThanOrEqual(ctx.canvas.width - 1)
    expect(result.x).toBeGreaterThanOrEqual(1)
    expect(result.y).toBeLessThanOrEqual(ctx.canvas.height - 1)
    expect(result.y).toBeGreaterThanOrEqual(1)
  })
})

/**
 * Test restricting the picture clamp to be a certain distance
 * from blue and within the canvas.
 */
describe("getRestrictedStartPos", () => {
  const blueAir = new AircraftGroup({
    sx: 100,
    sy: 100,
    nContacts: 4,
    hdg: 270,
    alts: [100, 100, 100, 100],
  })

  it("runs", () => {
    const startPos = getRestrictedStartPos(
      blueAir,
      BlueInThe.NORTH,
      SensorType.ARROW,
      45,
      50,
      {
        wide: TEN_NM,
      }
    )
    expect(
      startPos.getBR(blueAir.getCenterOfMass(SensorType.ARROW)).range
    ).toBeGreaterThan(45)
    expect(
      startPos.getBR(blueAir.getCenterOfMass(SensorType.ARROW)).range
    ).toBeLessThan(50)
  })
})
