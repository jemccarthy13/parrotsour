import { PaintBrush } from "../canvas/draw/paintbrush"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../classes/groups/group"
import { randomNumber } from "../utils/math"
import { useAnimator } from "./use-animator"
import { isNearBounds } from "./utils"

export function useInterceptAnimator(pauseCallback: () => void) {
  function applyRedLogic(
    grp: AircraftGroup,
    blueAir: AircraftGroup,
    dataStyle: SensorType,
    pauseCallback: () => void
  ) {
    const bluePos = blueAir.getCenterOfMass(dataStyle)
    const startPos = grp.getCenterOfMass(dataStyle)

    // if red is close enough to blue, stop the animation
    if (startPos.getBR(bluePos).range < 30 && pauseCallback) {
      pauseCallback()
    }

    // if the group is flagged to do maneuvers, check to see if its maneuver time
    if (grp.doesManeuvers()) {
      // if the maneuver was triggered, unset the routing and set a random desired heading
      if (startPos.getBR(bluePos).range < 70) {
        grp.updateIntent({
          desiredLoc: [],
          desiredHeading: randomNumber(45, 330),
        })
        grp.setManeuvers(0) // Issue #2
      }

      // Issue #2 -- MANEUVER -- when maneuver count is >1, set two routing points
      // (i.e. flank for xx nm then turn back hot)
    }

    // draw altitudes during the animation
    const grpPos = grp.getCenterOfMass(dataStyle)

    PaintBrush.drawAltitudes(grpPos, grp.getAltitudes())

    if (isNearBounds(grp, dataStyle)) {
      grp.updateIntent({
        desiredHeading: grpPos.getBR(bluePos).bearingNum,
      })
    }
  }

  /**
   * Drive blue air towards red air.
   *
   * @param blueAir The blue aircraft group
   * @param groups The rest of the aircraft groups
   * @param dataStyle SensorType for data trail
   */
  function applyBlueLogic(
    blueAir: AircraftGroup,
    groups: AircraftGroup[],
    dataStyle: SensorType
  ): void {
    const brToRed = blueAir
      .getCenterOfMass(dataStyle)
      .getBR(groups[0].getCenterOfMass(dataStyle))

    blueAir.updateIntent({
      desiredHeading: brToRed.bearingNum,
    })
  }

  return useAnimator({ applyBlueLogic, applyRedLogic, pauseCallback })
}
