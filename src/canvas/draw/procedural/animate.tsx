/* istanbul ignore file */
import {
  PictureCanvasProps,
  PictureCanvasState,
} from "../../../canvas/canvastypes"
import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../../../classes/groups/group"
import { snackActions } from "../../../pscomponents/alert/psalert"
import { randomNumber } from "../../../utils/math"
import { PaintBrush } from "../paintbrush"

let continueAnimation = false

function sleep(milliseconds: number): void {
  const start = new Date().getTime()

  for (let i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break
    }
  }
}

export function getContinueAnimate(): boolean {
  return continueAnimation
}

function setContinueAnimate(val: boolean) {
  continueAnimation = val
}

export function pauseFight(): void {
  setContinueAnimate(false)
}

function checkForCoAltitude(
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

function doAnimation(
  ctx: CanvasRenderingContext2D,
  props: PictureCanvasProps,
  state: PictureCanvasState,
  groups: AircraftGroup[],
  animateCanvas: ImageData,
  resetCallback?: (showMeasure: boolean) => void
): void {
  if (!ctx || !state.blueAir) return

  ctx.putImageData(animateCanvas, 0, 0)

  for (const group of groups) {
    checkForCoAltitude(groups, groups, props.dataStyle)

    group.doNextRouting()

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

    group.updateAltitude()

    if (!group.isCapping() && !group.hasRouting()) {
      group.draw(props.dataStyle)

      group.move()

      let newHeading = group.getHeading()

      const nextPoint = group.getNextRoutingPoint()

      if (nextPoint) {
        newHeading = group
          .getCenterOfMass(props.dataStyle)
          .getBR(nextPoint).bearingNum
      }

      group.updateIntent({
        desiredHeading: newHeading,
      })
    } else {
      // const sPos = groups[x].getCenterOfMass(props.dataStyle)
      group.draw(props.dataStyle)
      // drawGroupCap(
      //   ctx,
      //   props.orientation.orient,
      //   groups[x].getStrength(),
      //   sPos.x,
      //   sPos.y,
      //   "blue"
      // )
    }

    const sPos = group.getCenterOfMass(props.dataStyle)

    PaintBrush.drawText(group.getLabel(), sPos.x - 10, sPos.y + 20, 12)
  }

  if (continueAnimation) {
    const slider: HTMLInputElement = document.getElementById(
      "speedSlider"
    ) as HTMLInputElement

    if (slider && slider.value) {
      sleep(500 * ((100 - parseInt(slider.value)) / 100))
    } else {
      sleep(500 * ((100 - props.sliderSpeed) / 100))
    }

    const animate = function () {
      doAnimation(ctx, props, state, groups, animateCanvas, resetCallback)
    }

    window.requestAnimationFrame(animate)

    for (const group of groups) {
      PaintBrush.drawAltitudes(
        group.getCenterOfMass(props.dataStyle),
        group.getAltitudes()
      )
    }
  }
}

export function animateGroups(
  ctx: CanvasRenderingContext2D,
  props: PictureCanvasProps,
  state: PictureCanvasState,
  groups: AircraftGroup[],
  animateCanvas: ImageData,
  resetCallback?: (showMeasure: boolean) => void
): void {
  for (const group of groups) {
    if (randomNumber(0, 10) <= 2) {
      group.setManeuvers(1)
    }

    const bPos = state.blueAir.getCenterOfMass(props.dataStyle)

    group.updateIntent({
      desiredHeading: group.getCenterOfMass(props.dataStyle).getBR(bPos)
        .bearingNum,
    })
  }
  continueAnimation = true
  doAnimation(ctx, props, state, groups, animateCanvas, resetCallback)
}
