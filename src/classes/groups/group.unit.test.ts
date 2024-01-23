import { expect, it, describe, vi, afterEach } from "vitest"
import { PaintBrush } from "../../canvas/draw/paintbrush"
import TestCanvas from "../../testutils/testcanvas"
import { ACType, Aircraft } from "../aircraft/aircraft"
import { SensorType } from "../aircraft/datatrail/sensortype"
import { IDMatrix } from "../aircraft/id"
import * as AltStackHelper from "../altstack"
import { Point } from "../point"
import { FORMAT } from "../supportedformats"
import Tasking from "../taskings/tasking"
import { AircraftGroup } from "./group"
import * as groupCap from "./groupcap"

describe("AircraftGroup", () => {
  TestCanvas.useContext(200, 200)
  PaintBrush.use(TestCanvas.getCanvas().getContext("2d"))

  afterEach(() => {
    PaintBrush.clearCanvas()
  })

  describe("accessor_functions", () => {
    it("constructor_and_aircraft_functions", () => {
      const startPt = new Point(20, 20)
      const grp = new AircraftGroup({
        sx: startPt.x,
        sy: startPt.y,
        hdg: 90,
        nContacts: 2,
        alts: [100, 200],
      })

      grp.updateIntent({ desiredHeading: 90 })
      expect(grp.getStartPos()).toEqual(startPt)
      expect(grp.isCapping()).toEqual(false)
      grp.doNextRouting()
      expect(grp.isCapping()).toEqual(true)

      grp.addRoutingPoint(new Point(50, 50))
      expect(grp.hasRouting()).toEqual(true)
    })

    describe("location", () => {
      it("calculates_center_mass", () => {
        const grp = new AircraftGroup({ nContacts: 1, sx: 500, sy: 500 })

        expect(grp.getCenterOfMass(SensorType.ARROW)).toEqual(
          new Point(524, 500)
        )
      })

      it("calculates_center_mass_capping", () => {
        const grp = new AircraftGroup({ nContacts: 1, sx: 500, sy: 500 })

        grp.setCapping(true)

        expect(grp.getCenterOfMass(SensorType.ARROW)).toEqual(
          new Point(500, 500)
        )
      })
    })

    describe("altitude", () => {
      it("group_altitudes", () => {
        const grp = new AircraftGroup({
          nContacts: 2,
          alts: [100, 200],
        })

        expect(grp.getAltitude()).toEqual(200)
        expect(grp.getAltitudes()).toEqual([100, 200])
      })

      it("alt_stack", () => {
        const grp = new AircraftGroup({
          nContacts: 2,
          alts: [100, 200],
        })

        expect(grp.getAltitude()).toEqual(200)
        expect(grp.getAltitudes()).toEqual([100, 200])

        const myMock = vi
          .spyOn(AltStackHelper, "getAltStack")
          .mockImplementationOnce(vi.fn())

        grp.getAltStack(FORMAT.ALSA)
        expect(myMock).toHaveBeenCalled()
      })
    })

    describe("id_and_labeling", () => {
      it("allows_labeling", () => {
        const grp = new AircraftGroup()

        expect(grp.getLabel()).toEqual("GROUP")
        grp.setLabel("WEST")
        expect(grp.getLabel()).toEqual("WEST")
      })

      it("tracks_id_matrix", () => {
        const grp = new AircraftGroup({
          nContacts: 4,
        })

        grp.setIDMatrix(IDMatrix.HOSTILE)
        expect(grp.getIDMatrix()).toEqual(IDMatrix.HOSTILE)
        grp[1].setIDMatrix(IDMatrix.SUSPECT)
        expect(grp.getIDMatrix()).toEqual(IDMatrix.SUSPECT)
        grp[2].setIDMatrix(IDMatrix.ASSUME_FRIEND)
        expect(grp.getIDMatrix()).toEqual(IDMatrix.ASSUME_FRIEND)
        grp[2].setIDMatrix(IDMatrix.NEUTRAL)
        expect(grp.getIDMatrix()).toEqual(IDMatrix.NEUTRAL)
      })
    })

    it("track_dir_functions", () => {
      const grp = new AircraftGroup({
        hdg: 90,
      })

      expect(grp.getStrength()).toBeGreaterThanOrEqual(1)
      grp.updateIntent({ desiredHeading: 90 })
      expect(grp.getTrackDir()).toEqual("TRACK EAST")

      grp.setUseTrackDir(false)
      expect(grp.getTrackDir()).toEqual(undefined)

      grp.doNextRouting()
      expect(grp.isCapping()).toEqual(true)
      expect(grp.getTrackDir()).toEqual("CAP")
    })
  })

  describe("movement_functions", () => {
    it("access_maneuvers", () => {
      const grp = new AircraftGroup({ nContacts: 4 })

      expect(grp.setManeuvers(0))
      expect(grp.doesManeuvers()).toEqual(false)
    })

    it("moves_all_aircraft", () => {
      const grp = new AircraftGroup({ nContacts: 4 })
      const myMock = vi
        .spyOn(Aircraft.prototype, "move")
        .mockImplementationOnce(vi.fn())

      grp.move()
      expect(myMock).toHaveBeenCalledTimes(4)
    })
  })

  describe("draw_group", () => {
    it("draws_all_groups", () => {
      const grp = new AircraftGroup({
        sx: 100,
        sy: 100,
        nContacts: 4,
        hdg: 135,
        id: IDMatrix.FRIEND,
      })
      const myMock = vi.spyOn(Aircraft.prototype, "draw")

      grp.draw(SensorType.ARROW)
      expect(myMock).toHaveBeenCalledTimes(4)
      expect(TestCanvas.getSnapshot()).toMatchSnapshot()
    })

    it("draws_capping_groups", () => {
      const grp = new AircraftGroup({
        sx: 100,
        sy: 100,
        nContacts: 4,
        hdg: 135,
        id: IDMatrix.FRIEND,
      })

      grp.setCapping(true)

      const mockDrawCap = vi.spyOn(groupCap, "drawGroupCap")

      grp.draw(SensorType.ARROW)
      expect(mockDrawCap).toHaveBeenCalledTimes(1)
      expect(TestCanvas.getSnapshot()).toMatchSnapshot()
    })
  })

  describe("passthrough_functions", () => {
    it("update_alt_each_aircraft", () => {
      const grp = new AircraftGroup({
        nContacts: 2,
        hdg: 135,
        id: IDMatrix.FRIEND,
        alts: [20, 20],
      })

      grp.updateIntent({ desiredAlt: 40 })
      grp.updateAltitude()
      expect(grp[0].getAltitude()).toEqual(20.5)
      expect(grp[1].getAltitude()).toEqual(20.5)
    })

    it("adds_routing_each_aircraft", () => {
      const grp = new AircraftGroup({
        nContacts: 2,
      })
      const dest = new Point(20, 20)
      const myMock = vi.spyOn(Aircraft.prototype, "addRoutingPoint")

      grp.addRoutingPoint(dest)
      expect(grp.getNextRoutingPoint()).toEqual(dest)
      expect(myMock).toHaveBeenCalledTimes(2)
    })

    it("on_task", () => {
      const grp = new AircraftGroup({
        nContacts: 2,
      })

      grp.setTasking(new Tasking())
      expect(grp.isOnTask()).toEqual(true)
    })

    it("group_ac_type", () => {
      const grp = new AircraftGroup({ type: ACType.RPA })

      expect(grp.getType()).toEqual(ACType.RPA)
    })
  })
})
