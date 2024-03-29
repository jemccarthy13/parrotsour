import { BlueInThe, FightAxis } from "../../../canvas/canvastypes"
import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { PIXELS_TO_NM, randomNumber } from "../../../utils/math"
import { PaintBrush } from "../paintbrush"

export type Bounds = {
  lowX: number
  hiX: number
  lowY: number
  hiY: number
}

export interface PictureInfo {
  deep: number
  wide: number
  start: Point
}

const _howFarOut = (x: number, min: number, max: number): number => {
  if (x < min) {
    return min - x
  } else if (x > max) {
    return -(x - max)
  }

  return 0
}

export const _clampPictureInContext = (
  pInfo: Partial<PictureInfo>,
  orientation: BlueInThe
): Point => {
  const ctx = PaintBrush.getContext()

  if (!pInfo.start) {
    console.warn(
      "Without a starting point to clamp, _clampPictureInContext will generate a random point."
    )

    return new Point(
      randomNumber(1, ctx.canvas.width),
      randomNumber(1, ctx.canvas.height)
    )
  }

  const isNS = FightAxis.isNS(orientation)

  const width = pInfo.wide ?? 7 * PIXELS_TO_NM
  const depth = pInfo.deep ?? 7 * PIXELS_TO_NM

  const minValWithBuffer = 1 + 7 * PIXELS_TO_NM
  const maxXWithBuffer = ctx.canvas.width - 1 - (isNS ? width : depth)
  const maxYWithBuffer =
    ctx.canvas.height - 1 - 7 * PIXELS_TO_NM - (isNS ? depth : width)

  pInfo.start.x += _howFarOut(pInfo.start.x, minValWithBuffer, maxXWithBuffer)
  pInfo.start.y += _howFarOut(pInfo.start.y, minValWithBuffer, maxYWithBuffer)

  return pInfo.start
}

/**
 *  NOTE - this is only here to export for testing purposes. These functions
 * are not intended to be accessible outside of the testing environment as they
 * are simply utility functions used to clamp pictures into a canvas.
 */
export const exportedForTesting = {
  _howFarOut,
  _clampPictureInContext,
}

export const getRestrictedStartPos = (
  blueAir: AircraftGroup,
  orientation: BlueInThe,
  dataStyle: SensorType,
  minNMFromBlue: number,
  maxNMFromBlue: number,
  pInfo?: Partial<PictureInfo>
): Point => {
  const ctx = PaintBrush.getContext()
  const blueLoc = blueAir.getCenterOfMass(dataStyle)

  let limitLine = blueLoc.x
  let canvasSize = ctx.canvas.width

  if (FightAxis.isNS(orientation)) {
    limitLine = blueLoc.y
    canvasSize = ctx.canvas.height
  }

  let lBound = (limitLine + maxNMFromBlue * PIXELS_TO_NM) / canvasSize
  let uBound = (limitLine + minNMFromBlue * PIXELS_TO_NM) / canvasSize

  if (orientation === BlueInThe.SOUTH || orientation === BlueInThe.EAST) {
    lBound = (limitLine - maxNMFromBlue * PIXELS_TO_NM) / canvasSize
    uBound = (limitLine - minNMFromBlue * PIXELS_TO_NM) / canvasSize
  }

  const isNS =
    orientation === BlueInThe.NORTH || orientation === BlueInThe.SOUTH

  let mults = { lowX: lBound, hiX: uBound, lowY: 0.2, hiY: 0.8 }

  if (isNS) {
    mults = { lowX: 0.2, hiX: 0.8, lowY: lBound, hiY: uBound }
  }

  /**
   * if pInfo?.start is provided, getRestrictedStartPos will ignore restrictions
   * and result in no change to point
   */

  const startY: number =
    (pInfo?.start && pInfo.start.y) ||
    randomNumber(ctx.canvas.height * mults.lowY, ctx.canvas.height * mults.hiY)
  const startX: number =
    (pInfo?.start && pInfo.start.x) ||
    randomNumber(ctx.canvas.width * mults.lowX, ctx.canvas.width * mults.hiX)

  pInfo = {
    deep: pInfo?.deep ?? 7 * PIXELS_TO_NM,
    wide: pInfo?.wide ?? 7 * PIXELS_TO_NM,
    start: new Point(startX, startY),
  }

  const point = _clampPictureInContext(pInfo, orientation)

  return point
}

export const getStartPos = (
  blueAir: AircraftGroup,
  orientation: BlueInThe,
  dataStyle: SensorType,
  pInfo?: Partial<PictureInfo>
): Point => {
  const ctx = PaintBrush.getContext()
  let canvasSize = ctx.canvas.width

  if (orientation === BlueInThe.NORTH || orientation === BlueInThe.SOUTH) {
    canvasSize = ctx.canvas.height
  }

  const maxMiles = canvasSize / PIXELS_TO_NM

  return getRestrictedStartPos(
    blueAir,
    orientation,
    dataStyle,
    45,
    maxMiles,
    pInfo
  )
}
