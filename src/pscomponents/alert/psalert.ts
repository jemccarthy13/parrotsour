import React from "react"
import {
  OptionsObject,
  SnackbarKey,
  useSnackbar,
  WithSnackbarProps,
  SnackbarProvider,
} from "notistack"

let snackbarRef: WithSnackbarProps

export const SnackbarUtilsConfigurator: React.FC = () => {
  snackbarRef = useSnackbar()

  return null
}

export const snackActions = {
  success(msg: string, options: OptionsObject = {}): SnackbarKey {
    return this.toast(msg, { ...options, variant: "success" })
  },
  warning(msg: string, options: OptionsObject = {}): SnackbarKey {
    return this.toast(msg, { ...options, variant: "warning" })
  },
  info(msg: string, options: OptionsObject = {}): SnackbarKey {
    return this.toast(msg, { ...options, variant: "info" })
  },
  error(msg: string, options: OptionsObject = {}): SnackbarKey {
    return this.toast(msg, { ...options, variant: "error" })
  },
  closeSnackbar(key: SnackbarKey): void {
    snackbarRef.closeSnackbar(key)
  },
  toast(msg: string, options: OptionsObject = {}): SnackbarKey {
    return snackbarRef.enqueueSnackbar(msg, options)
  },
}

export type { SnackbarKey }
export { SnackbarProvider }
