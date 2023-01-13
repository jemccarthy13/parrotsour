import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: `
            width:5px;
            margin:auto;
            padding:auto;
          `,
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 46,
          height: 26,
          padding: 0,
          marginLeft: 16,
          marginTop: "auto",
          marginBottom: "auto",
        },
        switchBase: {
          padding: 1,
          backgroundColor: "#52d869",
        },
        thumb: {
          backgroundColor: "#52d869",
          width: 24,
          height: 24,
        },
        track: {
          backgroundColor: "dimgrey !important",
          borderRadius: 24 / 2,
          opacity: "1 !important",
        },
        checked: {
          backgroundColor: "#52d869",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: `
            font-size: 12px;
            font-family: 'Roboto Mono', monospace;
            height: 100%;
            transform: unset;
            padding-bottom: 20px;
          `,
      },
      defaultProps: {
        variant: "filled",
        size: "small",
        InputProps: {
          disableUnderline: true,
        },
      },
    },
  },
})
