import { Braaseye } from "../../../classes/braaseye"
import { AircraftGroup } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import {
  PIXELS_TO_NM,
  randomHeading,
  randomNumber,
} from "../../../utils/psmath"
import { FightAxis } from "../../canvastypes"
import { getOpenCloseAzimuth } from "../formatutils"
import { PaintBrush } from "../paintbrush"
import { DrawPic } from "./drawpic"
import { getRestrictedStartPos, PictureInfo } from "./pictureclamp"

export default class DrawVic extends DrawPic {
  create(): DrawPic {
    return new DrawVic()
  }

  chooseNumGroups(): void {
    this.numGroupsToCreate = 3
  }

  getPictureInfo(start?: Point): PictureInfo {
    const picture = {
      start,
      wide: randomNumber(7 * PIXELS_TO_NM, 30 * PIXELS_TO_NM),
      deep: randomNumber(7 * PIXELS_TO_NM, 30 * PIXELS_TO_NM),
    }
    const startPos = getRestrictedStartPos(
      this.state.blueAir,
      this.props.orientation.orient,
      this.props.dataStyle,
      45 + picture.deep,
      100,
      picture
    )
    picture.start = startPos
    return picture
  }

  createGroups = (startPos: Point, contactList: number[]): AircraftGroup[] => {
    const { format, isHardMode } = this.props
    const { blueAir } = this.state

    const isNS = FightAxis.isNS(this.props.orientation.orient)
    // start with trail groups (because clamp)
    let sx = startPos.x
    let sy = startPos.y
    let heading: number = randomHeading(format, blueAir.getHeading())
    const ntg = new AircraftGroup({
      sx,
      sy,
      hdg: heading + randomNumber(-10, 10),
      nContacts: contactList[0],
    })

    if (isHardMode) heading = randomHeading(format, blueAir.getHeading())

    if (isNS) {
      sx = startPos.x + this.wide
    } else {
      sy = startPos.y + this.wide
    }
    const stg = new AircraftGroup({
      sx,
      sy,
      hdg: heading + randomNumber(-10, 10),
      nContacts: contactList[1],
    })

    if (isHardMode) heading = randomHeading(format, blueAir.getHeading())
    if (isNS) {
      sx = startPos.x + this.wide / 2
      sy = startPos.y - this.deep
    } else {
      sx = startPos.x + this.deep
      sy = startPos.y + this.wide / 2
    }
    const lg = new AircraftGroup({
      sx,
      sy,
      hdg: heading,
      nContacts: contactList[2],
    })

    return [lg, ntg, stg]
  }

  drawInfo(): void {
    const { dataStyle, showMeasurements, braaFirst } = this.props
    const { blueAir, bullseye } = this.state
    const isNS = FightAxis.isNS(this.props.orientation.orient)

    const lg = this.groups[0]
    const ntg = this.groups[1]
    const stg = this.groups[2]

    const ntgPos = ntg.getCenterOfMass(dataStyle)
    const stgPos = stg.getCenterOfMass(dataStyle)
    const lgPos = lg.getCenterOfMass(dataStyle)
    const bluePos = blueAir.getCenterOfMass(dataStyle)

    let offsetX = 0
    let dPt = new Point(stgPos.x, lgPos.y)
    let wPt = new Point(stgPos.x, ntgPos.y)
    if (isNS) {
      offsetX = -70
      dPt = new Point(lgPos.x, stgPos.y)
      wPt = new Point(ntgPos.x, stgPos.y)
    }

    const realDepth = dPt.getBR(lgPos).range
    const realWidth = wPt.getBR(stgPos).range
    this.deep = realDepth
    this.wide = realWidth
    PaintBrush.drawMeasurement(lgPos, dPt, realDepth, showMeasurements)
    PaintBrush.drawMeasurement(stgPos, wPt, realWidth, showMeasurements)

    PaintBrush.drawAltitudes(lgPos, lg.getAltitudes())
    PaintBrush.drawAltitudes(stgPos, stg.getAltitudes())
    PaintBrush.drawAltitudes(ntgPos, ntg.getAltitudes(), offsetX)

    lg.setBraaseye(new Braaseye(lgPos, bluePos, bullseye))
    stg.setBraaseye(new Braaseye(stgPos, bluePos, bullseye))
    ntg.setBraaseye(new Braaseye(ntgPos, bluePos, bullseye))

    lg.getBraaseye().draw(showMeasurements, braaFirst)
    stg.getBraaseye().draw(showMeasurements, braaFirst)
    ntg.getBraaseye().draw(showMeasurements, braaFirst, offsetX)
  }

  formatPicTitle(): string {
    return "3 GROUP VIC"
  }

  formatDimensions(): string {
    return this.deep + " DEEP, " + this.wide + " WIDE"
  }

  formatWeighted(): string {
    // nothing
    let answer = ""
    const { dataStyle } = this.props
    const lgPos = this.groups[0].getCenterOfMass(dataStyle)
    const ntgPos = this.groups[1].getCenterOfMass(dataStyle)
    const stgPos = this.groups[2].getCenterOfMass(dataStyle)

    if (new Point(lgPos.x, ntgPos.y).getBR(lgPos).range < this.wide / 3) {
      answer +=
        " WEIGHTED " +
        this.groups[1].getLabel().replace("TRAIL GROUP", "") +
        ", "
    } else if (
      new Point(lgPos.x, stgPos.y).getBR(lgPos).range <
      this.wide / 3
    ) {
      answer +=
        " WEIGHTED " +
        this.groups[2].getLabel().replace("TRAIL GROUP", "") +
        ", "
    }

    return answer
  }

  applyLabels(): void {
    const isNS = FightAxis.isNS(this.props.orientation.orient)

    const lg = this.groups[0]
    const ntg = this.groups[1]
    const stg = this.groups[2]

    let nLbl = "NORTH"
    let sLbl = "SOUTH"
    if (isNS) {
      nLbl = "WEST"
      sLbl = "EAST"
    }
    lg.setLabel("LEAD GROUP")
    ntg.setLabel(nLbl + " TRAIL GROUP")
    stg.setLabel(sLbl + " TRAIL GROUP")

    if (!ntg.isAnchor) {
      const tmp = this.groups[1]
      this.groups[1] = this.groups[2]
      this.groups[2] = tmp
    }
  }

  getAnswer(): string {
    const { format } = this.props
    const ntg = this.groups[1]
    const stg = this.groups[2]

    this.checkAnchor(this.groups[1], this.groups[2])
    this.applyLabels()

    let answer = this.formatPicTitle() + " "
    answer += this.formatDimensions() + " "

    answer += getOpenCloseAzimuth(ntg, stg) + ", "

    answer += this.formatWeighted() + " "

    // TODO -- SPEED -- Opening/closing pic with range component

    answer += this.picTrackDir() + " "

    this.groups[0].setAnchor(true)

    this.groups.forEach((grp) => {
      answer += grp.format(format) + " "
    })

    return answer.replace(/\s+/g, " ").trim()
  }
}
