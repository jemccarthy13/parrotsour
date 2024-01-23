import { PictureCanvasState } from "../canvas/canvastypes"
import { PaintBrush } from "../canvas/draw/paintbrush"
import { BlueAir } from "../classes/aircraft/blueair"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../classes/groups/group"
import { randomNumber } from "../utils/math"
import { AnimationHandler } from "./handler"

/**
 * This Handler implements applyLogic to drive towards a desired point
 * or a desired heading to fly (in the absence of desired point).
 *
 * If neither intent is present, fly current heading until the boundary
 * of the canvas.
 */
export class PicAnimationHandler extends AnimationHandler {
  /**
   * Drive blue air towards red air.
   *
   * @param blueAir The blue aircraft group
   * @param groups The rest of the aircraft groups
   * @param dataStyle SensorType for data trail
   */
  applyBlueLogic(
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

  /**
   * Drive red air:
   * - Stops animation if red is too close to blue
   * - Check and perform predetermined maneuvers
   * - Check if red is too close to canvas boundaries and correct
   * as required
   *
   * @param grp Group to check intent for
   * @param state Current state of canvas
   * @param dataStyle Current DataTrail style
   * @param resetCallback (Optional) call back to perform on animate pause
   */
  applyLogic(
    grp: AircraftGroup,
    state: PictureCanvasState,
    dataStyle: SensorType,
    resetCallback?: () => void
  ): void {
    const bluePos = BlueAir.get().getCenterOfMass(dataStyle)
    const startPos = grp.getCenterOfMass(dataStyle)

    // if red is close enough to blue, stop the animation
    if (startPos.getBR(bluePos).range < 30 && resetCallback) {
      this.pauseFight(resetCallback)
    }

    // if the group is flagged to do maneuvers, check to see if its maneuver time
    if (grp.doesManeuvers()) {
      // check to see if the group should maneuver
      const shouldManeuver = startPos.getBR(bluePos).range < 70

      // if the maneuver was triggered, unset the routing and set a random desired heading
      if (shouldManeuver) {
        grp.updateIntent({
          desiredLoc: [],
          desiredHeading: randomNumber(45, 330, [grp.getHeading()]),
        })
        grp.setManeuvers(0) // Issue #2
      }

      // Issue #2 -- MANEUVER -- when maneuver count is >1, set two routing points
      // (i.e. flank for xx nm then turn back hot)
    }

    // draw altitudes during the animation
    if (this.continueAnimate) {
      const grpPos = grp.getCenterOfMass(dataStyle)

      PaintBrush.drawAltitudes(grpPos, grp.getAltitudes())

      if (this._isNearBounds(grp, dataStyle)) {
        grp.updateIntent({
          desiredHeading: grpPos.getBR(bluePos).bearingNum,
        })
      }
    }
  }
}
