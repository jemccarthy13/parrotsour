import { Braaseye } from "../../../classes/braaseye"
import { AircraftGroup } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { PIXELS_TO_NM, randomHeading, randomNumber } from "../../../utils/math"
import { FightAxis } from "../../canvastypes"
import { getOpenCloseAzimuth } from "../formatutils"
import { PaintBrush } from "../paintbrush"
import { DrawPic } from "./drawpic"
import { getRestrictedStartPos, PictureInfo } from "./pictureclamp"

export default class DrawChampagne extends DrawPic {
  create(): DrawPic {
    return new DrawChampagne()
  }

  chooseNumGroups(): void {
    this.numGroupsToCreate = 3
  }

  getPictureInfo(start?: Point): PictureInfo {
    const wide = randomNumber(7 * PIXELS_TO_NM, 35 * PIXELS_TO_NM)
    const deep = randomNumber(7 * PIXELS_TO_NM, 35 * PIXELS_TO_NM)
    const startPos = getRestrictedStartPos(
      this.state.blueAir,
      this.props.displaySettings.canvasConfig.orient,
      this.props.displaySettings.dataStyle,
      45 + deep,
      100,
      { wide, deep, start }
    )

    return { start: startPos, wide, deep }
  }

  createGroups = (startPos: Point, contactList: number[]): AircraftGroup[] => {
    const isNS = FightAxis.isNS(this.props.displaySettings.canvasConfig.orient)

    let heading: number = randomHeading(
      this.props.format,
      this.state.blueAir.getHeading()
    )
    const tg = new AircraftGroup({
      sx: startPos.x,
      sy: startPos.y,
      hdg: heading + randomNumber(-10, 10),
      nContacts: contactList[0],
    })

    tg.setLabel("TRAIL GROUP")

    if (this.props.isHardMode)
      heading = randomHeading(
        this.props.format,
        this.state.blueAir.getHeading()
      )

    let nlg: AircraftGroup

    if (isNS) {
      nlg = new AircraftGroup({
        sx: startPos.x - this.dimensions.wide / 2,
        sy: startPos.y - this.dimensions.deep,
        hdg: heading + randomNumber(-10, 10),
        nContacts: contactList[1],
      })
    } else {
      nlg = new AircraftGroup({
        sx: startPos.x + this.dimensions.deep,
        sy: startPos.y - this.dimensions.wide / 2,
        hdg: heading + randomNumber(-10, 10),
        nContacts: contactList[1],
      })
    }

    if (this.props.isHardMode)
      heading = randomHeading(
        this.props.format,
        this.state.blueAir.getHeading()
      )

    let slg

    if (isNS) {
      slg = new AircraftGroup({
        sx: startPos.x + this.dimensions.wide / 2,
        sy: startPos.y - this.dimensions.deep,
        hdg: heading + randomNumber(-10, 10),
        nContacts: contactList[2],
      })
      nlg.setLabel("WEST LEAD GROUP")
      slg.setLabel("EAST LEAD GROUP")
    } else {
      slg = new AircraftGroup({
        sx: startPos.x + this.dimensions.deep,
        sy: startPos.y + this.dimensions.wide / 2,
        hdg: heading + randomNumber(-10, 10),
        nContacts: contactList[2],
      })

      nlg.setLabel("NORTH LEAD GROUP")
      slg.setLabel("SOUTH LEAD GROUP")
    }

    return [tg, nlg, slg]
  }

