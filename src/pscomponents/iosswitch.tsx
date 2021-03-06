import React from "react"
import { Switch, SwitchClassKey, SwitchProps } from "../utils/muiadapter"
import { createStyles, withStyles } from "../utils/muistylesadapter"

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string
}

interface Props extends SwitchProps {
  classes: Styles
}

export const IOSSwitch = withStyles(() =>
  createStyles({
    root: {
      width: 46,
      height: 26,
      padding: 0,
      marginLeft: 16,
      marginTop: "auto",
      marginBottom: "auto",
    },
    switchBase: {
      padding: 1,
      backgroundColor: "#52d869",
    },
    thumb: {
      backgroundColor: "#52d869",
      width: 24,
      height: 24,
    },
    track: {
      backgroundColor: "dimgrey !important",
      borderRadius: 24 / 2,
      opacity: "1 !important",
    },
    checked: {
      backgroundColor: "#52d869",
    },
  })
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  )
})
