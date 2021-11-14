import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { AircraftGroup, GroupParams } from "../../../classes/groups/group"
import { Point } from "../../../classes/point"
import { BlueInThe, PictureCanvasState } from "../../canvastypes"
import { PaintBrush } from "../paintbrush"
import DrawLadder from "./ladder"
import { testProps } from "./mockutils.unit.test"

let testState: PictureCanvasState
let p: Partial<GroupParams>
let ladder: DrawLadder

/**
 * Test the azimuth picture drawer
 */
describe("DrawChamp", () => {
  beforeEach(() => {
    const canvas = document.createElement("canvas")
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ctx = canvas.getContext("2d")!
    canvas.width = 800
    canvas.height = 500
    PaintBrush.use(ctx)

    testState = {
      bullseye: new Point(400, 400),
      blueAir: new AircraftGroup({ sx: 600, sy: 400, hdg: 270, nContacts: 4 }),
      answer: { pic: "3 grp ladder", groups: [] },
      reDraw: jest.fn(),
    }

    p = {
      dataTrailType: SensorType.ARROW,
      sx: 200,
      sy: 200,
      nContacts: 4,
      hdg: 90,
      alts: [20, 20, 20, 20],
    }

    testProps.orientation.orient = BlueInThe.EAST
    ladder = new DrawLadder()
    ladder.initialize(testProps, testState)
  })

  it("hot_ladder", () => {
    const lg = new AircraftGroup(p)
    const mg = new AircraftGroup({ ...p, sx: 180, alts: [15, 15, 15, 15] })
    const tg = new AircraftGroup({
      ...p,
      sx: 150,
      alts: [15, 15, 15, 15],
    })

    ladder.groups = [lg, mg, tg]
    ladder.drawInfo()

    expect(ladder.getAnswer()).toEqual(
      "3 GROUP LADDER 12 DEEP, " +
        "LEAD GROUP BULLSEYE 305/68, 15k HOSTILE HEAVY 4 CONTACTS " +
        "MIDDLE GROUP SEPARATION 9 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("ladder_labels_EW", () => {
    const updatedProps = { ...testProps }
    updatedProps.orientation.orient = BlueInThe.NORTH

    ladder.initialize(updatedProps, testState)

    const lg = new AircraftGroup({ ...p, sy: 250 })
    const mg = new AircraftGroup({
      ...p,
      sy: 275,
      alts: [15, 15, 15, 15],
    })
    const tg = new AircraftGroup({
      ...p,
      sy: 300,
      alts: [15, 15, 15, 15],
    })

    ladder.groups = [lg, mg, tg]
    ladder.drawInfo()

    expect(ladder.getAnswer()).toEqual(
      "3 GROUP LADDER 12 DEEP, " +
        "LEAD GROUP BULLSEYE 297/49, 15k HOSTILE HEAVY 4 CONTACTS " +
        "MIDDLE GROUP SEPARATION 6 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("ladder_4_grps", () => {
    testProps.orientation.orient = BlueInThe.EAST
    ladder.initialize(testProps, testState)

    const lg = new AircraftGroup({ ...p })
    const grp2 = new AircraftGroup({
      ...p,
      sx: 225,
      alts: [15, 15, 15, 15],
    })
    const grp3 = new AircraftGroup({
      ...p,
      sx: 250,
      alts: [17],
      nContacts: 1,
    })
    const tg = new AircraftGroup({
      ...p,
      sx: 275,
      alts: [15, 15],
      nContacts: 2,
    })

    ladder.groups = [lg, grp2, grp3, tg]
    ladder.drawInfo()

    expect(ladder.getAnswer()).toEqual(
      "4 GROUP LADDER 18 DEEP, TRACK EAST. " +
        "LEAD GROUP BULLSEYE 333/55, 15k HOSTILE 2 CONTACTS " +
        "2ND GROUP SEPARATION 6 17k HOSTILE " +
        "3RD GROUP 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  it("ladder_5_grps", () => {
    testProps.orientation.orient = BlueInThe.EAST
    ladder.initialize(testProps, testState)

    const lg = new AircraftGroup({ ...p })
    const grp2 = new AircraftGroup({
      ...p,
      sx: 225,
      alts: [15, 15, 15, 15],
    })
    const grp3 = new AircraftGroup({
      ...p,
      sx: 250,
      alts: [17],
      nContacts: 1,
    })
    const grp4 = new AircraftGroup({
      ...p,
      sx: 275,
      alts: [10],
      nContacts: 1,
    })
    const tg = new AircraftGroup({
      ...p,
      sx: 300,
      alts: [15, 15],
      nContacts: 2,
    })

    ladder.groups = [lg, grp2, grp3, grp4, tg]
    ladder.drawInfo()

    expect(ladder.getAnswer()).toEqual(
      "5 GROUP LADDER 25 DEEP, TRACK EAST. " +
        "LEAD GROUP BULLSEYE 339/52, 15k HOSTILE 2 CONTACTS " +
        "2ND GROUP SEPARATION 6 10k HOSTILE " +
        "3RD GROUP 17k HOSTILE " +
        "4TH GROUP 15k HOSTILE HEAVY 4 CONTACTS " +
        "TRAIL GROUP 20k HOSTILE HEAVY 4 CONTACTS"
    )
  })

  // TODO -- write create/chooseNumGroups for all DrawPic classes
  // TODO -- write echelon tests
})
