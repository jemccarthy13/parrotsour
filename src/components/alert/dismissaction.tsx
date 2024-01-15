import React, { useCallback } from "react"
import { Button } from "../../utils/muiadapter"
import { SnackbarKey, snackActions } from "./psalert"

type DismissActionProps = {
  key: SnackbarKey
  confirmText?: string
  dismissText?: string
  confirmCallback: () => void
  cancelCallback: () => void
}
export function DismissAction({
  key,
  confirmText = "Confirm",
  dismissText = "Dismiss",
  confirmCallback,
  cancelCallback,
}: Readonly<DismissActionProps>) {
  const handleConfirmClick = useCallback(() => {
    confirmCallback()
    snackActions.closeSnackbar(key)
  }, [])

  const handleDismissClick = useCallback(() => {
    cancelCallback()
    snackActions.closeSnackbar(key)
  }, [])

  return (
    <>
      <Button onClick={handleConfirmClick}>{confirmText}</Button>
      <Button onClick={handleDismissClick}>{dismissText}</Button>
    </>
  )
}
