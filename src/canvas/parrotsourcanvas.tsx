import React, { ReactElement } from "react"
import { AnimationHandler } from "../animation/handler"
import { PicAnimationHandler } from "../animation/intercept"
import {
  PictureAnswer,
  PictureCanvasProps,
  PictureCanvasState,
} from "../canvas/canvastypes"
import DrawingCanvas from "../canvas/drawingcanvas"
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
    const oldAnimate = prevProps.animate
    const { animate } = this.props

    if (oldAnimate !== animate) {
      const { animate, resetCallback } = this.props
      const { animateCanvas, answer } = this.state

      if (PaintBrush.getContext()) {
        if (animate) {
          if (animateCanvas) {
            this.animationHandler.continueAnimate = true
            this.animationHandler.animate(
              this.props,
              this.state,
              answer.groups,
              animateCanvas,
              resetCallback
            )
          }
        } else {
          this.animationHandler.pauseFight()
          const { answer } = this.state

          PaintBrush.drawFullInfo(this.state, this.props, answer.groups)
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
      orientation,
      braaFirst,
      picType,
      showMeasurements,
      isHardMode,
      newPic,
      resetCallback,
      animateCallback,
      animate,
      dataStyle,
    } = this.props
    const { answer } = this.state

    return (
      <DrawingCanvas
        answer={answer}
        draw={this.draw}
        orientation={orientation}
        braaFirst={braaFirst}
        picType={picType}
        showMeasurements={showMeasurements}
        isHardMode={isHardMode}
        newPic={newPic}
        resetCallback={resetCallback}
        animate={animate}
        animateCallback={animateCallback}
        dataStyle={dataStyle}
      />
    )
  }
}
