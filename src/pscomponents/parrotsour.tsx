import React, { lazy, ReactElement, Suspense } from "react"
import { ParrotSourChooser } from "./parrotsourchooser"

const ParrotSourIntercept = lazy(
  () => import("./intercept/parrotsourintercept")
)
const ParrotSourProcedural = lazy(
  () => import("./procedural/parrotsourprocedural")
)
const ParrotSourAPI = lazy(
  () => import("./api/parrotsourapi")
)
const ParrotSourClose = lazy(() => import("./close/parrotsourclose"))

type PSProps = {
  type: string
  interceptLink?: string
  proceduralLink?: string
  apiLink?: string
}

/**
 * The main entry class for a ParrotSour component
 */
export const ParrotSour = (props: PSProps): ReactElement => {
  const { type, interceptLink, proceduralLink, apiLink } = props

  let comp = (
    <ParrotSourChooser
      interceptLink={interceptLink}
      proceduralLink={proceduralLink}
      apiLink={apiLink}
    />
  )
  if (type === "intercept") {
    comp = <ParrotSourIntercept />
  } else if (type === "procedural") {
    comp = <ParrotSourProcedural />
  } else if (type === "close") {
    comp = <ParrotSourClose />
  }  else if (type === "api") {
    comp = <ParrotSourAPI />
  }
  return <Suspense fallback={<div>Loading...</div>}>{comp}</Suspense>
}

ParrotSour.defaultProps = {
  interceptLink: "#/intercept.html",
  proceduralLink: "#/procedural.html",
  apiLink: "#/api.html",
}

export default ParrotSour
