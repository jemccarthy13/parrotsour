import React, { useState } from "react"
import { Tooltip } from "../../utils/muiadapter"

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
      <label style={{ padding: "5px" }} htmlFor="numContacts">
        Fight: 4 v
      </label>

      <input
        id="numContacts"
        style={{
          backgroundColor: "#eee",
          color: "#444",
          textAlign: "center",
          width: "5%",
          minWidth: "25px",
        }}
        type="number"
        name="clicks"
        value={count}
        onChange={contactCounterChange()}
      />

      <Tooltip title="# of red contacts; 0 = random">
        <button
          style={{ padding: "0px" }}
          className="helpicon"
          id="alsaQTBtn"
          type="button"
        >
          ?
        </button>
      </Tooltip>
    </div>
  )
}
