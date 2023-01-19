import React from "react"
import { SxProps, Theme } from "@mui/material"
import { Checkbox, FormControlLabel } from "../../utils/muiadapter"

type SettingsToggleProps = {
  isChecked: boolean
  label: React.ReactNode
  onChange: (event: React.SyntheticEvent<Element, Event>) => void
  sx?: SxProps<Theme>
}

// eslint-disable-next-line react/require-default-props
export const SettingsToggle = (props: SettingsToggleProps) => {
  const { isChecked, onChange, label, sx } = props

  return (
    <FormControlLabel
      control={<Checkbox defaultChecked={isChecked} />}
      label={label}
      sx={sx}
      onChange={onChange}
    />
  )
}
