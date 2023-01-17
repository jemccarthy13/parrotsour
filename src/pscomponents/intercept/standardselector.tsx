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
import { HelpButton } from "../help/help-button"

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
    <>
      <div style={{ display: "inline-flex", paddingBottom: "16px" }}>
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
                <HelpButton
                  data-testid="alsaQTBtn"
                  onClick={handleToggleAlsaQT}
                >
                  ?
                </HelpButton>
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
            <a
              style={{ color: "#42a5f5" }}
              target="_window"
              href="https://www.alsa.mil/MTTPs/ACC/"
            >
              here!
            </a>
          </DialogContentText>
        </DialogTitle>
        <AlsaHelp />
      </Dialog>
    </>
  )
}

export default StandardSelector
