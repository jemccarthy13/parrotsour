/* eslint-disable react/jsx-handler-names */
import React, { useCallback, useState } from "react"
import { BlueInThe } from "../../canvas/canvastypes"
import { SensorType } from "../../classes/aircraft/datatrail/sensortype"
import {
  DisplaySettings,
  DisplayToggles,
} from "../../hooks/use-display-settings"
import {
  FormControlLabel,
  DialogContent,
  DialogContentText,
  Dialog,
  Switch,
} from "../../utils/muiadapter"
import { HelpButton } from "../help/help-button"

export type DisplayProps = {
  settings: DisplaySettings
  toggles: DisplayToggles
}

/**
 * 'Basic' controls for the ParrotSour pictures.
 *
 * Includes:
 * - Orientation toggle
 * - BRAA/Bull first toggle
 * - Datastyle toggle
 * - Help icons
 */
export const DisplayControls = (props: DisplayProps) => {
  const { settings: displaySettings, toggles: displayToggles } = props

  const [isShowBraaFirstHelp, setIsShowBraaFirstHelp] = useState(false)
  const [isShowDatastyleHelp, setIsShowDatastyleHelp] = useState(false)

  const isOrientNS = displaySettings.canvasConfig.orient === BlueInThe.NORTH

  /**
   * Toggle display of braa first help text
   */
  const handleToggleBraaFirstHelp = useCallback(() => {
    setIsShowBraaFirstHelp((prev) => !prev)
  }, [])

  /**
   * Toggle display of datastyle help text
   */
  const handleToggleDatastyleHelp = useCallback(() => {
    setIsShowDatastyleHelp((prev) => !prev)
  }, [])

  return (
    <div>
      <div style={{ display: "inline-flex", marginBottom: "16px" }}>
        {/** Issue #18 -- ORIENTATION -- Support 'blue in the' N/S/E/W */}
        <FormControlLabel
          control={
            <Switch
              checked={isOrientNS}
              onChange={displayToggles.toggleCanvasOrient}
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
              checked={displaySettings.isBraaFirst}
              onChange={displayToggles.toggleBraaFirst}
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
          {displaySettings.isBraaFirst ? "BRAA" : "BULL"}
        </div>
        <HelpButton
          data-testid="displayFirstHelp"
          onClick={handleToggleBraaFirstHelp}
        >
          ?
        </HelpButton>

        <div style={{ display: "inline-flex", marginLeft: "50px" }}>
          <FormControlLabel
            control={
              <Switch
                id="dataTrailToggle"
                checked={displaySettings.dataStyle === SensorType.RAW}
                onChange={displayToggles.toggleDataStyle}
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
            {displaySettings.dataStyle === SensorType.RAW ? "Radar" : "Arrow"}
          </div>

          <HelpButton
            data-testid="dataTrailHelp"
            onClick={handleToggleDatastyleHelp}
          >
            ?
          </HelpButton>
        </div>
      </div>
      <Dialog
        id="dispFirstHelpDialog"
        open={isShowBraaFirstHelp}
        onClose={handleToggleBraaFirstHelp}
      >
        <DialogContent>
          <DialogContentText>
            The BULL/BRAA toggle will change the order of the bullseye and braa
            measurements on screen.
          </DialogContentText>
          <DialogContentText>BULL = ALT, BULL, BRAA</DialogContentText>
          <DialogContentText>BRAA = ALT, BRAA, BULL</DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        id="datatrailHelpDialog"
        open={isShowDatastyleHelp}
        onClose={handleToggleDatastyleHelp}
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

export default DisplayControls
