import React, { Suspense, lazy } from "react"
import { Navigate, Route, Routes } from "react-router"
import { HashRouter } from "react-router-dom"
import { APIUsage } from "../api/usage"
import ChangeLog from "../changelog/changelog"
import { Maintenance } from "./maintenance"
import { HomePanel } from "./styles"

const ParrotSour = lazy(() => import("./parrotsour"))

/**
 * This is the main entry point into the front-facing application.
 *
 * The application is loaded via 'chunks' (Googe: webpack code-splitting), but
 * once the application is loaded up front, there is no loading time latency.
 *
 * Once procedural is running, the home page allows selection between procedural
 * and intercept.
 */
export const Home = () => {
  if (process.env.REACT_APP_MAINTENANCE === "true") {
    return <Maintenance />
  }

  return (
    <HomePanel>
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/intercept" />} />
            <Route
              path="/chooser"
              element={
                <ParrotSour
                  type="chooser"
                  interceptLink="/#/intercept"
                  proceduralLink="/#/procedural"
                  apiLink="/#/api"
                />
              }
            />
            <Route path="/parrotsour" element={<Navigate to="/chooser" />} />
            <Route
              path="/intercept"
              element={<ParrotSour type="intercept" />}
            />
            <Route
              path="/intercept.html"
              element={<Navigate to="/intercept" />}
            />
            <Route path="/close" element={<ParrotSour type="close" />} />
            <Route path="/close.html" element={<Navigate to="/close" />} />
            <Route
              path="/procedural"
              element={<ParrotSour type="procedural" />}
            />
            <Route
              path="/procedural.html"
              element={<Navigate to="/procedural" />}
            />
            <Route path="/changelog" element={<ChangeLog />} />
            <Route
              path="/changelog.html"
              element={<Navigate to="/changelog" />}
            />
            <Route path="/test" element={<ParrotSour type="test" />} />
            <Route path="/api" element={<ParrotSour type="api" />} />
            <Route path="/api/usage" element={<APIUsage />} />
            <Route path="/api.html" element={<Navigate to="/api" />} />
            <Route
              path="/parrotsour.html"
              element={<Navigate to="/chooser" />}
            />
          </Routes>
        </Suspense>
      </HashRouter>
    </HomePanel>
  )
}
