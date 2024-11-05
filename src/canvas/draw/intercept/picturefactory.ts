import { randomNumber } from "../../../utils/math"
import DrawAzimuth from "./azimuth"
import DrawChampagne from "./champagne"
import { DrawPic } from "./drawpic"
import DrawEA from "./ea"
import DrawLadder from "./ladder"
import DrawLeadEdge from "./leadingedge"
import DrawPackage from "./packages"
import DrawPOD from "./pod"
import DrawRange from "./range"
import DrawSingleGroup from "./singlegroup"
import DrawThreat from "./threat"
import DrawVic from "./vic"
import DrawWall from "./wall"
import DrawWaves from "./waves"

export class PictureFactory {
  private static readonly DrawMap = new Map<string, () => DrawPic>([
    ["azimuth", new DrawAzimuth().create],
    ["range", new DrawRange().create],
    ["ladder", new DrawLadder().create],
    ["wall", new DrawWall().create],
    ["vic", new DrawVic().create],
    ["champagne", new DrawChampagne().create],
    ["threat", new DrawThreat().create],
    ["ea", new DrawEA().create],
    ["pod", new DrawPOD().create],
    ["leading edge", new DrawLeadEdge().create],
    ["package", new DrawPackage().create],
    ["singlegroup", new DrawSingleGroup().create],
    ["waves", new DrawWaves().create],
  ])

  /**
   * Pick a random picture type for drawing
   * @param leadingEdge - true iff leading edge or packages. Set to true to
   * limit the types of pictures to the standard (with caveat: wall is
   * not allowed in lead edge/pkg due to separation requirement)
   */
  private static readonly _getRandomPicType = (complexity: number): string => {
    const type1 = ["singlegroup"]
    const type2 = type1.concat(["range", "azimuth"])
    const type3 = type2.concat(["vic", "champagne", "wall", "ladder"])
    const type4 = type3.concat(["leading edge", "package"])

    const types = [[], type1, type2, type3, type4]

    if (complexity <= 0) {
      complexity = 4
    }

    const numType = randomNumber(0, types[complexity].length - 1)

    return types[complexity][numType]
  }

  public static getPictureDraw(
    picType: string | undefined,
    desiredNumContacts?: number,
    forced?: boolean
  ): DrawPic {
    desiredNumContacts = desiredNumContacts ?? 0

    let complexity = desiredNumContacts

    if (complexity === 0) complexity = 4
    if (complexity > 4) complexity = 4
    if (forced)
      complexity =
        desiredNumContacts === 0 ? 3 : Math.min(desiredNumContacts, 3)
    if (picType === "cap") complexity = 2

    let type = picType ?? "azimuth"

    if (picType === "random" || picType === "cap") {
      type = this._getRandomPicType(complexity)
    }

    let drawFunc = this.DrawMap.get(type)

    if (drawFunc === undefined) {
      drawFunc = new DrawAzimuth().create
    }

    return drawFunc()
  }
}
