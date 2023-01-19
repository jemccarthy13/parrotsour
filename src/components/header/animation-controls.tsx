/* eslint-disable react/jsx-handler-names */
import React, { useCallback } from "react"
import { Cookies } from "react-cookie-consent"
import {
  AnimationHandlers,
  AnimationSettings,
} from "../../hooks/use-animation-settings"
import { SliderCookie } from "../../utils/cookie-constants"
import { Slider, Button } from "../../utils/muiadapter"

export type AnimationControlsProps = {
  handlers: AnimationHandlers
  settings: AnimationSettings
}

/**
 * 'Basic' controls for the ParrotSour animation.
 *
 * Includes:
 * - Play/Pause
 * - Speed Slider
 */
export const AnimationControls = (props: AnimationControlsProps) => {
  const { handlers, settings } = props

  const { startAnimate, pauseAnimate, onSliderChange } = handlers
  const { speedSliderValue } = settings

  /**
   * Called when the slider changes speed
   * @param evt - a ChangeEvent containing the new speed value
   */
  const handleSpeedSliderChange = useCallback(
    (_evt: Event, value: number | number[]): void => {
      const val = Array.isArray(value) ? value[0] : value

      onSliderChange(val)
    },
    []
  )

  const handleSpeedSliderMouseUp = useCallback(() => {
    Cookies.set(SliderCookie, speedSliderValue)
  }, [speedSliderValue])

  return (
    <div style={{ marginBottom: "16px" }}>
      <Button
        id="fightsOnBtn"
        sx={{
          width: "12%",
          marginRight: "1%",
        }}
        onClick={startAnimate}
      >
        Fights On
      </Button>
      <Button id="pauseBtn" sx={{ width: "12%" }} onClick={pauseAnimate}>
        Pause
      </Button>
      <div
        style={{
          display: "inline-flex",
          paddingLeft: "16px",
          width: "40%",
        }}
      >
        <label htmlFor="speedSlider"> Animation Speed: </label>
        <Slider
          min={1}
          max={100}
          value={speedSliderValue}
          id="speedSlider"
          onChange={handleSpeedSliderChange}
          onMouseUp={handleSpeedSliderMouseUp}
        />
      </div>
    </div>
  )
}

export default AnimationControls
