/* istanbul ignore file */
import React, { Suspense } from "react"
import { CookieConsent } from "react-cookie-consent"
import { createRoot } from "react-dom/client"
import GlobalSnackbarProvider from "./components/alert/globalalertprovider"
import { Home } from "./components/home/home"
import "./css/body.css"
import "./css/fonts.css"
import { VersionNotification } from "./components/home/version-notification"

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
    <VersionNotification />
  </React.StrictMode>
)
