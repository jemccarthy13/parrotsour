import { BlueAir } from "../../../classes/aircraft/blueair"
import { BRAA } from "../../../classes/braa"
import { Bullseye } from "../../../classes/bullseye/bullseye"
import { AircraftGroup } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { randomNumber } from "../../../utils/math"
import { FightAxis, PictureAnswer } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import { DrawPic } from "./drawpic"
import { Package } from "./package"
import { PictureInfo } from "./pictureclamp"
import { PictureFactory } from "./picturefactory"

export default class DrawPackage extends DrawPic {
  public pictures: DrawPic[] = []
  private packages: Package[] = []

  private rngBack: BRAA = new BRAA(-1, -1)

  create(): DrawPic {
    return new DrawPackage()
  }

  chooseNumGroups(nCts: number): void {
    const nCt = Math.floor(nCts / 2)
    const sCt = nCts - nCt

    this.pictures.push(PictureFactory.getPictureDraw("random", nCt, true))
    this.pictures.push(PictureFactory.getPictureDraw("random", sCt, true))

    this.pictures[0].initialize(this.props, this.state)
    this.pictures[1].initialize(this.props, this.state)

    this.pictures[0].chooseNumGroups(nCt)
    this.pictures[1].chooseNumGroups(sCt)
  }

  private start2: Point = Point.DEFAULT
  private isRange = false

  getPictureInfo(): PictureInfo {
    this.isRange = randomNumber(0, 100) < 50

    const isNS = FightAxis.isNS(this.props.orientation.orient)

    let s1x = 0
    let s1y = 0
    let s2x = 0
    let s2y = 0

    const ctx = PaintBrush.getContext()

    if (isNS) {
      if (this.isRange) {
        s1x = randomNumber(ctx.canvas.width * 0.2, ctx.canvas.width * 0.8)
        s1y = randomNumber(ctx.canvas.height * 0.5, ctx.canvas.height * 0.59)

        s2x = s1x
        s2y = randomNumber(ctx.canvas.height * 0.7, ctx.canvas.height * 0.8)
      } else {
        s1x = randomNumber(ctx.canvas.width * 0.2, ctx.canvas.width * 0.3)
        s1y = randomNumber(ctx.canvas.height * 0.5, ctx.canvas.height * 0.8)

        s2y = s1y
        s2x = randomNumber(ctx.canvas.width * 0.7, ctx.canvas.width * 0.8)
      }
    } else {
      if (this.isRange) {
        s1x = randomNumber(ctx.canvas.width * 0.5, ctx.canvas.width * 0.59)
        s1y = randomNumber(ctx.canvas.height * 0.2, ctx.canvas.width * 0.4)

        s2x = randomNumber(ctx.canvas.width * 0.2, ctx.canvas.width * 0.35)
        s2y = s1y
      } else {
        s1x = randomNumber(ctx.canvas.width * 0.25, ctx.canvas.width * 0.5)
        s1y = randomNumber(ctx.canvas.height * 0.6, ctx.canvas.height * 0.7)
        s2x = s1x
        s2y = randomNumber(ctx.canvas.height * 0.25, ctx.canvas.height * 0.4)
      }
    }

    const starts = [new Point(s1x, s1y), new Point(s2x, s2y)]

    this.pictures.forEach((pic, idx) => {
      pic.initialize(this.props, this.state)
      const info = pic.getPictureInfo(starts[idx])

      pic.dimensions = info
    })

    this.start2 = starts[1]

    return {
      start: starts[0],
      wide: -1,
      deep: -1,
    }
  }

  createGroups = (startPos: Point, contactList: number[]): AircraftGroup[] => {
    const nGrps = this.pictures[0].createGroups(
      startPos,
      contactList.slice(0, this.pictures[0].getNumGroups())
    )
    const sGrps = this.pictures[1].createGroups(
      this.start2,
      contactList.slice(this.pictures[1].getNumGroups())
    )

    this.pictures[0].groups = nGrps
    this.pictures[1].groups = sGrps

    return nGrps.concat(sGrps)
  }

  drawInfo(): void {
    this.pictures[0].drawInfo()
    this.pictures[1].drawInfo()
  }

  _getPicBull = (groups: AircraftGroup[]): Point => {
    const { dataStyle, orientation } = this.props
    let closestGroup = groups[0]

    let closestRng = 9999
    let sum = 0
    const bPos = BlueAir.get().getCenterOfMass(dataStyle)

    const isNS = FightAxis.isNS(orientation.orient)

    for (const grp of groups) {
      const gPos = grp.getCenterOfMass(dataStyle)

      const BRAA = bPos.getBR(gPos)

      if (BRAA.range < closestRng) {
        closestGroup = grp
        closestRng = BRAA.range
      }

      if (isNS) {
        sum += gPos.x
      } else {
        sum += gPos.y
      }
    }

    // if it's wide (az) get center of mass
    // it it's deep (rng) get lead pos (depends on orientation)
    const cPos = closestGroup.getCenterOfMass(dataStyle)
    let retVal = new Point(sum / groups.length, cPos.y)

    if (!isNS) {
      retVal = new Point(cPos.x, sum / groups.length)
    }

    return retVal
  }

