import { PictureFactory } from "./picturefactory"
import DrawSingleGroup from "./singlegroup"

import * as PSMath from "../../../utils/psmath"

describe("PictureFactory", () => {
  it("chooses_random_pic_low_complexity", () => {
    const pDraw = PictureFactory.getPictureDraw("random", 1)
    expect(pDraw.toString()).toEqual(new DrawSingleGroup().toString())
  })

  it("chooses_pic_high_complexity", () => {
    jest.spyOn(PSMath, "randomNumber").mockReturnValueOnce(7)
    const pDraw = PictureFactory.getPictureDraw("random", 7)
    expect(
      pDraw.formatPicTitle().indexOf("LEADING EDGE")
    ).toBeGreaterThanOrEqual(0)
  })

  it("chooses_pic_random_complex_random_contacts", () => {
    jest.spyOn(PSMath, "randomNumber").mockReturnValueOnce(7)
    const pDraw = PictureFactory.getPictureDraw("random", 0)
    expect(
      pDraw.formatPicTitle().indexOf("LEADING EDGE")
    ).toBeGreaterThanOrEqual(0)
  })

  it("chooses_pic_forced_complexity", () => {
    jest.spyOn(PSMath, "randomNumber").mockReturnValueOnce(1)
    const pDraw = PictureFactory.getPictureDraw("random", 8, true)
    expect(
      pDraw.formatPicTitle().indexOf("TWO GROUPS RANGE")
    ).toBeGreaterThanOrEqual(0)
  })

  it("chooses_pic_forced_complexity_default_az_if_unknown", () => {
    jest.spyOn(PSMath, "randomNumber").mockReturnValueOnce(8)
    const pDraw = PictureFactory.getPictureDraw("random", 8, true)
    expect(
      pDraw.formatPicTitle().indexOf("GROUPS AZIMUTH")
    ).toBeGreaterThanOrEqual(0)
  })

  it("chooses_high_complexity_when_forced", () => {
    jest.spyOn(PSMath, "randomNumber").mockReturnValueOnce(8)
    const pDraw = PictureFactory.getPictureDraw("random", -1, true)
    expect(pDraw.formatPicTitle().indexOf("PACKAGES")).toBeGreaterThanOrEqual(0)
  })

  it("chooses_random_complexity_when_forced", () => {
    jest.spyOn(PSMath, "randomNumber").mockReturnValueOnce(1)
    const pDraw = PictureFactory.getPictureDraw("random", 0, true)
    expect(pDraw.formatPicTitle().indexOf("RANGE")).toBeGreaterThanOrEqual(0)
  })

  it("chooses_cap", () => {
    jest.spyOn(PSMath, "randomNumber").mockReturnValueOnce(1)
    const pDraw = PictureFactory.getPictureDraw("cap", 3, true)
    expect(pDraw.formatPicTitle().indexOf("RANGE")).toBeGreaterThanOrEqual(0)
  })

  it("chooses_az_when_pictype_unknown", () => {
    jest.spyOn(PSMath, "randomNumber").mockReturnValueOnce(1)
    const pDraw = PictureFactory.getPictureDraw("unknown", 3, true)
    expect(pDraw.formatPicTitle().indexOf("AZIMUTH")).toBeGreaterThanOrEqual(0)
  })

  it("defaults_az_when_pictype_unknown", () => {
    jest.spyOn(PSMath, "randomNumber").mockReturnValueOnce(1)
    const pDraw = PictureFactory.getPictureDraw(undefined, 3, true)
    expect(pDraw.formatPicTitle().indexOf("AZIMUTH")).toBeGreaterThanOrEqual(0)
  })
})
