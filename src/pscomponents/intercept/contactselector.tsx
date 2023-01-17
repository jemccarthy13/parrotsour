import React, { useState } from "react"
import { Button, TextField, Tooltip } from "../../utils/muiadapter"
import { HelpButton } from "../help/help-button"

interface CSProps {
  updateCount: (count: number) => void
}

export default function ContactSelector(props: CSProps): JSX.Element {
  const [count, setCount] = useState(0)

  const updateCount = (val: number) => {
    const { updateCount } = props

    if (val < 0) {
      val = 0
    }
    setCount(val)
    updateCount(val)
  }

  function contactCounterChange() {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      updateCount(parseInt(event.target.value))
    }
  }

  return (
    <div>
      <div style={{ display: "inline-flex" }}>
        <label style={{ padding: "5px" }} htmlFor="numContacts">
          Fight: 4 v
        </label>

        <TextField
          id="numContacts"
          sx={{
            // backgroundColor: "#eee",
            color: "#444",
            paddingBottom: "unset",
            paddingTop: "unset",
            textAlign: "center",
            width: "25%",
            minWidth: "50px",
            // height: "12px",
          }}
          type="number"
          name="clicks"
          size="small"
          value={count}
          onChange={contactCounterChange()}
        />

        <Tooltip title="# of red contacts; 0 = random">
          <HelpButton data-testid="alsaQTBtn">?</HelpButton>
        </Tooltip>
      </div>
    </div>
  )
}
