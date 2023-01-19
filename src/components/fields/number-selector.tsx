import React, { useState } from "react"
import { TextField, Tooltip } from "../../utils/muiadapter"
import { HelpButton } from "../help/help-button"

interface CSProps {
  id: string
  updateCount: (count: number) => void
}

export const NumberSelector = (props: CSProps) => {
  const { id } = props

  const [count, setCount] = useState(0)

  const updateCount = (val: number) => {
    const { updateCount } = props

    if (val < 0) {
      val = 0
    }
    setCount(val)
    updateCount(val)
  }

  function onCounterChange() {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      updateCount(parseInt(event.target.value))
    }
  }

  return (
    <div style={{ display: "inline-flex", paddingBottom: "16px" }}>
      <label style={{ padding: "5px" }} htmlFor={`${id}`}>
        Fight: 4 v
      </label>

      <TextField
        id={`${id}`}
        sx={{
          color: "#444",
          paddingBottom: "unset",
          paddingTop: "unset",
          textAlign: "center",
          width: "25%",
          minWidth: "50px",
        }}
        type="number"
        name="clicks"
        size="small"
        value={count}
        onChange={onCounterChange()}
      />

      <Tooltip title="# of red contacts; 0 = random">
        <HelpButton data-testid={`${id}-help-btn`}>?</HelpButton>
      </Tooltip>
    </div>
  )
}
