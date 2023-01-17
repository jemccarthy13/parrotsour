/* istanbul ignore file */
import React, { Suspense } from "react"
import { CookieConsent, Cookies } from "react-cookie-consent"
import { createRoot } from "react-dom/client"
import { DismissAction } from "./components/alert/dismissaction"
import GlobalSnackbarProvider from "./components/alert/globalalertprovider"
import { snackActions } from "./components/alert/psalert"
import { Home } from "./components/home/home"
import "./css/body.css"
import "./css/fonts.css"

const container = document.getElementById("root")
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalSnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <Home />
      </GlobalSnackbarProvider>
    </Suspense>
    <CookieConsent location="top">
      This website uses cookies to enhance the user experience. To learn more,
      please see the release notes.
    </CookieConsent>
  </React.StrictMode>
)

// TODO -- move to a null-returning Component, and put after CookieConsent above?
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
