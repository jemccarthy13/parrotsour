import {
  PictureCanvasProps,
  PictureCanvasState,
} from "../../canvas/canvastypes"
import { getStartPos } from "../../canvas/draw/intercept/pictureclamp"
import { randomHeading } from "../../utils/math"
import { BlueAir } from "../aircraft/blueair"
import { Point } from "../point"
import { AircraftGroup } from "./group"

export class GroupFactory {
  public static randomGroupAtLoc(
    props: PictureCanvasProps,
    state: PictureCanvasState,
    startLoc: Point,
    heading?: number,
    nContacts?: number
  ): AircraftGroup {
    const hdg = heading
      ? heading
      : randomHeading(props.format, BlueAir.get().getHeading())
    const startPos = startLoc

    const p = { sx: startPos.x, sy: startPos.y, hdg, nContacts }
    const grp = new AircraftGroup(p)

    return grp
  }

  public static randomGroup(
    props: PictureCanvasProps,
    state: PictureCanvasState,
    heading?: number,
    numContacts?: number
  ): AircraftGroup {
    const startLoc = getStartPos(
      BlueAir.get(),
      props.orientation.orient,
      props.dataStyle
    )

    return this.randomGroupAtLoc(props, state, startLoc, heading, numContacts)
  }
}
