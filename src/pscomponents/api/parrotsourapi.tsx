import React, { useEffect, useRef, useState } from "react"
import {
  Checkbox,
  createTheme,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material"
import { BlueInThe } from "../../canvas/canvastypes"
import { FORMAT } from "../../classes/supportedformats"
import { SensorType } from "../../classes/aircraft/datatrail/sensortype"
import PictureCanvas from "../../canvas/picturecanvas"
import { PaintBrush } from "../../canvas/draw/paintbrush"
import snackActions from "../alert/psalert"

export function ParrotSourAPI(): JSX.Element {
  const config = {
    showAnswer: false,
    showMeasurements: true,
    isHardMode: true,
    format: FORMAT.ALSA,
    speedSliderValue: 50,
    canvasConfig: {
      height: 600,
      width: 700,
      orient: BlueInThe.NORTH,
    },
    braaFirst: true,
    picType: "random",
    answer: {
      pic: "",
      groups: [],
    },
    newPic: false,
    animate: false,
    dataStyle: SensorType.RAW,
    desiredNumContacts: 0,
    setAnswer: () => {
      // do nothing
    },
    sliderSpeed: 50,
    orientation: {
      height: 600,
      width: 700,
      orient: BlueInThe.NORTH,
    },
    animateCallback: () => {
      //nothing
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

  async function validAccessCode() {
    const resp = await fetch(
      `${process.env.PUBLIC_URL}/database/codes/${accessCode}.php`,
      {
        method: "POST",
      }
    )
    return resp.status === 202
  }

  const canvas = new PictureCanvas({ ...config })
  async function onClick() {
    const isValidCode = await validAccessCode()
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

  const style = {
    touchAction: "none",
    backgroundColor: "white",
    width: "500px",
    height: "400px",
    border: "1px solid #000000",
  }

  function onChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const i = parseInt(event.currentTarget.value)
    const itoUse = Number.isNaN(i) ? 0 : i
    setNumPics(itoUse)
  }

  function onChangeCode(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const code = event.currentTarget.value
    setCode(code)
  }

  function changeIncludeGroups() {
    setIncludeGroups(!includeGroups)
  }

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
    components: {
      MuiCheckbox: {
        styleOverrides: {
          root: `
            width:5px;
            margin:auto;
            padding:auto;
          `,
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: `
            font-size: 12px;
            font-family: 'Roboto Mono', monospace;
            height: 100%;
            transform: unset;
            padding-bottom: 20px;
          `,
        },
        defaultProps: {
          variant: "filled",
          size: "small",
          InputProps: {
            disableUnderline: true,
          },
        },
      },
    },
  })

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
          <canvas
            id="pscanvas"
            style={{
              ...style,
              gridColumn: "2",
              gridRow: "1",
              left: "0px",
              display: "none",
            }}
            ref={canvasRef}
          />
          <button
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
