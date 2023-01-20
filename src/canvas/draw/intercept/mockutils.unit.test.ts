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
  displaySettings: {
    isBraaFirst: true,
    dataStyle: SensorType.ARROW,
    canvasConfig: new CanvasOrient(),
  },
  animationSettings: {
    isAnimate: false,
    speedSliderValue: 50,
  },
  animationHandlers: {
    startAnimate: jest.fn(),
    pauseAnimate: jest.fn(),
    onSliderChange: jest.fn(),
  },
  showMeasurements: true,
  isHardMode: false,
  format: FORMAT.ALSA,
  setAnswer: jest.fn(),
  desiredNumContacts: 4,
  picType: "azimuth",
  newPic: true,
}

describe("mock_utils_dummy_test", () => {
  it("mocked", () => {
    expect(true).toEqual(true)
  })
})
