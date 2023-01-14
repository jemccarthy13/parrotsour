import { AltStack } from "../../../classes/altstack"
import { BRAA } from "../../../classes/braa"
import { AircraftGroup } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { Aspect, toCardinal } from "../../../utils/aspect"
import { randomNumber } from "../../../utils/math"
import { PaintBrush } from "../paintbrush"
import { DrawPic } from "./drawpic"
import { PictureInfo } from "./pictureclamp"
import { PictureFactory } from "./picturefactory"

/**
 * Contains required info for response to EA
 */
interface EAInfo {
  query: string
  strBR: BRAA
  grp: AircraftGroup
  aspectH?: string
  altStack?: AltStack
}

export default class DrawEA extends DrawPic {
  public eaPic!: DrawPic
  public eaInfo!: EAInfo
  public requestType = 0 // 0 = music, 1 = STR, 2 = BD

  create(): DrawPic {
    return new DrawEA()
  }

  chooseNumGroups(nCts: number): void {
    this.eaPic = PictureFactory.getPictureDraw("random", nCts)
    this.eaPic.initialize(this.props, this.state)
    this.eaPic.chooseNumGroups(nCts)
  }

  getPictureInfo(start?: Point): PictureInfo {
    const ctx = PaintBrush.getContext()

    // force draw to happen on the right side of the screen
    if (start === undefined) {
      start = new Point(
        randomNumber(ctx.canvas.width * 0.6, ctx.canvas.width * 0.65),
        randomNumber(ctx.canvas.width * 0.2, ctx.canvas.height * 0.8)
      )
    }

    const picInfo = this.eaPic.getPictureInfo(start)

    this.eaPic.dimensions = picInfo

    return picInfo
  }

  createGroups = (startPos: Point, contactList: number[]): AircraftGroup[] => {
    this.groups = this.eaPic.createGroups(startPos, contactList)
    this.eaPic.groups = this.groups

    return this.groups
  }

  /**
   * @returns the closest group to blue air
   */
  private _getClosestGroup(): AircraftGroup {
    // find the closest group
    let closestGrp: AircraftGroup = this.groups[0]
    let closestRng = 9999
    let braa = new BRAA(0, 0)

    for (let x = 0; x < this.groups.length; x++) {
      const tmpBraa = this.state.blueAir
        .getCenterOfMass(this.props.dataStyle)
        .getBR(this.groups[x].getCenterOfMass(this.props.dataStyle))

      if (tmpBraa.range < closestRng) {
        braa = tmpBraa
        closestRng = braa.range
        closestGrp = this.groups[x]
      }
    }

    return closestGrp
  }

  /**
   * Process groups from picture to determine:
   * which group is closest? and whats the B/R?
   * which group are we querying for EA from?
   * which (random) group will we use if we don't use closest?
   *
   * @param groups current red air picture groups
   * @param blueAir current blue air group
   * @returns Object containing closest group, closest braa, query
   * text, strobe range, and group matching the query
   */
  private _initializeEAInfo(): void {
    const { blueAir } = this.state
    const { dataStyle } = this.props
    const bluePos = blueAir.getCenterOfMass(dataStyle)

    const grpIdx = randomNumber(0, this.groups.length - 1)
    const grp: AircraftGroup = this.groups[grpIdx]
    const strBR = bluePos.getBR(grp.getCenterOfMass(dataStyle))

    // Issue #6 -- instead of an exact bearing, choose a reasonable str brg
    const info = {
      strBR,
      grp,
      query: strBR.bearing,
    }

    if (randomNumber(1, 100) <= 50) {
      info.query = grp.getLabel()
    }

    this.eaInfo = info
  }

  drawInfo(): void {
    // draw the picture info
    this.eaPic.drawInfo()
    this.eaPic.getAnswer()

    this._initializeEAInfo()

    this.requestType = randomNumber(0, 2)
    let request = '"EAGLE01, MUSIC ' + this.eaInfo.grp.getLabel() + '"'

    if (this.requestType === 1) {
      request = '"EAGLE01, BOGEY DOPE NEAREST GRP"'
    } else if (this.requestType === 2) {
      request = '"EAGLE01, STROBE ' + this.eaInfo.query + '"'
    }

    // draw the query
    const ctx = PaintBrush.getContext()

    PaintBrush.drawText(request, ctx.canvas.width / 2, 20)
  }

  /**
   * Return a formatted MUSIC response
   */
  formatMusic(): string {
    const { grp } = this.eaInfo

    grp.setUseBull(true)
    let answer = grp.format(this.props.format)

    if (grp.getStrength() > 1) {
      answer += " LINE ABREAST 3 "
    }

    return answer
  }

  /**
   * Return a formatted Strobe response
   * @param info EA response info
   */
  formatStrobe(): string {
    const { grp } = this.eaInfo
    const altStack = grp.getAltStack(this.props.format)
    const aspectH = this.state.blueAir.getAspect(grp, this.props.dataStyle)
    const trackDir = toCardinal(grp.getHeading())

    return (
      "EAGLE01 STROBE RANGE " +
      this.eaInfo.strBR.range +
      ", " +
      altStack.stack +
      " " +
      (aspectH !== "HOT" ? aspectH + " " + trackDir : aspectH) +
      ", HOSTILE, " +
      grp.getLabel()
    )
  }

  /**
   * Return a formatted BRAA response
   */
  formatBRAA(): string {
    const cGrp = this._getClosestGroup()
    const braa = this.state.blueAir
      .getCenterOfMass(this.props.dataStyle)
      .getBR(cGrp.getCenterOfMass(this.props.dataStyle))

    const altStack = cGrp.getAltStack(this.props.format)

    const aspectH = this.state.blueAir.getAspect(cGrp, this.props.dataStyle)

    let aspect = aspectH.toString() + " "

    aspect += aspectH !== Aspect.HOT ? toCardinal(cGrp.getHeading()) : ""
    let response: string = cGrp.getLabel()

    response += " BRAA " + braa.toString() + " "
    response += altStack.stack + ", "
    response += aspect + " HOSTILE "

    response += cGrp.formatNumContacts()

    response += altStack.fillIns

    return response.replace(/\s+/g, " ").trim()
  }

  applyLabels(): void {
    console.warn("apply labels does nothing for EA")
  }
  formatWeighted(): string {
    return ""
  }
  formatPicTitle(): string {
    return ""
  }
  formatDimensions(): string {
    return ""
  }

  getAnswer(): string {
    let answer = ""

    switch (this.requestType) {
      case 0:
        answer = this.formatMusic()
        break
      case 1:
        answer = this.formatBRAA()
        break
      default:
        answer = this.formatStrobe()
        break
    }

    return answer.replace(/\s+/g, " ").trim()
  }
}
