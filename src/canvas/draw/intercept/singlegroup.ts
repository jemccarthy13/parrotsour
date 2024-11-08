import { BlueAir } from "../../../classes/aircraft/blueair"
import { Braaseye } from "../../../classes/braaseye"
import { AircraftGroup } from "../../../classes/groups/group"
import { GroupFactory } from "../../../classes/groups/groupfactory"
import { Point } from "../../../classes/point"
import { PIXELS_TO_NM } from "../../../utils/math"
import { FightAxis } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import { DrawPic } from "./drawpic"
import { getStartPos, PictureInfo } from "./pictureclamp"

export default class DrawSingleGroup extends DrawPic {
  create(): DrawPic {
    return new DrawSingleGroup()
  }

  /**
   * @returns # of groups in this picture
   */
  chooseNumGroups = (): void => {
    this.numGroupsToCreate = 1
  }

  /**
   * Create a single group for this picture
   * @param ctx Current drawing context
   * @param props Canvas props
   * @param state Canvas state
   * @param startPos Start position for the picture
   * @param desiredNumContacts # contacts in pic or 0 for random #
   * @returns Array of AircraftGroup
   */
  createGroups = (startPos: Point, contactList: number[]): AircraftGroup[] => {
    const sg = GroupFactory.randomGroupAtLoc(
      this.props,
      this.state,
      startPos,
      undefined,
      contactList[0]
    )

    sg.setLabel("SINGLE GROUP")

    return [sg]
  }

  getPictureInfo = (start?: Point): PictureInfo => {
    return {
      deep: -1,
      wide: -1,
      start: getStartPos(
        BlueAir.get(),
        this.props.orientation.orient,
        this.props.dataStyle,
        {
          wide: 7 * PIXELS_TO_NM,
          deep: 7 * PIXELS_TO_NM,
          start,
        }
      ),
    }
  }

  drawInfo = (): void => {
    const sg = this.groups[0]
    const isNS = FightAxis.isNS(this.props.orientation.orient)

    const bluePos = BlueAir.get().getCenterOfMass(this.props.dataStyle)

    let offsetX = 0
    let offsetY = 0

    if (isNS) {
      offsetX = -60
      offsetY = 40
    }

    const sgPos = sg.getCenterOfMass(this.props.dataStyle)

    PaintBrush.drawAltitudes(sgPos, sg.getAltitudes(), offsetX, offsetY)

    sg.setBraaseye(new Braaseye(sgPos, bluePos))

    sg.getBraaseye().draw(
      this.props.showMeasurements,
      this.props.braaFirst,
      offsetX,
      offsetY
    )
  }

  formatDimensions(): string {
    return ""
  }
  formatPicTitle(): string {
    return "SINGLE GROUP"
  }
  applyLabels(): void {
    throw new Error("applyLabels to single group has no effect")
  }

  formatWeighted(): string {
    return ""
  }

  getAnswer = (): string => {
    const sg = this.groups[0]

    sg.setUseBull(true)

    return sg.format(this.props.format).replace(/\s+/g, " ").trim()
  }
}