  tryAgain(): PictureAnswer {
    const nPkgContacts = this.pictures[0].groups
      .map((grp) => {
        return grp.getStrength()
      })
      .reduce((a, b) => a + b, 0)
    const sPkgContacts = this.pictures[1].groups
      .map((grp) => grp.getStrength())
      .reduce((a, b) => a + b, 0)
    const nCts = nPkgContacts + sPkgContacts

    PaintBrush.clearCanvas()
    PaintBrush.drawBullseye()
    BlueAir.get().draw(this.props.dataStyle)

    return this.draw(false, nCts)
  }

  _isAnchorNPkg = (nBR: number, sBR: number): boolean => {
    let anchorNorth = true

    if (sBR < nBR) {
      anchorNorth = false
    } else if (sBR === nBR) {
      const maxAlt1 = Math.max(
        ...this.pictures[0].groups.map((grp) => {
          return Math.max(...grp.getAltitudes())
        })
      )
      const maxAlt2 = Math.max(
        ...this.pictures[1].groups.map((grp) => {
          return Math.max(...grp.getAltitudes())
        })
      )

      if (maxAlt2 > maxAlt1) {
        anchorNorth = false
      } else if (maxAlt2 === maxAlt1) {
        if (this.pictures[1].groups.length > this.pictures[0].groups.length) {
          anchorNorth = false
        }
      }
    }

    return anchorNorth
  }

  formatPicTitle(): string {
    return "2 PACKAGES "
  }

  formatDimensions(): string {
    const isNS = FightAxis.isNS(this.props.orientation.orient)

    const bullPt1 = this.packages[0].getBullseyePt()
    const bullPt2 = this.packages[1].getBullseyePt()

    const bullseye = Bullseye.get()

    this.packages[0].setBullseye(bullseye.getBR(bullPt1))
    this.packages[1].setBullseye(bullseye.getBR(bullPt2))

    // default deep
    this.rngBack = isNS
      ? new Point(bullPt1.x, bullPt2.y).getBR(bullPt1)
      : new Point(bullPt2.x, bullPt1.y).getBR(bullPt1)

    // measure wide if az
    if (!this.isRange) {
      this.rngBack = isNS
        ? new Point(bullPt2.x, bullPt1.y).getBR(bullPt1)
        : new Point(bullPt1.x, bullPt2.y).getBR(bullPt1)
    }

    return (this.isRange ? " RANGE " : " AZIMUTH ") + this.rngBack.range + " "
  }

  formatWeighted(): string {
    return ""
  }

  applyLabels(): void {
    const isNS = FightAxis.isNS(this.props.orientation.orient)

    let nLbl = isNS ? "EAST" : "NORTH"
    let sLbl = isNS ? "WEST" : "SOUTH"

    if (this.isRange) {
      nLbl = isNS ? "LEAD" : "TRAIL"
      sLbl = isNS ? "TRAIL" : "LEAD"
    }

    this.packages[0].setLabel(sLbl)
    this.packages[1].setLabel(nLbl)

    if (!this.packages[0].isAnchor()) {
      this.pictures.reverse()
      this.packages.reverse()
    }
  }

  checkAnchor = (): void => {
    const bPos = BlueAir.get().getCenterOfMass(this.props.dataStyle)

    const isAnchNorth = this._isAnchorNPkg(
      bPos.getBR(this.packages[0].getBullseyePt()).range,
      bPos.getBR(this.packages[1].getBullseyePt()).range
    )

    this.packages[0].setAnchor(isAnchNorth)
    this.packages[1].setAnchor(!isAnchNorth)
  }

  getAnswer(): string {
    const pkg1 = new Package()
    const pkg2 = new Package()

    this.packages = [pkg1, pkg2]
    this.packages[0].setBullseyePt(this._getPicBull(this.pictures[0].groups))
    this.packages[1].setBullseyePt(this._getPicBull(this.pictures[1].groups))

    this.checkAnchor()
    this.applyLabels()

    let answer = ""

    answer = this.formatPicTitle()
    answer += this.formatDimensions()
    answer += this.packages[0].format()
    answer += " "
    answer += this.packages[1].format()

    if (this.rngBack.range < 40) {
      answer = this.tryAgain().pic
    }

    return answer.replace(/\s+/g, " ").trim()
  }
}
