import { BlueAir } from "../../../classes/aircraft/blueair"
import { AircraftGroup } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { FORMAT } from "../../../classes/supportedformats"
import { randomNumber } from "../../../utils/math"
import { PictureAnswer } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import { DrawPic } from "./drawpic"
import { getRestrictedStartPos, PictureInfo } from "./pictureclamp"
import { PictureFactory } from "./picturefactory"

export default class DrawWaves extends DrawPic {
  private leadEdge!: DrawPic
  private followOn!: DrawPic
  private thirdWave!: DrawPic
  private fourthWave!: DrawPic

  private furthestLeadGroup!: AircraftGroup
  private furthestFollowOnGroup!: AircraftGroup
  private furthestThirdWaveGroup!: AircraftGroup

  private rngBack = -1

  create(): DrawPic {
    return new DrawWaves()
  }

  private chooseNumWaves(): number {
    return randomNumber(3, 4)
  }

  chooseNumGroups(nCts: number): void {
    const nWaves = this.chooseNumWaves()

    const grpCounts = []
    let remaining = nCts

    for (let x = 0; x < nWaves - 1; x++) {
      const count = randomNumber(1, Math.floor(remaining / 2))

      grpCounts.push(nCts === 0 ? 0 : count)
      remaining = remaining - count
    }
    grpCounts.push(nCts === 0 ? 0 : remaining)

    this.leadEdge = PictureFactory.getPictureDraw(
      randomNumber(0, 1) === 0 ? "azimuth" : "wall",
      grpCounts[0],
      true
    )
    this.leadEdge.initialize(this.props, this.state)
    this.leadEdge.chooseNumGroups(grpCounts[0])

    this.followOn = PictureFactory.getPictureDraw(
      randomNumber(0, 1) === 0 ? "azimuth" : "wall",
      grpCounts[1],
      true
    )
    this.followOn.initialize(this.props, this.state)
    this.followOn.chooseNumGroups(grpCounts[1])

    this.thirdWave = PictureFactory.getPictureDraw(
      randomNumber(0, 1) === 0 ? "azimuth" : "wall",
      grpCounts[2],
      true
    )
    this.thirdWave.initialize(this.props, this.state)
    this.thirdWave.chooseNumGroups(grpCounts[2])

    const fourthpic = randomNumber(0, 2)

    if (nWaves === 4) {
      this.fourthWave = PictureFactory.getPictureDraw(
        fourthpic === 0 ? "azimuth" : fourthpic === 1 ? "wall" : "champagne",
        grpCounts[3],
        true
      )

      this.fourthWave.initialize(this.props, this.state)
      this.fourthWave.chooseNumGroups(grpCounts[3])
    }
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

    this.leadEdge.dimensions = this.leadEdge.getPictureInfo(pic1StartPos)

    this.followOn.dimensions = this.followOn.getPictureInfo(pic1StartPos)

    this.thirdWave.dimensions = this.thirdWave.getPictureInfo(pic1StartPos)

    if (this.fourthWave)
      this.fourthWave.dimensions = this.fourthWave.getPictureInfo(pic1StartPos)

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

    let furthestPic2Group = this.followOn.groups[0]
    let furthest2Range = 0

    this.followOn.groups.forEach((grp) => {
      const grpRange = grp
        .getCenterOfMass(dataStyle)
        .getBR(BlueAir.get().getCenterOfMass(dataStyle)).range

      if (grpRange > furthest2Range) {
        furthestPic2Group = grp
        furthest2Range = grpRange
      }
    })

    this.furthestFollowOnGroup = furthestPic2Group

    const pic3StartPos = getRestrictedStartPos(
      furthestPic2Group,
      this.props.orientation.orient,
      dataStyle,
      25,
      40
    )

    this.thirdWave.dimensions.start = pic3StartPos

    const thirdWaveGrps = this.thirdWave.createGroups(
      pic3StartPos,
      contactList.slice(this.thirdWave.getNumGroups())
    )

    this.thirdWave.groups = thirdWaveGrps

    let fourthWaveGrps: AircraftGroup[] = []

    if (this.fourthWave) {
      let furthestPic3Group = this.thirdWave.groups[0]
      let furthest3Range = 0

      this.thirdWave.groups.forEach((grp) => {
        const grpRange = grp
          .getCenterOfMass(dataStyle)
          .getBR(BlueAir.get().getCenterOfMass(dataStyle)).range

        if (grpRange > furthest3Range) {
          furthestPic3Group = grp
          furthest3Range = grpRange
        }
      })

      this.furthestThirdWaveGroup = furthestPic3Group

      const pic4StartPos = getRestrictedStartPos(
        furthestPic3Group,
        this.props.orientation.orient,
        dataStyle,
        25,
        40
      )

      this.fourthWave.dimensions.start = pic4StartPos

      fourthWaveGrps = this.fourthWave.createGroups(
        pic4StartPos,
        contactList.slice(this.fourthWave.getNumGroups())
      )

      this.fourthWave.groups = fourthWaveGrps
    }

    return leadGrps
      .concat(followGrps)
      .concat(thirdWaveGrps)
      .concat(fourthWaveGrps)
  }

