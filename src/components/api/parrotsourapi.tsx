import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material"
import { BlueInThe, PictureCanvasProps } from "../../canvas/canvastypes"
import { PaintBrush } from "../../canvas/draw/paintbrush"
import PictureCanvas from "../../canvas/intercept"
import { SensorType } from "../../classes/aircraft/datatrail/sensortype"
import { FORMAT } from "../../classes/supportedformats"
import { theme } from "../../theme"
import { snackActions } from "../alert/psalert"
import { HiddenCanvas } from "./styles"
import { validAccessCode } from "./utils"

export function ParrotSourAPI(): JSX.Element {
  const config: PictureCanvasProps = {
    showMeasurements: true,
    isHardMode: true,
    format: FORMAT.ALSA,
    displaySettings: {
      canvasConfig: {
        height: 600,
        width: 700,
        orient: BlueInThe.NORTH,
      },
      isBraaFirst: true,
      dataStyle: SensorType.RAW,
    },
    animationSettings: {
      speedSliderValue: 50,
      isAnimate: false,
    },
    animationHandlers: {
      pauseAnimate: jest.fn(),
      startAnimate: jest.fn(),
      onSliderChange: jest.fn(),
    },
    picType: "random",
    newPic: false,
    desiredNumContacts: 0,
    setAnswer: () => {
      // do nothing
    },
  }

  const [numPics, setNumPics] = useState<number>(5)
  const [accessCode, setCode] = useState<string>("")
  const [includeGroups, setIncludeGroups] = useState<boolean>(true)

  // Refs that store References to the current DOM elements
  const canvasRef: React.RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null)

  /**
   * Every time the canvas changes, update the PaintBrush current drawing context
   * When a context is undefined in helper functions, the PaintBrush context is used.
   */
  useEffect(() => {
    PaintBrush.use(canvasRef.current?.getContext("2d"))
  }, [canvasRef])

  function download(filename: string, text: string) {
    const element = document.createElement("a")

    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    )
    element.setAttribute("download", filename)

    element.style.display = "none"
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  const canvas = new PictureCanvas({ ...config })

  async function onClick() {
    const isValidCode = await validAccessCode(accessCode)

    if (isValidCode) {
      const answers = []

      for (let x = 0; x < numPics; x++) {
        try {
          const answer = canvas.drawPicture(true)
          const a = {
            pic: answer.pic,
            groups: includeGroups ? answer.groups : [],
          }

          answers.push(a)
        } catch {
          // nothing
        }
      }
      download("data.json", JSON.stringify(answers))
    } else {
      snackActions.warning("Invalid access code.")
    }
  }

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const i = parseInt(event.currentTarget.value)

      setNumPics(i)
    },
    []
  )

  const onChangeCode = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const code = event.currentTarget.value

      setCode(code)
    },
    []
  )

  const changeIncludeGroups = useCallback(() => {
    setIncludeGroups((prev) => !prev)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <div style={{ textAlign: "center" }}>
        <Stack
          sx={{ textAlign: "center", margin: "auto" }}
          direction="column"
          width="50%"
        >
          <TextField
            label="# of pictures?"
            type="number"
            fullWidth
            value={numPics}
            variant="filled"
            onChange={onChange}
          />
          <TextField
            label="Access code"
            type="text"
            fullWidth
            value={accessCode}
            variant="filled"
            onChange={onChangeCode}
          />
          <FormGroup sx={{ paddingBottom: "20px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeGroups}
                  disableRipple
                  onChange={changeIncludeGroups}
                />
              }
              label="Include group data?"
              labelPlacement="start"
            />
          </FormGroup>
          <HiddenCanvas id="pscanvas" ref={canvasRef} />
          <button
            data-testid="download-results"
            id="downloadBtn"
            type="button"
            onClick={onClick}
            style={{ marginBottom: "20px" }}
          >
            Download
          </button>
          Note: this downloads a text file (JSON) whose size will scale to the
          number of pictures requested.
        </Stack>
      </div>
    </ThemeProvider>
  )
}

export default ParrotSourAPI
