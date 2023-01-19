import React, { useCallback } from "react"
import { useCookieBoolState } from "../../hooks/use-cookie-bool-state"
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
} from "../../utils/muiadapter"
import { SettingsToggle } from "../fields/settings-toggle"

export type POBSelProps = {
  picType: string
  handleChangePicType: (e: SelectChangeEvent<string>) => void
  handleToggleMeasurements: () => void
  handleToggleHardMode: () => void
  handleNewPic: () => void
}

/**
 * Functional component to select and toggles related to picture generation.
 */
export const PicOptionsBar = (props: POBSelProps) => {
  const {
    cookieValue: isWantMeasureChecked,
    toggleCookie: toggleWantMeasureChecked,
  } = useCookieBoolState("UserWantMeasure")
  const { cookieValue: isHardModeChecked, toggleCookie: toggleHardMode } =
    useCookieBoolState("UserWantHardMode")

  const handleToggleMeasurements = useCallback((): void => {
    const { handleToggleMeasurements } = props

    handleToggleMeasurements()
    toggleWantMeasureChecked()
  }, [toggleWantMeasureChecked])

  const handleToggleHardMode = useCallback((): void => {
    const { handleToggleHardMode } = props

    handleToggleHardMode()
    toggleHardMode()
  }, [toggleHardMode])

  const { picType, handleChangePicType, handleNewPic } = props

  return (
    <div style={{ display: "flex", marginBottom: "16px" }}>
      <Select
        sx={{
          backgroundColor: "#eee",
          color: "#444",
          height: "36px !important",
          padding: "unset",
          width: "25%",
        }}
        size="small"
        labelId="picSelLabel"
        id="pictureType"
        value={picType}
        onChange={handleChangePicType}
      >
        <MenuItem value="random">Select Picture</MenuItem>
        <MenuItem value="random">RANDOM</MenuItem>
        <MenuItem value="azimuth">AZIMUTH</MenuItem>
        <MenuItem value="range">RANGE</MenuItem>
        <MenuItem value="wall">WALL</MenuItem>
        <MenuItem value="ladder">LADDER</MenuItem>
        <MenuItem value="champagne">CHAMPAGNE</MenuItem>
        <MenuItem value="vic">VIC</MenuItem>
        <MenuItem value="cap">CAP</MenuItem>
        <MenuItem value="leading edge">LEADING EDGE</MenuItem>
        <MenuItem value="package">PACKAGES</MenuItem>
        <MenuItem value="threat">THREAT</MenuItem>
        <MenuItem value="ea">EA / BOGEY DOPE</MenuItem>
        <MenuItem value="pod">PICTURE OF THE DAY</MenuItem>
        {process.env.NODE_ENV === "development" && (
          <MenuItem value="singlegroup">SINGLE</MenuItem>
        )}
      </Select>
      <Button
        sx={{ marginLeft: "16px" }}
        data-testid="newpicbtn"
        onClick={handleNewPic}
      >
        New Pic
      </Button>

      <SettingsToggle
        sx={{ marginLeft: "16px" }}
        isChecked={isWantMeasureChecked}
        label="I want to measure"
        onChange={handleToggleMeasurements}
      />

      <SettingsToggle
        isChecked={isHardModeChecked}
        label="Hard Mode"
        onChange={handleToggleHardMode}
      />
    </div>
  )
}

export default PicOptionsBar
