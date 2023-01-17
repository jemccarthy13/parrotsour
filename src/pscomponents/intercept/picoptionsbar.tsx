import React from "react"
import { Cookies } from "react-cookie-consent"
import {
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Checkbox,
  Button,
} from "../../utils/muiadapter"

export type POBSelProps = {
  picType: string
  handleChangePicType: (e: SelectChangeEvent<string>) => void
  handleToggleMeasurements: () => void
  handleToggleHardMode: () => void
  handleNewPic: () => void
}

interface POBSelState {
  isHardModeChecked: boolean
  isWantMeasureChecked: boolean
}

/**
 * Functional component to select and toggles related to picture generation.
 */
export default class PicOptionsBar extends React.PureComponent<
  POBSelProps,
  POBSelState
> {
  constructor(props: POBSelProps) {
    super(props)
    this.state = {
      isWantMeasureChecked: Cookies.get("UserWantMeasure") === "true",
      isHardModeChecked: Cookies.get("UserWantHardMode") === "true",
    }
  }

  handleToggleMeasurements = (): void => {
    const { handleToggleMeasurements } = this.props

    handleToggleMeasurements()
    const { isWantMeasureChecked } = this.state

    this.setState({ isWantMeasureChecked: !isWantMeasureChecked })
    Cookies.set("UserWantMeasure", !isWantMeasureChecked)
  }

  handleToggleHardMode = (): void => {
    const { handleToggleHardMode } = this.props

    handleToggleHardMode()
    const { isHardModeChecked } = this.state

    this.setState({ isHardModeChecked: !isHardModeChecked })
    Cookies.set("UserWantHardMode", !isHardModeChecked)
  }

  render(): JSX.Element {
    const { picType, handleChangePicType, handleNewPic } = this.props

    const { isWantMeasureChecked, isHardModeChecked } = this.state

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

        <FormControlLabel
          control={<Checkbox defaultChecked={isWantMeasureChecked} />}
          label="I want to measure"
          sx={{ marginLeft: "16px" }}
          onChange={this.handleToggleMeasurements}
        />
        <FormControlLabel
          control={<Checkbox defaultChecked={isHardModeChecked} />}
          label="Hard Mode"
          sx={{ marginLeft: "16px" }}
          onChange={this.handleToggleHardMode}
        />
      </div>
    )
  }
}
