import { BlueAir } from "../../../classes/aircraft/blueair"
import { AircraftGroup } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { FORMAT } from "../../../classes/supportedformats"
import { PictureAnswer } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import { DrawPic } from "./drawpic"
import { getRestrictedStartPos, PictureInfo } from "./pictureclamp"
import { PictureFactory } from "./picturefactory"

export default class DrawLeadEdge extends DrawPic {
  private leadEdge!: DrawPic
  private followOn!: DrawPic

  private furthestLeadGroup!: AircraftGroup

  private rngBack = -1

  create(): DrawPic {
    return new DrawLeadEdge()
  }

  chooseNumGroups(nCts: number): void {
    console.log(nCts)
    const nCt = Math.floor(nCts / 2)
    const sCt = nCts - nCt

    this.leadEdge = PictureFactory.getPictureDraw("random", nCt, true)
    this.followOn = PictureFactory.getPictureDraw("random", sCt, true)

    this.leadEdge.initialize(this.props, this.state)
    this.followOn.initialize(this.props, this.state)

    this.leadEdge.chooseNumGroups(nCt)
    this.followOn.chooseNumGroups(sCt)
  }

  getPictureInfo(start?: Point): PictureInfo {
    // // Draw the first picture (i.e. the leading edge)
    const pic1StartPos = getRestrictedStartPos(
      BlueAir.get(),
      this.props.orientation.orient,
      this.props.dataStyle,
      45,
      100,
      { start }
    )
    const leadInfo = this.leadEdge.getPictureInfo(pic1StartPos)

    this.leadEdge.dimensions = leadInfo

    const followInfo = this.followOn.getPictureInfo(pic1StartPos)

    this.followOn.dimensions = followInfo

    return {
      deep: 0,
      wide: 0,
      start: pic1StartPos,
    }
  }

  createGroups = (startPos: Point, contactList: number[]): AircraftGroup[] => {
    const { dataStyle } = this.props

    const leadGrps = this.leadEdge.createGroups(
      startPos,
      contactList.slice(0, this.leadEdge.getNumGroups())
    )

    this.leadEdge.groups = leadGrps

    let furthestPic1Group = this.leadEdge.groups[0]
    let furthestRange = 0

    this.leadEdge.groups.forEach((grp) => {
      const grpRange = grp
        .getCenterOfMass(dataStyle)
        .getBR(BlueAir.get().getCenterOfMass(dataStyle)).range

      if (grpRange > furthestRange) {
        furthestPic1Group = grp
        furthestRange = grpRange
      }
    })

    this.furthestLeadGroup = furthestPic1Group

    const pic2StartPos = getRestrictedStartPos(
      furthestPic1Group,
      this.props.orientation.orient,
      dataStyle,
      25,
      40
    )

    this.followOn.dimensions.start = pic2StartPos

    const followGrps = this.followOn.createGroups(
      pic2StartPos,
      contactList.slice(this.leadEdge.getNumGroups())
    )

    this.followOn.groups = followGrps

    return leadGrps.concat(followGrps)
  }

  drawInfo(): void {
    this.leadEdge.drawInfo()
    this.followOn.drawInfo()
  }

  tryAgain(): PictureAnswer {
    const nPkgContacts = this.leadEdge.groups
      .map((grp) => grp.getStrength())
      .reduce((a, b) => a + b)
    const sPkgContacts = this.followOn.groups
      .map((grp) => grp.getStrength())
      .reduce((a, b) => a + b)
    const nCts = nPkgContacts + sPkgContacts

    PaintBrush.clearCanvas()

    PaintBrush.drawBullseye()
    BlueAir.get().draw(this.props.dataStyle)

    return this.draw(false, nCts)
  }

  formatPicTitle(): string {
    return this.getNumGroups() + " GROUPS, LEADING EDGE"
  }

  /**
   * In leading edge the dimension is the straight distance to
   * "follow on" groups
   */
  formatDimensions(): string {
    const { dataStyle } = this.props
    const groups2 = this.followOn.groups

    let closestFollowOn = groups2[0]
    let closestRange = Number.MAX_VALUE

    groups2.forEach((grp) => {
      const grpRange = grp
        .getCenterOfMass(dataStyle)
        .getBR(BlueAir.get().getCenterOfMass(dataStyle)).range

      if (grpRange < closestRange) {
        closestFollowOn = grp
        closestRange = grpRange
      }
    })

    const pic2Pos = closestFollowOn.getCenterOfMass(dataStyle)
    const pic1Pos = this.furthestLeadGroup.getCenterOfMass(dataStyle)

    const rngBack = pic1Pos.straightDistNM(
      pic2Pos,
      this.props.orientation.orient
    )

    this.rngBack = rngBack

    let answer = ""

    if (this.props.format === FORMAT.IPE) {
      answer += "GROUPS " + rngBack + " MILES"
    } else {
      answer += rngBack + " " + this.followOn.formatPicTitle()
    }

    return answer
  }

  formatWeighted(): string {
    return ""
  }

  applyLabels(): void {
    //nothing
  }

  getAnswer(): string {
    let answer = ""

    answer = this.formatPicTitle() + " "
    answer += this.leadEdge.getAnswer()
    answer += " 2ND WAVE "
    answer += this.formatDimensions()

    if (this.rngBack > 40) {
      answer = this.tryAgain().pic
    }

    return answer.replace(/\s+/g, " ").trim()
  }
}
