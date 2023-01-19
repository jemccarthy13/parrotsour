import { PictureCanvasState } from "../canvas/canvastypes"
import { PaintBrush } from "../canvas/draw/paintbrush"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../classes/groups/group"
import { snackActions } from "../components/alert/psalert"
import { AnimationHandler } from "./handler"

/**
 * This Handler implements applyLogic to provide a procedural scenario
 * and drive aircraft towards their intent.
 */
export class ProceduralAnimationHandler extends AnimationHandler {
  /**
   * Drive blue air. No-op for Procedural as all groups follow the
   * same logic (there is no 'blue air' in procedural state)
   * @param blueAir
   * @param groups
   * @param dataStyle
   */
  applyBlueLogic(): void {
    // do nothing
  }

  checkForCoAltitude(
    groups1: AircraftGroup[],
    groups2: AircraftGroup[],
    dataStyle: SensorType
  ) {
    const result = groups1.filter((grp: AircraftGroup) =>
      groups2.some(
        (grp2) =>
          grp.getAltitude() === grp2.getAltitude() &&
          grp.getCenterOfMass(dataStyle).getBR(grp2.getCenterOfMass(dataStyle))
            .range <= 20
      )
    )

    if (result.length !== 0) {
      snackActions.error("CoAlt!")
    }
  }

  /**
   * Drive each group according to procedural 'rules'.
   *
   * Each group will try to go to their desired altitude
   * or desired destination.
   *
   * @param grp the Group to apply logic to
   * @param state current state of procedural canvas
   * @param dataStyle current SensorType (datatrail)
   * @param resetCallback callback for when end state is met; unused as procedural has no end state
   */
  applyLogic(
    grp: AircraftGroup,
    state: PictureCanvasState,
    dataStyle: SensorType
  ): void {
    this.checkForCoAltitude(state.answer.groups, state.answer.groups, dataStyle)

    grp.updateAltitude()
    PaintBrush.drawAltitudes(grp.getCenterOfMass(dataStyle), grp.getAltitudes())

    // *** Issue #12 - PROCEDURAL -- work the request system
    // if (groups[x].request !== undefined){
    //   groups[x].successAsReq = false;
    //   groups[x].successAltReq = false;
    //   if (groups[x].request && groups[x].request?.airspace){
    //     const desiredLoc = convertToXY(groups[x].request?.airspace)
    //     const rngToDes = getBR(groups[x].startX, groups[x].startY, desiredLoc).range
    //     if (atFinalDest && rngToDes < 10){
    //       groups[x].successAsReq = true;
    //     }
    //   } else {
    //     groups[x].successAsReq = true;
    //   }

    //   if(groups[x].request?.alt){
    //     if(groups[x].z[0] === groups[x].request?.alt || groups[x].z[0] === groups[x].request?.alt){
    //       groups[x].successAltReq = true;
    //     }
    //   } else {
    //     groups[x].successAltReq = true;
    //   }

    //   if (groups[x].successAsReq && groups[x].successAltReq) {
    //     snackbar.alert("Processed request for " + groups[x].callsign, 3000);
    //     groups[x].request= undefined;
    //   }
    // }

    if (!grp.isCapping()) {
      grp.doNextRouting()
    }
  }
}
