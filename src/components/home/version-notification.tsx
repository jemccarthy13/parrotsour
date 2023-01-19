import React, { useCallback, useEffect } from "react"
import { Cookies } from "react-cookie-consent"
import { DismissAction } from "../alert/dismissaction"
import { SnackbarKey, snackActions } from "../alert/psalert"

export const VersionNotification = () => {
  const version = process.env.REACT_APP_VERSION
  const cookieIsNotSet =
    Cookies.get(version + "Notify") === undefined ||
    Cookies.get(version + "Notify") === "false"

  const confirm = useCallback(() => {
    Cookies.set(version + "Notify", true, { expires: 365 })
    window.location.href = `#/changelog.html#${process.env.REACT_APP_VERSION}`
  }, [version])

  const cancel = useCallback(() => {
    Cookies.set(version + "Notify", true, { expires: 365 })
  }, [version])

  const action = useCallback((key: SnackbarKey) => {
    return (
      <DismissAction
        key={key}
        confirmCallback={confirm}
        cancelCallback={cancel}
        confirmText={`${version}`}
      />
    )
  }, [])

  useEffect(() => {
    if (cookieIsNotSet && process.env.REACT_APP_MAINTENANCE !== "true") {
      snackActions.info("Check out the newest release of ParrotSour!", {
        style: { pointerEvents: "all" },
        autoHideDuration: 10000,
        preventDuplicate: true,
        action: action,
      })
    }
  }, [])

  return null
}
