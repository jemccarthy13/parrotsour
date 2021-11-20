import { SensorType } from "../../../classes/aircraft/datatrail/sensortype"
import { FORMAT } from "../../../classes/supportedformats"
import { CanvasOrient, PictureCanvasProps } from "../../canvastypes"

/**
 * Mock draw function for a drawing canvas
 * @param context the Context to draw in
 */
export const drawMock = async (): Promise<void> => {
  return new Promise(jest.fn())
}

export const testProps: PictureCanvasProps = {
  braaFirst: true,
  dataStyle: SensorType.ARROW,
  showMeasurements: true,
  isHardMode: false,
  format: FORMAT.ALSA,
  setAnswer: jest.fn(),
  sliderSpeed: 50,
  desiredNumContacts: 4,
  orientation: new CanvasOrient(),
  picType: "azimuth",
  newPic: true,
  animate: false,
  animateCallback: jest.fn(),
}

describe("mock_utils_dummy_test", () => {
  it("mocked", () => {
    expect(true).toEqual(true)
  })
})
