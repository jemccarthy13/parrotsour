import { useCallback, useState } from "react"
import { PictureAnswer } from "../canvas/canvastypes"
import { SliderCookie } from "../utils/cookie-constants"
import { useCookieNumber } from "./use-cookie"

export type AnimationSettings = {
  speedSliderValue: number
  isAnimate: boolean
}

export type AnimationHandlers = {
  onSliderChange: (num: number) => void
  //   setAnimate: React.Dispatch<React.SetStateAction<boolean>>
  startAnimate: () => void
  pauseAnimate: () => void
}

export function useAnimationSettings(answer: PictureAnswer): {
  state: AnimationSettings
  handlers: AnimationHandlers
} {
  const [isAnimate, setAnimate] = useState(false)

  const { cookieValue: speedSliderValue, setCookie: setSpeedSliderValue } =
    useCookieNumber(SliderCookie)

  /**
   * Called when the PSControls slider value is changed
   * @param value - new speed of the slider
   */
  const onSliderChange = useCallback((value: number): void => {
    setSpeedSliderValue(value)
  }, [])

  /**
   * Called to start the animation
   */
  const startAnimate = useCallback(() => {
    answer.groups.forEach((grp) => grp.setCapping(false))
    setAnimate(true)
  }, [answer.groups])

  /**
   * Called to pause the animation
   */
  const pauseAnimate = useCallback((): void => {
    setAnimate(false)
  }, [])

  return {
    state: {
      speedSliderValue,
      isAnimate,
    },
    handlers: {
      onSliderChange,
      //   setAnimate,
      startAnimate,
      pauseAnimate,
    },
  }
}
