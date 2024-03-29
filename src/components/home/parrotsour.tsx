import React, { ReactElement, Suspense, lazy } from "react"
import { ThemeProvider } from "@mui/material"
import { theme } from "../../theme"
import { ParrotSourChooser } from "./chooser"

const ParrotSourIntercept = lazy(() => import("../intercept/parrotsour"))
const ParrotSourAPI = lazy(() => import("../api/parrotsourapi"))
const ParrotSourProcedural = lazy(() => import("../procedural/parrotsour"))
const ParrotSourClose = lazy(() => import("../close/parrotsour"))
const ParrotSourTest = lazy(() => import("../test/parrotsour"))

type PSProps = {
  type: string
  interceptLink?: string
  proceduralLink?: string
  apiLink?: string
}

/**
 * The main entry class for a ParrotSour component
 */
export const ParrotSour = ({
  type,
  interceptLink = "#/intercept",
  proceduralLink = "#/procedural",
  apiLink = "#/api",
}: PSProps): ReactElement => {
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
  } else if (type === "test") {
    comp = <ParrotSourTest />
  } else if (type === "close") {
    comp = <ParrotSourClose />
  } else if (type === "api") {
    comp = <ParrotSourAPI />
  }

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<div>Loading...</div>}>{comp}</Suspense>
    </ThemeProvider>
  )
}

export default ParrotSour
