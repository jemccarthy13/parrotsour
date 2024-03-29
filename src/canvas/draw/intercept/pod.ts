import { BlueAir } from "../../../classes/aircraft/blueair"
import { Braaseye } from "../../../classes/braaseye"
import { AircraftGroup } from "../../../classes/groups/group"
import { GroupFactory } from "../../../classes/groups/groupfactory"
import { Point } from "../../../classes/point"
import { PIXELS_TO_NM, randomNumber } from "../../../utils/math"
import { PaintBrush } from "../paintbrush"
import { DrawPic } from "./drawpic"
import { PictureInfo } from "./pictureclamp"

export default class DrawPOD extends DrawPic {
  create(): DrawPic {
    return new DrawPOD()
  }

  chooseNumGroups(): void {
    this.numGroupsToCreate = randomNumber(3, 11)
  }

  getPictureInfo(): PictureInfo {
    return {
      deep: 5 * PIXELS_TO_NM,
      wide: 5 * PIXELS_TO_NM,
      start: new Point(-1, -1),
    }
  }

  createGroups = (): AircraftGroup[] => {
    const groups = []

    for (let x = 0; x < this.numGroupsToCreate; x++) {
      groups.push(GroupFactory.randomGroup(this.props, this.state))
    }

    this.groups = groups

    return this.groups
  }

  drawInfo(): void {
    const bPos = BlueAir.get().getCenterOfMass(this.props.dataStyle)

    PaintBrush.drawText('"DARKSTAR, EAGLE01, PICTURE"', bPos.x - 200, 20)

    const { showMeasurements, braaFirst } = this.props

    this.groups.forEach((grp) => {
      const grpPos = grp.getCenterOfMass(this.props.dataStyle)

      grp.setBraaseye(new Braaseye(grpPos, bPos))
      grp.getBraaseye().draw(showMeasurements, braaFirst)
      PaintBrush.drawAltitudes(grpPos, grp.getAltitudes())
    })
  }

  applyLabels(): void {
    this.groups.forEach((grp) => {
      grp.setLabel("GROUP")
    })
  }

  formatWeighted(): string {
    return ""
  }
  formatPicTitle(): string {
    return "CORE"
  }
  formatDimensions(): string {
    return "CORE"
  }

  getAnswer(): string {
    const { dataStyle } = this.props

    this.applyLabels()

    function sortFun(a: AircraftGroup, b: AircraftGroup) {
      const bluePos = BlueAir.get().getCenterOfMass(dataStyle)
      const aBR = bluePos.getBR(a.getCenterOfMass(dataStyle))
      const bBR = bluePos.getBR(b.getCenterOfMass(dataStyle))

      return aBR.range > bBR.range ? 1 : -1
    }

    const closestGroups = this.groups.sort(sortFun).slice(0, 3)

    let response = ""

    if (this.groups.length === 1) {
      response += "SINGLE GROUP "
    } else {
      response += this.groups.length + " GROUPS, "
    }

    for (let z = 0; z < closestGroups.length; z++) {
      this.groups[z].setUseBull(true)
      response += this.groups[z].format(this.props.format)
      if (z != closestGroups.length - 1) {
        response += ", "
      }
    }
    response += "\r\n\r\nNote: This is core; there may be a better answer, "
    response += "but POD is intended to get you thinking about "
    response += "'what would you say if you saw...'"

    return response
  }
}
