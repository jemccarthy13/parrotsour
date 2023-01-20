import React, { useCallback, useEffect, useState } from "react"
import { IDMatrix } from "../classes/aircraft/id"
import { AircraftGroup } from "../classes/groups/group"
import { Point } from "../classes/point"
import { randomNumber } from "../utils/math"
import { BlueInThe, PicCanvasProps, PictureAnswer } from "./canvastypes"
import { DrawPic } from "./draw/intercept/drawpic"
import { PictureFactory } from "./draw/intercept/picturefactory"
import { PaintBrush } from "./draw/paintbrush"
import { PSCanvas } from "./pscanvas"

/**
 * This component is the main control for drawing pictures for intercepts.
 *
 * To implement a new [yourtype]Canvas, extend ParrotSourCanvas.
 * Provide a new AnimationHandler in the constructor, and provide a
 * new 'draw' function that handles the drawing.
 */
export const PictureCanvas = (props: PicCanvasProps) => {
  const {
    isHardMode,
    picType,
    displaySettings,
    showMeasurements,
    answer,
    setAnswer,
    newPic,
  } = props
  const { canvasConfig } = displaySettings

  const { animator, animationSettings, animationHandlers, reDraw } = props

  const { pauseAnimation, startAnimation, isAnimate } = animator

  const [blueAir, setBlueAir] = useState<AircraftGroup>(new AircraftGroup())
  const [bullseye, setBullseye] = useState<Point>(Point.DEFAULT)
  const [animateCanvas, setAnimateCanvas] = useState<ImageData>()

  console.log(picType)

  useEffect(() => {
    console.log("will animate", answer.groups)
    if (animationSettings.isAnimate) {
      console.log("animating?", answer.groups, blueAir)
      startAnimation(
        answer.groups,
        blueAir,
        displaySettings,
        animationSettings,
        animateCanvas
      )
    }
  }, [animationSettings.isAnimate, answer.groups, blueAir])

  // if hard mode, pic type, or canvas orientation change, need to pause simulation
  // and reset with a new picture
  useEffect(() => {
    pauseAnimation()
  }, [isHardMode, picType, canvasConfig.orient, pauseAnimation])

  useEffect(() => {
    const ctx = PaintBrush.getContext()

    const wasAnimationOn = Boolean(isAnimate)

    if (wasAnimationOn) {
      pauseAnimation()
    }

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    PaintBrush.drawBullseye(bullseye)

    const animateImage = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    )

    setAnimateCanvas(animateImage)

    answer.groups.forEach((grp) => {
      grp.draw(displaySettings.dataStyle)
    })
    blueAir.draw(displaySettings.dataStyle)

    PaintBrush.drawFullInfo(
      blueAir,
      bullseye,
      answer.groups,
      displaySettings.dataStyle,
      displaySettings.isBraaFirst,
      showMeasurements
    )

    if (wasAnimationOn) {
      startAnimation(
        answer.groups,
        blueAir,
        displaySettings,
        animationSettings,
        // props.animateCanvas
        animateImage
      )
    }
  }, [displaySettings.dataStyle, showMeasurements, displaySettings.isBraaFirst])

  /**
   * Perform a picture draw on the drawing context using the correct DrawFunction
   *
   * @param context The context of the v
   * @param forced true iff picture type should be forced as random, !lead edge and !packages
   * @param start (optional) start position for the picture
   */
  const drawPicture = useCallback(
    (
      bullseye: Point,
      picType: string,
      forced?: boolean,
      start?: Point
    ): PictureAnswer => {
      const { desiredNumContacts } = props

      const drawFunc: DrawPic = PictureFactory.getPictureDraw(
        picType,
        desiredNumContacts,
        forced
      )

      drawFunc.initialize(props, { blueAir, bullseye, answer, reDraw })

      const newAnswer = drawFunc.draw(
        picType === "cap",
        desiredNumContacts,
        start
      )

      const bluePos = blueAir.getCenterOfMass(displaySettings.dataStyle)

      blueAir.updateIntent({
        desiredHeading: bluePos.getBR(
          newAnswer.groups[0].getCenterOfMass(displaySettings.dataStyle)
        ).bearingNum,
      })

      newAnswer.groups.forEach((grp) => {
        const grpPos = grp.getCenterOfMass(displaySettings.dataStyle)
        const bearingToBlue = grpPos.getBR(bluePos).bearingNum

        grp.updateIntent({
          desiredHeading: Math.round(bearingToBlue / 90.0) * 90,
        })
      })

      setAnswer(newAnswer)

      console.log(newAnswer)
      return newAnswer
    },
    [bullseye]
  )

  /**
   * Draw function to be called from the Canvas component - handles pre-picture logic
   * (i.e. blue arrows, bullseye, and image 'snap' for mouse draw)
   * @param context the Context to draw in
   */
  const draw = useCallback(async (): Promise<void> => {
    const newBullseye = PaintBrush.drawBullseye()

    const ctx = PaintBrush.getContext()
    let xPos = ctx.canvas.width - 20
    let yPos = randomNumber(ctx.canvas.height * 0.33, ctx.canvas.height * 0.66)
    let heading = 270

    const { displaySettings } = props
    const { canvasConfig, dataStyle } = displaySettings

    if (canvasConfig.orient === BlueInThe.NORTH) {
      xPos = randomNumber(ctx.canvas.width * 0.33, ctx.canvas.width * 0.66)
      yPos = 20
      heading = 180
    }

    const blueAir = new AircraftGroup({
      sx: xPos,
      sy: yPos,
      hdg: heading,
      nContacts: 4,
      id: IDMatrix.FRIEND,
    })

    setBlueAir(blueAir)
    setBullseye(newBullseye)

    const blueOnly = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)

    const answer: PictureAnswer = drawPicture(newBullseye, picType)

    setAnswer(answer)

    blueAir.draw(dataStyle)

    setAnimateCanvas(blueOnly)
  }, [picType])

  return (
    <PSCanvas
      displaySettings={displaySettings}
      showMeasurements={showMeasurements}
      isHardMode={isHardMode}
      newPic={newPic}
      picType={picType}
      bullseye={bullseye}
      answer={answer}
      animateCanvas={animateCanvas}
      blueAir={blueAir}
      animationSettings={animationSettings}
      animationHandlers={animationHandlers}
      reDraw={reDraw}
      draw={draw}
      animator={animator}
    />
  )
}

export default PictureCanvas
