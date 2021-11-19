/* eslint-disable react/forbid-component-props, react/jsx-no-bind */
/* istanbul ignore file */
import ReactDOM from "react-dom"
import React, { Suspense } from "react"
import Home from "./Home"

import GlobalSnackbarProvider from "./pscomponents/alert/globalalertprovider"

import CookieConsent, { Cookies } from "react-cookie-consent"

import snackActions, { SnackbarKey } from "./pscomponents/alert/psalert"
import { Button } from "./utils/muiadapter"

export default ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalSnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <Home />
      </GlobalSnackbarProvider>
    </Suspense>
    <CookieConsent
      location="top"
      style={{ backgroundColor: "#a0a1a0", border: "2px solid grey" }}
    >
      This website uses cookies to enhance the user experience. To learn more,
      please see the release notes.
    </CookieConsent>
  </React.StrictMode>,
  document.getElementById("root")
)

/**
 *
 */
export const version = "4.0.6"
const cookieIsNotSet =
  Cookies.get(version + "Notify") === undefined ||
  Cookies.get(version + "Notify") === "false"

function createDismiss(key: SnackbarKey) {
  return (
    <>
      <Button
        onClick={() => {
          window.location.href = "#/changelog.html#4.0.6"
          Cookies.set(version + "Notify", true, { expires: 365 })
          snackActions.closeSnackbar(key)
        }}
      >
        {version}
      </Button>
      <Button
        onClick={() => {
          Cookies.set(version + "Notify", true, { expires: 365 })
          snackActions.closeSnackbar(key)
        }}
      >
        Dismiss
      </Button>
    </>
  )
}
// remove after confidence most people have seen new release notification
if (cookieIsNotSet) {
  snackActions.info("Check out the newest release of ParrotSour!", {
    style: { pointerEvents: "all" },
    autoHideDuration: 10000,
    preventDuplicate: true,
    action: (key) => {
      return createDismiss(key)
    },
  })
}
