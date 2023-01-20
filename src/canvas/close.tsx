/* istanbul ignore file */
import { CloseAnimationHandler } from "../animation/close"
import { SensorType } from "../classes/aircraft/datatrail/sensortype"
import { IDMatrix } from "../classes/aircraft/id"
import { AircraftGroup } from "../classes/groups/group"
import { randomNumber } from "../utils/math"
import {
  BlueInThe,
  PictureAnswer,
  PictureCanvasState,
  PictureCanvasProps,
} from "./canvastypes"
import { PaintBrush } from "./draw/paintbrush"
import ParrotSourCanvas from "./parrotsourcanvas"

/**
 * This component is the main control for drawing 1v1 close control intercepts.
 *
 * To implement a new [yourtype]Canvas, extend ParrotSourCanvas.
 * Provide a new AnimationHandler in the constructor, and provide a
 * new 'draw' function that handles the drawing.
 */
export default class CloseCanvas extends ParrotSourCanvas {
  /**
   * Construct a new close canvas
   * @param props Props for a PS Canvas
   */
  constructor(props: PictureCanvasProps) {
    super(props)
    this.animationHandler = new CloseAnimationHandler()
  }

  /**
   * On dataStyle change only re-draw the current picture.
   */
  componentDidUpdate = (prevProps: PictureCanvasProps): void => {
    this._componentDidUpdate(prevProps)
    let animateImage = undefined
    const ctx = PaintBrush.getContext()

    const {
      displaySettings: prevDisplaySettings,
      showMeasurements: prevShowMeasurements,
    } = prevProps
    const {
      displaySettings: curDisplaySettings,
      showMeasurements: curShowMeasurements,
    } = this.props

    const { dataStyle: curDatastyle, isBraaFirst: curIsBraaFirst } =
      curDisplaySettings
    const { dataStyle: prevDataStyle, isBraaFirst: prevIsBraaFirst } =
      prevDisplaySettings

    const { orient: prevOrient } = prevDisplaySettings.canvasConfig
    const { orient: curOrient } = curDisplaySettings.canvasConfig

    if (prevOrient !== curOrient) {
      this.props.animationHandlers.pauseAnimate()
    }

    if (
      prevDataStyle !== curDatastyle ||
      prevShowMeasurements !== curShowMeasurements ||
      prevIsBraaFirst !== curIsBraaFirst
    ) {
      if (this.props.animationSettings.isAnimate) {
        this.animationHandler.pauseFight()
      }
      PaintBrush.clearCanvas()
      PaintBrush.drawBullseye(this.state.bullseye)
      animateImage = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)

      this.state.answer.groups.forEach((grp) => {
        grp.draw(curDatastyle)
      })
      this.state.blueAir.draw(curDatastyle)

      PaintBrush.drawFullInfo(
        this.state.blueAir,
        this.state.bullseye,
        this.state.answer.groups,
        this.props.displaySettings.dataStyle,
        this.props.displaySettings.isBraaFirst,
        this.props.showMeasurements
      )

      if (this.props.animationSettings.isAnimate) {
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
   * @param _forced true iff picture type should be forced as random, !lead edge and !packages
   * @param _start (optional) start position for the picture
   */
  drawPicture = (): PictureAnswer => {
    const context = PaintBrush.getContext()
    let xPos = context.canvas.width - 20
    let yPos = randomNumber(
      context.canvas.height * 0.33,
      context.canvas.height * 0.66
    )
    let heading = 270

    const { orient } = this.props.displaySettings.canvasConfig

    if (orient === BlueInThe.NORTH) {
      xPos = randomNumber(
        context.canvas.width * 0.33,
        context.canvas.width * 0.66
      )
      yPos = 20
      heading = 180
    }

    const fighter = new AircraftGroup({
      sx: xPos,
      sy: yPos,
      hdg: heading,
      nContacts: 1,
      id: IDMatrix.FRIEND,
    })

    fighter.setLabel("VR01")
    fighter.draw(SensorType.RAW)

    const target = new AircraftGroup({
      sx: 500,
      sy: 200,
      hdg: 90,
      nContacts: 1,
      id: IDMatrix.FRIEND,
    })

    target.draw(SensorType.RAW)
    target.setLabel("VR02")

    const ftrPos = fighter.getCenterOfMass(SensorType.RAW)

    PaintBrush.drawAltitudes(ftrPos, fighter.getAltitudes())
    PaintBrush.drawText(fighter.getLabel(), ftrPos.x, ftrPos.y + 35, 12)

    const grpPos = target.getCenterOfMass(SensorType.RAW)

    PaintBrush.drawAltitudes(grpPos, target.getAltitudes())
    PaintBrush.drawText(target.getLabel(), grpPos.x, grpPos.y + 35, 12)

    return {
      pic: "",
      groups: [target, fighter],
    }
  }

  /**
   * Draw function to be called from the Canvas component - handles pre-picture logic
   * (i.e. blue arrows, bullseye, and image 'snap' for mouse draw)
   * @param context the Context to draw in
   */
  draw = async (): Promise<void> => {
    const bullseye = PaintBrush.drawBullseye()

    const blueAir = new AircraftGroup({ sx: -1000, sy: -1000, nContacts: 0 })

    await this.setState({ blueAir, bullseye })

    const ctx = PaintBrush.getContext()
    const blueOnly = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)

    const answer: PictureAnswer = this.drawPicture()

    this.props.setAnswer(answer)

    this.setState({ answer, animateCanvas: blueOnly })
  }

  state: PictureCanvasState = {
    ...this.state,
    reDraw: this.drawPicture,
  }
}
