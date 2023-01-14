/* istanbul ignore file */
import React, { Suspense } from "react"
import { CookieConsent, Cookies } from "react-cookie-consent"
import ReactDOM from "react-dom"
import Home from "./Home"
import GlobalSnackbarProvider from "./pscomponents/alert/globalalertprovider"
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
    <CookieConsent location="top" containerClasses="consent-banner">
      This website uses cookies to enhance the user experience. To learn more,
      please see the release notes.
    </CookieConsent>
  </React.StrictMode>,
  document.getElementById("root")
)

export const version = "4.1.2"
const cookieIsNotSet =
  Cookies.get(version + "Notify") === undefined ||
  Cookies.get(version + "Notify") === "false"

function createDismiss(key: SnackbarKey) {
  function handleVersionClick(): void {
    window.location.href = "#/changelog.html#4.1.2"
    Cookies.set(version + "Notify", true, { expires: 365 })
    snackActions.closeSnackbar(key)
  }

  function handleDismissClick(): void {
    Cookies.set(version + "Notify", true, { expires: 365 })
    snackActions.closeSnackbar(key)
  }

  return (
    <>
      <Button onClick={handleVersionClick}>{version}</Button>
      <Button onClick={handleDismissClick}>Dismiss</Button>
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
