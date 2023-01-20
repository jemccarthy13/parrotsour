import { IDMatrix } from "../classes/aircraft/id"
import { AircraftGroup } from "../classes/groups/group"
import { Point } from "../classes/point"
import { randomNumber } from "../utils/math"
import {
  BlueInThe,
  PictureAnswer,
  PictureCanvasProps,
  PictureCanvasState,
} from "./canvastypes"
import { DrawPic } from "./draw/intercept/drawpic"
import { PictureFactory } from "./draw/intercept/picturefactory"
import { PaintBrush } from "./draw/paintbrush"
import ParrotSourCanvas from "./parrotsourcanvas"

/**
 * This component is the main control for drawing pictures for intercepts.
 *
 * To implement a new [yourtype]Canvas, extend ParrotSourCanvas.
 * Provide a new AnimationHandler in the constructor, and provide a
 * new 'draw' function that handles the drawing.
 */
export default class PictureCanvas extends ParrotSourCanvas {
  /**
   * On dataStyle change only re-draw the current picture.
   */
  componentDidUpdate = (prevProps: PictureCanvasProps): void => {
    this._componentDidUpdate(prevProps)
    let animateImage = undefined
    const ctx = PaintBrush.getContext()

    const {
      displaySettings: prevDisplaySettings,
      isHardMode: prevIsHard,
      picType: prevPicType,
      showMeasurements: prevShowMeasurements,
    } = prevProps
    const {
      displaySettings: curDisplaySettings,
      isHardMode,
      picType,
      showMeasurements,
    } = this.props

    const prevOrientation = prevDisplaySettings.canvasConfig.orient
    const curOrientation = curDisplaySettings.canvasConfig.orient

    if (
      prevIsHard !== isHardMode ||
      prevOrientation !== curOrientation ||
      prevPicType !== picType
    ) {
      this.props.animationHandlers.pauseAnimate()
    }

    if (
      prevDisplaySettings.dataStyle !== curDisplaySettings.dataStyle ||
      prevShowMeasurements !== showMeasurements ||
      prevDisplaySettings.isBraaFirst !== curDisplaySettings.isBraaFirst
    ) {
      if (this.props.animationSettings.isAnimate) {
        this.animationHandler.pauseFight()
      }
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      PaintBrush.drawBullseye(this.state.bullseye)
      animateImage = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)

      this.state.answer.groups.forEach((grp) => {
        grp.draw(this.props.displaySettings.dataStyle)
      })
      this.state.blueAir.draw(this.props.displaySettings.dataStyle)

      PaintBrush.drawFullInfo(
        this.state.blueAir,
        this.state.bullseye,
        this.state.answer.groups,
        this.props.displaySettings.dataStyle,
        this.props.displaySettings.isBraaFirst,
        this.props.showMeasurements
      )

      if (
        this.props.animationSettings.isAnimate ===
          prevProps.animationSettings.isAnimate &&
        prevProps.animationSettings.isAnimate === true
      ) {
        this.animationHandler.animate(
          this.props,
          this.state,
          this.state.answer.groups,
          animateImage,
          this.props.animationHandlers.pauseAnimate
        )
      }
    }
  }

  /**
   * Perform a picture draw on the drawing context using the correct DrawFunction
   *
   * @param context The context of the v
   * @param forced true iff picture type should be forced as random, !lead edge and !packages
   * @param start (optional) start position for the picture
   */
  drawPicture = (forced?: boolean, start?: Point): PictureAnswer => {
    const { picType } = this.props
    const { desiredNumContacts } = this.props

    const drawFunc: DrawPic = PictureFactory.getPictureDraw(
      picType,
      desiredNumContacts,
      forced
    )

    drawFunc.initialize(this.props, this.state)

    const answer = drawFunc.draw(picType === "cap", desiredNumContacts, start)

    const { blueAir } = this.state
    const { dataStyle } = this.props.displaySettings
    const bluePos = blueAir.getCenterOfMass(dataStyle)

    blueAir.updateIntent({
      desiredHeading: bluePos.getBR(answer.groups[0].getCenterOfMass(dataStyle))
        .bearingNum,
    })

    answer.groups.forEach((grp) => {
      const grpPos = grp.getCenterOfMass(dataStyle)
      const bearingToBlue = grpPos.getBR(bluePos).bearingNum

      grp.updateIntent({
        desiredHeading: Math.round(bearingToBlue / 90.0) * 90,
      })
    })

    return answer
  }

  /**
   * Draw function to be called from the Canvas component - handles pre-picture logic
   * (i.e. blue arrows, bullseye, and image 'snap' for mouse draw)
   * @param context the Context to draw in
   */
  draw = async (): Promise<void> => {
    const bullseye = PaintBrush.drawBullseye()

    const ctx = PaintBrush.getContext()
    let xPos = ctx.canvas.width - 20
    let yPos = randomNumber(ctx.canvas.height * 0.33, ctx.canvas.height * 0.66)
    let heading = 270

    const { displaySettings } = this.props
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

    await this.setState({ blueAir, bullseye })
    await this.setState({ blueAir, bullseye })

    const blueOnly = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)

    const answer: PictureAnswer = this.drawPicture()

    this.props.setAnswer(answer)

    blueAir.draw(dataStyle)

    this.setState({ answer, animateCanvas: blueOnly })
  }

  state: PictureCanvasState = {
    ...this.state,
    reDraw: this.drawPicture,
  }
}
