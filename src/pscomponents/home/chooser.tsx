import React, { lazy, ReactElement } from "react"
import { PsQT } from "../quicktips/ps-tips"

const ParrotSourHeader = lazy(() => import("../header/header"))

type PSCProps = {
  interceptLink?: string
  proceduralLink?: string
  apiLink?: string
}

export const ParrotSourChooser = (props: PSCProps): ReactElement => {
  const buttonStyle = {
    width: "25%",
    margin: "5px",
  }

  function navigate(link?: string): () => void {
    return () => {
      window.location.href = link ? link : "#"
    }
  }

  const { interceptLink, proceduralLink, apiLink } = props

  return (
    <div>
      <ParrotSourHeader comp={<PsQT />} answer={{ pic: "", groups: [] }} />
      <br />
      <hr />
      <div style={{ textAlign: "center" }}>
        <button
          style={buttonStyle}
          type="button"
          onClick={navigate(interceptLink)}
        >
          Intercept
        </button>
        <button
          style={buttonStyle}
          type="button"
          onClick={navigate(proceduralLink)}
        >
          Procedural
        </button>
        <button style={buttonStyle} type="button" onClick={navigate(apiLink)}>
          API
        </button>
      </div>
    </div>
  )
}

ParrotSourChooser.defaultProps = {
  interceptLink: "",
  proceduralLink: "",
  apiLink: "",
}

export default ParrotSourChooser