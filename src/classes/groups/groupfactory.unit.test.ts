import { expect, it, describe, vi, beforeAll } from "vitest"
import {
  BlueInThe,
  PictureCanvasProps,
  PictureCanvasState,
} from "../../canvas/canvastypes"
import TestCanvas from "../../testutils/testcanvas"
import { BlueAir } from "../aircraft/blueair"
import { SensorType } from "../aircraft/datatrail/sensortype"
import { Point } from "../point"
import { FORMAT } from "../supportedformats"
import { AircraftGroup } from "./group"
import { GroupFactory } from "./groupfactory"

vi.mock("../../utils/math", () => {
  return {
    randomNumber: () => 55,
    randomHeading: () => 96,
    headingToRadians: () => 0.5,
    PIXELS_TO_NM: 4,
  }
})

const randomPt = new Point(25, 25)

beforeAll(() => {
  BlueAir.set(new AircraftGroup({ sx: 500, sy: 500 }))
})

vi.mock("../../canvas/draw/intercept/pictureclamp", () => {
  return {
    getStartPos: () => {
      return { x: 25, y: 25 }
    },
  }
})

describe("GroupFactory", () => {
  TestCanvas.useContext()

  const fakeProps: PictureCanvasProps = {
    format: FORMAT.ALSA,
    setAnswer: vi.fn(),
    sliderSpeed: 50,
    orientation: { height: 400, width: 400, orient: BlueInThe.NORTH },
    picType: "azimuth",
    braaFirst: true,
    dataStyle: SensorType.ARROW,
    showMeasurements: true,
    isHardMode: false,
    newPic: false,
    animate: false,
    resetCallback: vi.fn(),
    animateCallback: vi.fn(),
    desiredNumContacts: 0,
  }

  const fakeState: PictureCanvasState = {
    answer: { pic: "test", groups: [] },
    reDraw: vi.fn(),
  }

  it("creates_random_grp_at_loc", () => {
    const startPt = new Point(50, 50)
    const group = GroupFactory.randomGroupAtLoc(
      fakeProps,
      fakeState,
      new Point(50, 50),
      237
    )

    expect(group.getHeading()).toEqual(237)
    expect(group.getStartPos()).toEqual(startPt)
  })

  it("creates_random_grp_at_loc_random_hdg", () => {
    const startPt = new Point(50, 50)
    const group = GroupFactory.randomGroupAtLoc(fakeProps, fakeState, startPt)

    expect(group.getHeading()).toEqual(96)
    expect(group.getStartPos()).toEqual(startPt)
  })

  it("creates_default_random_group", () => {
    const grp = GroupFactory.randomGroup(fakeProps, fakeState)

    expect(grp.getStartPos()).toEqual(randomPt)
    expect(grp.getHeading()).toEqual(96)
  })

  it("creates_default_random_group_with_hdg", () => {
    const grp = GroupFactory.randomGroup(fakeProps, fakeState, 237)

    expect(grp.getStartPos()).toEqual(randomPt)
    expect(grp.getHeading()).toEqual(237)
  })
})
