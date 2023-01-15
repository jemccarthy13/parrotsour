/* istanbul ignore file */
import React, { Suspense } from "react"
import { CookieConsent, Cookies } from "react-cookie-consent"
import ReactDOM from "react-dom"
import { Home } from "./Home"
import { DismissAction } from "./pscomponents/alert/dismissaction"
import GlobalSnackbarProvider from "./pscomponents/alert/globalalertprovider"
import { snackActions } from "./pscomponents/alert/psalert"

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
    <CookieConsent location="top" containerClasses="consent-banner">
      This website uses cookies to enhance the user experience. To learn more,
      please see the release notes.
    </CookieConsent>
  </React.StrictMode>,
  document.getElementById("root")
)

export const version = process.env.REACT_APP_VERSION
const cookieIsNotSet =
  Cookies.get(version + "Notify") === undefined ||
  Cookies.get(version + "Notify") === "false"

function confirm() {
  Cookies.set(version + "Notify", true, { expires: 365 })
  window.location.href = `#/changelog.html#${process.env.REACT_APP_VERSION}`
}

function cancel() {
  Cookies.set(version + "Notify", true, { expires: 365 })
}

if (cookieIsNotSet) {
  snackActions.info("Check out the newest release of ParrotSour!", {
    style: { pointerEvents: "all" },
    autoHideDuration: 10000,
    preventDuplicate: true,
    action: (snackbarkey) => {
      return (
        <DismissAction
          key={snackbarkey}
          confirmCallback={confirm}
          cancelCallback={cancel}
          confirmText={`${version}`}
        />
      )
    },
  })
}
