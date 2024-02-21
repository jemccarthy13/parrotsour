import {
  OptionsObject,
  SnackbarKey,
  closeSnackbar,
  enqueueSnackbar,
  SnackbarProvider,
} from "notistack"

export const snackActions = {
  success(msg: string, options: OptionsObject = {}): SnackbarKey {
    return enqueueSnackbar({ message: msg, ...options, variant: "success" })
  },
  warning(msg: string, options: OptionsObject = {}): SnackbarKey {
    return enqueueSnackbar({ message: msg, ...options, variant: "warning" })
  },
  info(msg: string, options: OptionsObject = {}): SnackbarKey {
    return enqueueSnackbar({ message: msg, ...options, variant: "info" })
  },
  error(msg: string, options: OptionsObject = {}): SnackbarKey {
    return enqueueSnackbar({ message: msg, ...options, variant: "error" })
  },
  closeSnackbar(key: SnackbarKey): void {
    closeSnackbar(key)
  },
  toast(msg: string, options: OptionsObject = {}): SnackbarKey {
    return enqueueSnackbar({ message: msg, ...options })
  },
}

export type { SnackbarKey }
export { SnackbarProvider }
