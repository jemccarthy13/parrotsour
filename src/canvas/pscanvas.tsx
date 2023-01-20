import React, { useEffect } from "react"
import { PSCanvasProps } from "./canvastypes"
import { PaintBrush } from "./draw/paintbrush"
import DrawingCanvas from "./drawingcanvas"

/**
 * This component a wrapper around the drawing canvas for drawing pictures
 */
export const PSCanvas = (props: PSCanvasProps) => {
  const { bullseye, blueAir, answer } = props

  const { draw } = props

  const { animator, animateCanvas } = props

  const { startAnimation, pauseAnimation, isAnimate } = animator

  const { displaySettings, animationSettings, animationHandlers } = props

  const { showMeasurements, isHardMode, newPic, picType } = props

  useEffect(() => {
    if (PaintBrush.getContext()) {
      if (isAnimate) {
        if (animateCanvas) {
          startAnimation(
            answer.groups,
            blueAir,
            displaySettings,
            animationSettings,
            animateCanvas
          )
        }
      } else {
        pauseAnimation()

        PaintBrush.drawFullInfo(
          blueAir,
          bullseye,
          answer.groups,
          displaySettings.dataStyle,
          displaySettings.isBraaFirst,
          showMeasurements
        )
      }
    }
  }, [isAnimate])

  return (
    <DrawingCanvas
      displaySettings={displaySettings}
      animationSettings={animationSettings}
      animationHandlers={animationHandlers}
      answer={answer}
      draw={draw}
      bullseye={bullseye}
      picType={picType}
      showMeasurements={showMeasurements}
      isHardMode={isHardMode}
      newPic={newPic}
    />
  )
}

export default PSCanvas
