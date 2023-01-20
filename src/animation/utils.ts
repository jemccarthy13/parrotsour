import { PaintBrush } from "../canvas/draw/paintbrush"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../classes/groups/group"

/**
 * Internal function to see if a group is near the canvas boundary.
 *
 * Used to change group logic when approaching the edge of the canvas
 * @param group The group to check against boundaries
 * @param dataStyle The current DataTrail type
 */
export function isNearBounds(
  group: AircraftGroup,
  dataStyle: SensorType
): boolean {
  const buffer = 40
  const sX = group.getCenterOfMass(dataStyle).x
  const sY = group.getCenterOfMass(dataStyle).y
  const ctx = PaintBrush.getContext()

  return (
    sX < buffer ||
    sX > ctx.canvas.width - buffer ||
    sY < buffer ||
    sY > ctx.canvas.height - buffer
  )
}
