import React, { useCallback, useState } from "react"
import { FORMAT } from "../../classes/supportedformats"
import {
  Dialog,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "../../utils/muiadapter"
import { AlsaHelp } from "../help/alsa-tips"

export type StandardSelectorProps = {
  onChange: (val: FORMAT) => void
}

export const StandardSelector = (props: StandardSelectorProps) => {
  const [isShowAlsaQT, setShowAlsaQT] = useState(false)

  const { onChange } = props

  function handleToggleAlsaQT() {
    setShowAlsaQT((prev) => !prev)
  }

  const handleRadioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFormat = FORMAT[e.currentTarget.value as keyof typeof FORMAT]

      onChange(newFormat)
    },
    [onChange]
  )

  return (
    <div className="pscontainer">
      <div style={{ display: "inline-flex", paddingBottom: "24px" }}>
        <div style={{ margin: "auto", marginRight: "8px" }}>Standard:</div>
        <RadioGroup
          aria-labelledby="standard-selector-radio-buttons"
          name="standard-selection"
          onChange={handleRadioChange}
          defaultValue="alsa"
          sx={{ margin: "auto" }}
          row
        >
          <FormControlLabel value="ipe" control={<Radio />} label="3-3 IPE" />
          <FormControlLabel
            value="alsa"
            control={<Radio />}
            label={
              <>
                ALSA ACC
                <button
                  style={{ padding: "0px", alignSelf: "center" }}
                  className="helpicon"
                  id="alsaQTBtn"
                  type="button"
                  onClick={handleToggleAlsaQT}
                >
                  ?
                </button>
              </>
            }
          />
        </RadioGroup>
      </div>
      <Dialog open={isShowAlsaQT} onClose={handleToggleAlsaQT}>
        <DialogTitle
          sx={{ paddingBottom: "5px", borderBottom: "1px solid black" }}
        >
          ALSA
          <br />
          <br />
          <IconButton
            onClick={handleToggleAlsaQT}
            sx={{
              position: "absolute",
              right: "20px",
              top: "10px",
              width: "fit-content",
            }}
          >
            X
          </IconButton>
          <DialogContentText>
            Download the pub&nbsp;
            <a target="_window" href="https://www.alsa.mil/MTTPs/ACC/">
              here!
            </a>
          </DialogContentText>
        </DialogTitle>
        <AlsaHelp />
      </Dialog>
    </div>
  )
}

export default StandardSelector
