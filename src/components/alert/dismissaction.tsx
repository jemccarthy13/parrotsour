import React, { useCallback } from "react"
import { Button } from "../../utils/muiadapter"
import { SnackbarKey, snackActions } from "./psalert"

type DismissActionProps = {
  snackKey: SnackbarKey
  confirmText?: string
  dismissText?: string
  confirmCallback: () => void
  cancelCallback: () => void
}
export function DismissAction({
  snackKey,
  confirmText = "Confirm",
  dismissText = "Dismiss",
  confirmCallback,
  cancelCallback,
}: Readonly<DismissActionProps>) {
  const handleConfirmClick = useCallback(() => {
    confirmCallback()
    snackActions.closeSnackbar(snackKey)
  }, [])

  const handleDismissClick = useCallback(() => {
    cancelCallback()
    snackActions.closeSnackbar(snackKey)
  }, [])

  return (
    <>
      <Button onClick={handleConfirmClick}>{confirmText}</Button>
      <Button onClick={handleDismissClick}>{dismissText}</Button>
    </>
  )
}
