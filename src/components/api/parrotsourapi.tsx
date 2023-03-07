import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material"
import { BlueInThe } from "../../canvas/canvastypes"
import { PaintBrush } from "../../canvas/draw/paintbrush"
import PictureCanvas from "../../canvas/intercept"
import { SensorType } from "../../classes/aircraft/datatrail/sensortype"
import { FORMAT } from "../../classes/supportedformats"
import { theme } from "../../theme"
import { snackActions } from "../alert/psalert"
import { HiddenCanvas } from "./styles"
import { validAccessCode } from "./utils"

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

      const formData = new FormData()

      formData.append("code", accessCode)
      formData.append("num_pics", String(numPics))

      await fetch(process.env.PUBLIC_URL + "/database/api/usage.php", {
        method: "POST",
        body: formData,
      })
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
          <InputLabel htmlFor="numpictures" sx={{ marginRight: "auto" }}>
            # of pictures?
          </InputLabel>
          <TextField
            type="number"
            id="numpictures"
            fullWidth
            value={numPics}
            variant="filled"
            sx={{ height: "48px" }}
            onChange={onChange}
          />
          <InputLabel htmlFor="numpictures" sx={{ marginRight: "auto" }}>
            Access code:
          </InputLabel>
          <TextField
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
          <Button
            data-testid="download-results"
            id="downloadBtn"
            type="button"
            onClick={onClick}
            sx={{ margin: "auto", marginBottom: "24px" }}
          >
            Download
          </Button>
          Note: this downloads a text file (JSON) whose size will scale to the
          number of pictures requested.
        </Stack>
      </div>
    </ThemeProvider>
  )
}

export default ParrotSourAPI
