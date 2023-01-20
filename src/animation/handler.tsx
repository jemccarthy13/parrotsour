// Classes & Interfaces
import { PictureCanvasProps, PictureCanvasState } from "../canvas/canvastypes"
import { PaintBrush } from "../canvas/draw/paintbrush"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../classes/groups/group"
import { sleep } from "../utils/time"

/**
 * This class is the parent class for Animation.
 *
 * It contains root level getter/setters and defines abstract behavior for
 * AnimationHandler's children to implement to animate groups.
 *
 * To provide new animation logic / aircraft 'intent', create a new
 * child class of AnimationHandler and implement applyLogic to adjust
 * Group based on decision-making logic.
 */
export abstract class AnimationHandler {
  // variable to store the animation "cancel" function
  private sleepPromiseCancel = () => {
    console.warn("AnimationHandler has nothing to cancel.")
  }

  // force stop animation from within the handler by changing this to false
  continueAnimate = true

  // Set the animate cancel functionality (for non in-Handler/external interrupts)
  setSleepCancel(f: () => void): void {
    this.sleepPromiseCancel = f
  }

  /**
   * Pause the fight by canceling the sleep timeout.
   * This kills the pseudo-recursion found in doAnimation,
   * and the pauseCallback() call performs any post-pause
   * processing (i.e. drawing BRAASEYE for intercept canvas)
   * @param pauseCallback Function to call after the animation has been cancelled
   */
  pauseFight(pauseCallback?: () => void): void {
    this.sleepPromiseCancel()
    if (pauseCallback) {
      pauseCallback()
      this.continueAnimate = false
    }
  }

  /**
   * Update blue air intent as required. Same rules as with applyLogic.
   *
   * @param grp Group to check intent for
   * @param state Current state of canvas
   * @param dataStyle Current DataTrail type
   */
  abstract applyBlueLogic(
    blueAir: AircraftGroup,
    groups: AircraftGroup[],
    dataStyle: SensorType
  ): void

  /**
   * Update group's intent as required.
   *
   * A group can navigate based on desired locations (route of points) or
   * in the absense of location, will default to fly on a desired heading.
   *
   * Also serves purpose to 'apply' logic to each group as the animation
   * iterates through the groups.
   *
   * @param grp Group to check intent for
   * @param state Current state of canvas
   * @param dataStyle Current DataTrail type
   */
  abstract applyRedLogic(
    grp: AircraftGroup,
    state: PictureCanvasState,
    dataStyle: SensorType,
    resetCallback?: () => void
  ): void

  /**
   * For each group, check the intent of that group then move and turn as
   * appropriate to get to the next destination.
   *
   * A general animation algorithm, leaving it to the children AnimationHandlers
   * to implement decision making logic to modify and update the desired routing
   * and heading of each group.
   *
   * @param context Current drawing context
   * @param props PicCanvasProps for formatting
   * @param state Current state of canvas
   * @param groups the Groups to animate
   * @param animateCanvas a snapshot of canvas imagery
   * @param resetCallback optional function to perform at the end of animation
   */
  animate(
    props: PictureCanvasProps,
    state: PictureCanvasState,
    groups: AircraftGroup[],
    animateCanvas?: ImageData,
    resetCallback?: () => void
  ) {
    if (!state.blueAir || !animateCanvas) return
    PaintBrush.getContext().putImageData(animateCanvas, 0, 0)

    const { displaySettings } = props

    const { dataStyle } = displaySettings

    // For each group:
    //   - draw current arrows
    //   - 'move' drawn arrows based on current heading
    //   - turn towards the target heading (desired pt or heading)
    //   - apply decision-making logic
    for (const grp of groups) {
      grp.move()
      grp.draw(dataStyle)
      this.applyRedLogic(grp, state, dataStyle, resetCallback)
    }

    state.blueAir.move()
    this.applyBlueLogic(state.blueAir, groups, dataStyle)
    state.blueAir.draw(dataStyle)

    const speedSliderVal = (
      document
        .getElementById("speedSlider")
        ?.getElementsByTagName("input")[0] as HTMLInputElement
    ).value

    const speedSliderValue = parseInt(speedSliderVal)

    console.log(speedSliderValue)
    // delay is proportion of 5000ms based on current slider setting
    const delay = 5000 * ((100 - speedSliderValue + 1) / 100)

    // use the sleep utility to create a new Promise with an animation function call
    if (this.continueAnimate) {
      const binding = this.animate.bind(this)
      const slpObj = sleep(delay, () => {
        binding(props, state, groups, animateCanvas, resetCallback)
      })

      this.setSleepCancel(slpObj.cancel)
    }
  }
}
