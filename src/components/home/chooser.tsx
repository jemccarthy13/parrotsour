import React, { lazy, ReactElement } from "react"
import { Button } from "@mui/material"
import { PsQT } from "../help/ps-tips"

const ParrotSourHeader = lazy(() => import("../header/header"))

type PSCProps = {
  interceptLink?: string
  proceduralLink?: string
  apiLink?: string
}

export const ParrotSourChooser = ({
  interceptLink = "",
  proceduralLink = "",
  apiLink = "",
}: PSCProps): ReactElement => {
  const buttonStyle = {
    width: "25%",
    margin: "5px",
  }

  function navigate(link?: string): () => void {
    return () => {
      window.location.href = link ? link : "#"
    }
  }

  return (
    <div>
      <ParrotSourHeader comp={<PsQT />} answer={{ pic: "", groups: [] }} />
      <br />
      <hr />
      <div style={{ textAlign: "center" }}>
        <Button
          sx={buttonStyle}
          type="button"
          onClick={navigate(interceptLink)}
        >
          Intercept
        </Button>
        <Button
          sx={buttonStyle}
          type="button"
          onClick={navigate(proceduralLink)}
        >
          Procedural
        </Button>
        <Button sx={buttonStyle} type="button" onClick={navigate(apiLink)}>
          API
        </Button>
      </div>
    </div>
  )
}

export default ParrotSourChooser