  drawInfo(): void {
    this.leadEdge.drawInfo()
    this.followOn.drawInfo()
    this.thirdWave.drawInfo()
    if (this.fourthWave) this.fourthWave.drawInfo()
  }

  tryAgain(): PictureAnswer {
    const nPkgContacts = this.leadEdge.groups
      .map((grp) => grp.getStrength())
      .reduce((a, b) => a + b)
    const sPkgContacts = this.followOn.groups
      .map((grp) => grp.getStrength())
      .reduce((a, b) => a + b)
    const thirdWaveContacts = this.thirdWave.groups
      .map((grp) => grp.getStrength())
      .reduce((a, b) => a + b)
    const nCts = nPkgContacts + sPkgContacts + thirdWaveContacts

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

    const groups3 = this.thirdWave.groups

    let closestThirdWave = groups3[0]

    closestRange = Number.MAX_VALUE

    groups3.forEach((grp) => {
      const grpRange = grp
        .getCenterOfMass(dataStyle)
        .getBR(BlueAir.get().getCenterOfMass(dataStyle)).range

      if (grpRange < closestRange) {
        closestThirdWave = grp
        closestRange = grpRange
      }
    })

    const closestThirdWavePos = closestThirdWave.getCenterOfMass(dataStyle)
    const furthestFollowOnPos =
      this.furthestFollowOnGroup.getCenterOfMass(dataStyle)

    const rngBack2 = furthestFollowOnPos.straightDistNM(
      closestThirdWavePos,
      this.props.orientation.orient
    )

    let rngBack4 = 0

    if (this.fourthWave) {
      const groups4 = this.fourthWave.groups

      let closestFourthWave = groups4[0]

      closestRange = Number.MAX_VALUE

      groups4.forEach((grp) => {
        const grpRange = grp
          .getCenterOfMass(dataStyle)
          .getBR(BlueAir.get().getCenterOfMass(dataStyle)).range

        if (grpRange < closestRange) {
          closestFourthWave = grp
          closestRange = grpRange
        }
      })

      const closestFourthWavePos = closestFourthWave.getCenterOfMass(dataStyle)
      const furthestThirdWavePos =
        this.furthestThirdWaveGroup.getCenterOfMass(dataStyle)

      rngBack4 = furthestThirdWavePos.straightDistNM(
        closestFourthWavePos,
        this.props.orientation.orient
      )
    }

    let answer = ""

    if (this.props.format === FORMAT.IPE) {
      answer += "FOLLOW ON GROUPS " + rngBack + " MILES"
    } else {
      answer +=
        "SECOND WAVE " +
        rngBack +
        " " +
        this.followOn.formatPicTitle() +
        " THIRD WAVE " +
        rngBack2 +
        " " +
        this.thirdWave.formatPicTitle()

      if (this.fourthWave) {
        answer +=
          " FOURTH WAVE " + rngBack4 + " " + this.fourthWave.formatPicTitle()
      }
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
    answer += " "
    answer += this.formatDimensions()

    answer = answer.replace(/\s+/g, " ").trim()
    answer +=
      "    \r\n\r\n Note(s):\r\nBy the book, waves should have: # wave, range back, group count + picture relation, and (if able) NATO designator or brevity." +
      " \r\nEx: 3 grp wall, FLANKER;  2 grp azimuth, MOSQUITO;" +
      "\r\n- What would you say, if anything, for a designator or brevity if a wave was mixed type?" +
      "\r\n- What would you leave out when 'time crunched', if ALSSA also says 'only provide information relevant for targeting and flow decisions based on comm time available'?"

    if (this.rngBack > 40) {
      answer = this.tryAgain().pic
    }

    return answer
  }
}
