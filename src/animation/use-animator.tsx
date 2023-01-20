import { useCallback, useState } from "react"
import { PaintBrush } from "../canvas/draw/paintbrush"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { AircraftGroup } from "../classes/groups/group"
import { AnimationSettings } from "../hooks/use-animation-settings"
import { DisplaySettings } from "../hooks/use-display-settings"
import { sleep } from "../utils/time"

type IAnimator = {
  applyBlueLogic(
    blueAir: AircraftGroup,
    groups: AircraftGroup[],
    dataStyle: SensorType
  ): void
  applyRedLogic(
    grp: AircraftGroup,
    blueAir: AircraftGroup,
    dataStyle: SensorType,
    pauseCallback: () => void
  ): void
  pauseCallback: () => void
}

export type Animator = {
  startAnimation: (
    groups: AircraftGroup[],
    blueAir: AircraftGroup,
    displaySettings: DisplaySettings,
    animationSettings: AnimationSettings,
    animateCanvas?: ImageData
  ) => void
  pauseAnimation: () => void
  isAnimate: boolean
}

export function useAnimator({
  applyBlueLogic,
  applyRedLogic,
  pauseCallback,
}: IAnimator): Animator {
  const [isAnimate, setAnimate] = useState<boolean>(false)
  const [sleepCancel, setSleepCancel] = useState<() => void>(() => {
    console.warn("AnimationHandler has nothing to cancel.")
  })

  /**
   * Pause the fight by canceling the sleep timeout.
   * This kills the pseudo-recursion found in doAnimation,
   * and the pauseCallback() call performs any post-pause
   * processing (i.e. drawing BRAASEYE for intercept canvas)
   * @param pauseCallback Function to call after the animation has been cancelled
   */
  function pause() {
    if (sleepCancel) sleepCancel()
    if (pauseCallback) {
      pauseCallback()
    }
    setAnimate(false)
  }

  function animate(
    groups: AircraftGroup[],
    blueAir: AircraftGroup,
    displaySettings: DisplaySettings,
    animationSettings: AnimationSettings,
    animateCanvas?: ImageData
  ) {
    if (!blueAir || !animateCanvas) return
    PaintBrush.getContext().putImageData(animateCanvas, 0, 0)

    const { dataStyle } = displaySettings
    const { speedSliderValue } = animationSettings

    // For each group:
    //   - draw current arrows
    //   - 'move' drawn arrows based on current heading
    //   - turn towards the target heading (desired pt or heading)
    //   - apply decision-making logic
    for (const grp of groups) {
      grp.move()
      grp.draw(dataStyle)
      applyRedLogic(grp, blueAir, dataStyle, pause)
    }

    blueAir.move()
    applyBlueLogic(blueAir, groups, dataStyle)
    blueAir.draw(dataStyle)

    // delay is proportion of 5000ms based on current slider setting
    const delay = 5000 * ((100 - speedSliderValue + 1) / 100)

    console.log("isAn", isAnimate)
    // use the sleep utility to create a new Promise with an animation function call
    if (isAnimate) {
      const slpObj = sleep(delay, () => {
        animate(
          groups,
          blueAir,
          displaySettings,
          animationSettings,
          animateCanvas
        )
      })

      setSleepCancel(slpObj.cancel)
    }
  }

  async function startAnimation(
    groups: AircraftGroup[],
    blueAir: AircraftGroup,
    displaySettings: DisplaySettings,
    animationSettings: AnimationSettings,
    animateCanvas?: ImageData
  ) {
    await setAnimate(true)
    setAnimate(true)

    animate(groups, blueAir, displaySettings, animationSettings, animateCanvas)
  }

  return { startAnimation, pauseAnimation: pause, isAnimate }
}
