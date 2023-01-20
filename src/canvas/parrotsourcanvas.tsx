import React, { ReactElement } from "react"
import { AnimationHandler } from "../animation/handler"
import { PicAnimationHandler } from "../animation/intercept"
import {
  PictureAnswer,
  PictureCanvasProps,
  PictureCanvasState,
} from "../canvas/canvastypes"
import DrawingCanvas from "../canvas/drawingcanvas"
import { AircraftGroup } from "../classes/groups/group"
import { Point } from "../classes/point"
import { PaintBrush } from "./draw/paintbrush"

/**
 * This component is the main Component for PS Canvases.
 */
export default abstract class ParrotSourCanvas extends React.PureComponent<
  PictureCanvasProps,
  PictureCanvasState
> {
  constructor(props: PictureCanvasProps) {
    super(props)
    this.state = {
      bullseye: Point.DEFAULT,
      blueAir: new AircraftGroup(),
      reDraw: (): PictureAnswer => {
        throw new Error("Should not use parent reDraw")
      },
      answer: { pic: "", groups: [] },
    }
    this.animationHandler = new PicAnimationHandler()
  }

  /**
   * This lifecycle function serves as a check to make sure the only props
   * value that changed is the animation value (i.e. button pressed) so the
   * animation is not re-triggered when any other prop value changes
   * @param prevProps - previous set of PicCanvasProps
   */
  componentDidUpdate = (prevProps: PictureCanvasProps): void => {
    this._componentDidUpdate(prevProps)
  }

  checkAnimate = (prevProps: PictureCanvasProps): void => {
    const oldAnimate = prevProps.animationSettings.isAnimate
    const { animationSettings, animationHandlers } = this.props
    const { isAnimate } = animationSettings
    const { pauseAnimate } = animationHandlers

    if (oldAnimate !== isAnimate) {
      const { animateCanvas, answer } = this.state

      if (PaintBrush.getContext()) {
        if (isAnimate) {
          if (animateCanvas) {
            this.animationHandler.continueAnimate = true
            this.animationHandler.animate(
              this.props,
              this.state,
              answer.groups,
              animateCanvas,
              pauseAnimate
            )
          }
        } else {
          this.animationHandler.pauseFight()
          const { answer, blueAir, bullseye } = this.state
          const { displaySettings, showMeasurements } = this.props

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
    }
  }

  // Expose lifecycle to subclass
  _componentDidUpdate = (prevProps: PictureCanvasProps): void => {
    this.checkAnimate(prevProps)
  }

  animationHandler: AnimationHandler

  draw = async (): Promise<void> => {
    return undefined
  }

  render(): ReactElement {
    const {
      displaySettings,
      showMeasurements,
      isHardMode,
      newPic,
      picType,
      animationSettings,
      animationHandlers,
    } = this.props
    const { bullseye, answer } = this.state

    return (
      <DrawingCanvas
        displaySettings={displaySettings}
        animationSettings={animationSettings}
        animationHandlers={animationHandlers}
        answer={answer}
        draw={this.draw}
        bullseye={bullseye}
        picType={picType}
        showMeasurements={showMeasurements}
        isHardMode={isHardMode}
        newPic={newPic}
      />
    )
  }
}