  drawInfo(): void {
    const { displaySettings, showMeasurements } = this.props
    const { canvasConfig, dataStyle, isBraaFirst } = displaySettings

    const isNS = FightAxis.isNS(canvasConfig.orient)

    const tg = this.groups[0]
    const nlg = this.groups[1]
    const slg = this.groups[2]

    const nlgPos = nlg.getCenterOfMass(dataStyle)
    const slgPos = slg.getCenterOfMass(dataStyle)
    const tgPos = tg.getCenterOfMass(dataStyle)

    let wPt = new Point(nlgPos.x, slgPos.y)
    let dPt = new Point(nlgPos.x, tgPos.y)

    if (isNS) {
      wPt = new Point(slgPos.x, nlgPos.y)
      dPt = new Point(tgPos.x, nlgPos.y)
    }
    this.dimensions.wide = wPt.getBR(nlgPos).range
    this.dimensions.deep = dPt.getBR(tgPos).range
    PaintBrush.drawMeasurement(
      nlgPos,
      wPt,
      this.dimensions.wide,
      showMeasurements
    )

    PaintBrush.drawMeasurement(
      tgPos,
      dPt,
      this.dimensions.deep,
      showMeasurements
    )

    const offsetXTrail = !isNS ? -100 : 0
    const offsetXNL = isNS ? -100 : 0

    PaintBrush.drawAltitudes(tgPos, tg.getAltitudes(), offsetXTrail)
    PaintBrush.drawAltitudes(slgPos, slg.getAltitudes())
    PaintBrush.drawAltitudes(nlgPos, nlg.getAltitudes(), offsetXNL)

    const { blueAir, bullseye } = this.state
    const bluePos = blueAir.getCenterOfMass(dataStyle)

    tg.setBraaseye(new Braaseye(tgPos, bluePos, bullseye))
    nlg.setBraaseye(new Braaseye(nlgPos, bluePos, bullseye))
    slg.setBraaseye(new Braaseye(slgPos, bluePos, bullseye))

    tg.getBraaseye().draw(showMeasurements, isBraaFirst, offsetXTrail)
    nlg.getBraaseye().draw(showMeasurements, isBraaFirst, offsetXNL)
    slg.getBraaseye().draw(showMeasurements, isBraaFirst)
  }

  applyLabels(): void {
    const isNS = FightAxis.isNS(this.props.displaySettings.canvasConfig.orient)
    const nLbl = isNS ? "WEST" : "NORTH"
    const sLbl = isNS ? "EAST" : "SOUTH"

    this.groups[1].setLabel(nLbl + " LEAD GROUP")
    this.groups[2].setLabel(sLbl + " LEAD GROUP")
    this.groups[0].setLabel("TRAIL GROUP")

    let group1 = this.groups[1]
    let group2 = this.groups[2]

    if (group1.isAnchor()) {
      group2.setUseBull(this.isAnchorOutriggers())
    } else {
      group1 = this.groups[2]
      group2 = this.groups[1]
      group1.setUseBull(true)
      group2.setUseBull(this.isAnchorOutriggers())
    }
    this.groups = [group1, group2, this.groups[0]]
  }

  formatWeighted(): string {
    const { displaySettings } = this.props
    const isNS = FightAxis.isNS(displaySettings.canvasConfig.orient)
    const grp0Pos = this.groups[0].getCenterOfMass(displaySettings.dataStyle)
    const grp1Pos = this.groups[1].getCenterOfMass(displaySettings.dataStyle)
    const grp2Pos = this.groups[2].getCenterOfMass(displaySettings.dataStyle)
    // determine if weighted
    let frmNPt = new Point(grp0Pos.x, grp2Pos.y)
    let fromSPt = new Point(grp1Pos.x, grp2Pos.y)
    let weighted = ""

    if (isNS) {
      frmNPt = new Point(grp2Pos.x, grp0Pos.y)
      fromSPt = new Point(grp2Pos.x, grp1Pos.y)
    }

    if (frmNPt.getBR(grp0Pos).range < this.dimensions.wide / 3) {
      weighted =
        " WEIGHTED " +
        this.groups[0].getLabel().replace(" LEAD GROUP", "") +
        ", "
    } else if (fromSPt.getBR(grp1Pos).range < this.dimensions.wide / 3) {
      weighted =
        " WEIGHTED " +
        this.groups[1].getLabel().replace(" LEAD GROUP", "") +
        ", "
    }

    return weighted
  }

  formatPicTitle(): string {
    return "THREE GROUP CHAMPAGNE"
  }

  formatDimensions(): string {
    const openClose = getOpenCloseAzimuth(this.groups[1], this.groups[2])

    return (
      this.dimensions.wide +
      " WIDE" +
      openClose +
      " " +
      this.dimensions.deep +
      " DEEP, "
    )
  }

  getAnswer(): string {
    this.checkAnchor(this.groups[1], this.groups[2])
    this.applyLabels()

    let answer = this.formatPicTitle() + " "

    answer += this.formatDimensions() + " "
    answer += this.formatWeighted() + " "
    answer += this.picTrackDir() + " "

    for (const grp of this.groups) {
      answer += grp.format(this.props.format) + " "
    }

    return answer.replace(/\s+/g, " ").trim()
  }
}
