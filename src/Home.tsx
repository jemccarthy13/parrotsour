import React, { Suspense, lazy } from "react"
import { Navigate, Route, Routes } from "react-router"
import { HashRouter } from "react-router-dom"
import ChangeLog from "./changelog/changelog"
import "./css/snackbar.css"
import "./css/styles.css"
import "./css/body.css"
import "./css/fonts.css"

const ParrotSour = lazy(() => import("./pscomponents/home/parrotsour"))
const Login = lazy(() => import("./pscomponents/home/login"))

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
    return <>Maintenance</>
  }

  return (
    <div className="app">
      <div className="body-content" style={{ width: "100%" }}>
        <HashRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/intercept" />} />
              <Route
                path="/chooser"
                element={
                  <ParrotSour
                    type="chooser"
                    interceptLink="/#/intercept.html"
                    proceduralLink="/#/procedural.html"
                    apiLink="/#/api.html"
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
              <Route path="/api" element={<ParrotSour type="api" />} />
              <Route
                path="/parrotsour.html"
                element={<Navigate to="/chooser" />}
              />
              {process.env.NODE_ENV === "development" && (
                <Route path="/login" element={<Login />} />
              )}
            </Routes>
          </Suspense>
        </HashRouter>
      </div>
    </div>
  )
}
