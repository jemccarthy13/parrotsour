import React, { ReactElement } from "react"
import PSCookies from "../../utils/cookies"
import {
  FormControlLabel,
  DialogContent,
  DialogContentText,
  Dialog,
  Switch,
  Slider,
  Button,
} from "../../utils/muiadapter"
import { HelpButton } from "../help/help-button"

export interface PSCProps {
  handleSliderChange: { (val: number): void }
  startAnimate: { (): void }
  pauseAnimate: { (): void }
  displayFirstChanged: { (): void }
  modifyCanvas: { (): void }
  handleDataStyleChange: { (): void }
}

interface PSCState {
  speedSliderValue: number
  showHelpText: boolean
  showHelpArrowText: boolean
  isBraaFirst: boolean
  dataStyleIsRadar: boolean
  isOrientNS: boolean
}

/**
 * 'Basic' controls for the ParrotSour pictures.
 *
 * Includes:
 * - Play/Pause
 * - Speed Slider
 * - Orientation toggle
 * - BRAA/Bull first toggle
 */
export default class ParrotSourControls extends React.PureComponent<
  PSCProps,
  PSCState
> {
  constructor(props: PSCProps) {
    super(props)

    this.state = {
      speedSliderValue: PSCookies.getSliderValue(),
      showHelpText: false,
      showHelpArrowText: false,
      isBraaFirst: PSCookies.getBraaFirst(),
      dataStyleIsRadar: PSCookies.getDataStyleIsRadar(),
      isOrientNS: PSCookies.getOrientNS(),
    }
  }

  /**
   * Called when the slider changes speed
   * @param evt - a ChangeEvent containing the new speed value
   */
  handleSliderChange = (_evt: Event, value: number | number[]): void => {
    const val = Array.isArray(value) ? value[0] : value

    this.setState({ speedSliderValue: val })

    const { handleSliderChange } = this.props

    handleSliderChange(val)
  }

  handleSliderMouseUp = (): void => {
    const { speedSliderValue } = this.state

    PSCookies.setSliderValue(speedSliderValue)
  }

  /**
   * Called to start the animation
   */
  handleFightsOn = (): void => {
    const { startAnimate } = this.props

    startAnimate()
  }

  /**
   * Called to stop the animation
   */
  handlePauseFight = (): void => {
    const { pauseAnimate } = this.props

    pauseAnimate()
  }

  /**
   * Toggle display of help text
   */
  handleToggleHelp = (): void => {
    this.setState((prevState) => ({ showHelpText: !prevState.showHelpText }))
  }

  /**
   * Toggle display of help text
   */
  handleToggleArrowHelp = (): void => {
    this.setState((prevState) => ({
      showHelpArrowText: !prevState.showHelpArrowText,
    }))
  }

  /**
   * Handle data trail toggle
   */
  handleDataStyleChange = (): void => {
    const { dataStyleIsRadar } = this.state

    this.setState({ dataStyleIsRadar: !dataStyleIsRadar })
    PSCookies.setDataStyleIsRadar(!dataStyleIsRadar)
    const { handleDataStyleChange } = this.props

    handleDataStyleChange()
  }

  handleDisplayFirstChanged = (): void => {
    const { isBraaFirst } = this.state

    this.setState({ isBraaFirst: !isBraaFirst })
    PSCookies.setBraaFirst(!isBraaFirst)
    const { displayFirstChanged } = this.props

    displayFirstChanged()
  }

  handleOrientationChange = (): void => {
    const { isOrientNS } = this.state

    this.setState({ isOrientNS: !isOrientNS })
    PSCookies.setOrientNS(!isOrientNS)
    const { modifyCanvas } = this.props

    modifyCanvas()
  }

  render(): ReactElement {
    const {
      speedSliderValue,
      showHelpText,
      showHelpArrowText,
      isBraaFirst,
      dataStyleIsRadar,
      isOrientNS,
    } = this.state

    return (
      <div>
        <div style={{ display: "inline-flex", marginBottom: "16px" }}>
          {/** Issue #18 -- ORIENTATION -- Support 'blue in the' N/S/E/W */}
          <FormControlLabel
            control={
              <Switch
                checked={isOrientNS}
                onChange={this.handleOrientationChange}
                name="Orientation"
              />
            }
            label="Orientation:"
            labelPlacement="start"
          />
          <div
            style={{
              width: "50px",
              margin: "auto",
              marginLeft: "15px",
              textAlign: "center",
            }}
          >
            {isOrientNS ? "N/S" : "E/W"}
          </div>
          <FormControlLabel
            control={
              <Switch
                id="cursordispToggle"
                checked={isBraaFirst}
                onChange={this.handleDisplayFirstChanged}
                name="BRAA"
              />
            }
            label="Display First:"
            labelPlacement="start"
          />
          <div
            style={{
              width: "50px",
              margin: "auto",
              marginLeft: "15px",
              textAlign: "center",
            }}
          >
            {isBraaFirst ? "BRAA" : "BULL"}
          </div>
          <HelpButton
            data-testid="displayFirstHelp"
            onClick={this.handleToggleHelp}
          >
            ?
          </HelpButton>

          <div style={{ display: "inline-flex", marginLeft: "50px" }}>
            <FormControlLabel
              control={
                <Switch
                  id="dataTrailToggle"
                  checked={dataStyleIsRadar}
                  onChange={this.handleDataStyleChange}
                  name="DataTrail"
                />
              }
              label="Data Trail:"
              labelPlacement="start"
            />
            <div
              style={{
                width: "50px",
                margin: "auto",
                marginLeft: "15px",
                textAlign: "center",
              }}
            >
              {dataStyleIsRadar ? "Radar" : "Arrow"}
            </div>

            <HelpButton
              data-testid="dataTrailHelp"
              onClick={this.handleToggleArrowHelp}
            >
              ?
            </HelpButton>
          </div>
        </div>{" "}
        <div style={{ marginBottom: "16px" }}>
          <Button
            id="fightsOnBtn"
            sx={{
              width: "12%",
              marginRight: "1%",
            }}
            onClick={this.handleFightsOn}
          >
            Fights On
          </Button>
          <Button
            id="pauseBtn"
            sx={{ width: "12%" }}
            onClick={this.handlePauseFight}
          >
            Pause
          </Button>
          <div
            style={{
              display: "inline-flex",
              paddingLeft: "16px",
              width: "40%",
            }}
          >
            <label htmlFor="speedSlider"> Animation Speed: </label>
            <Slider
              min={1}
              max={100}
              value={speedSliderValue}
              id="speedSlider"
              onChange={this.handleSliderChange}
              onMouseUp={this.handleSliderMouseUp}
            />
          </div>
        </div>
        <Dialog
          id="dispFirstHelpDialog"
          open={showHelpText}
          onClose={this.handleToggleHelp}
        >
          <DialogContent>
            <DialogContentText>
              The BULL/BRAA toggle will change the order of the bullseye and
              braa measurements on screen.
            </DialogContentText>
            <DialogContentText>BULL = ALT, BULL, BRAA</DialogContentText>
            <DialogContentText>BRAA = ALT, BRAA, BULL</DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          id="datatrailHelpDialog"
          open={showHelpArrowText}
          onClose={this.handleToggleArrowHelp}
        >
          <DialogContent>
            <DialogContentText>
              The ARROW/RADAR toggle changes the picture from arrows to radar
              trails.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}
