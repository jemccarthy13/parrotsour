/* eslint-disable react/no-children-prop */
import React, { Suspense, lazy } from "react"

import { Route, Routes } from "react-router"
import { HashRouter } from "react-router-dom"

import "./css/snackbar.css"
import "./css/styles.css"
import "./css/body.css"
import "./css/fonts.css"

const ParrotSour = lazy(() => import("./pscomponents/parrotsour"))

import ChangeLog from "./changelog/changelog"

/**
 * This is the main entry point into the front-facing application.
 *
 * The application is loaded via 'chunks' (Googe: webpack code-splitting), but
 * once the application is loaded up front, there is no loading time latency.
 *
 * Once procedural is running, the home page allows selection between procedural
 * and intercept.
 *
 * (TODO -- PROC -- figure out how to default intercept? and provide "Home" btn?)
 */
export default class Home extends React.PureComponent {
  getPS = (): JSX.Element => {
    return (
      <ParrotSour
        type="chooser"
        interceptLink="/#/intercept.html"
        proceduralLink="/#/procedural.html"
      />
    )
  }

  getPSP = (): JSX.Element => {
    return <ParrotSour type="procedural" />
  }

  getPSC = (): JSX.Element => {
    return <ParrotSour type="close" />
  }

  getPSI = (): JSX.Element => {
    return <ParrotSour type="intercept" />
  }

  render(): React.ReactElement {
    return (
      <div className="app">
        <div className="body-content" style={{ width: "100%" }}>
          <HashRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={this.getPSI()} />
                <Route path="/changelog.html" element={<ChangeLog />} />
                <Route path="/changelog" element={<ChangeLog />} />
                <Route path="/parrotsour.html" element={this.getPS()} />
                <Route path="/parrotsour" element={this.getPS()} />
                <Route path="/intercept.html" element={this.getPSI()} />
                <Route path="/intercept" element={this.getPSI()} />
                <Route path="/close.html" element={this.getPSC()} />
                <Route path="/close" element={this.getPSC()} />
                <Route path="/procedural.html" element={this.getPSP()} />
                <Route path="/procedural" element={this.getPSP()} />
              </Routes>
            </Suspense>
          </HashRouter>
        </div>
      </div>
    )
  }
}
