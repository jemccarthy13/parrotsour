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
    MuiListItem: {
      styleOverrides: {
        root: {
          color: "gray",
          borderBottom: "0px solid gray",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        track: {
          backgroundColor: "#a0a1a0",
          border: "none",
        },
        rail: {
          backgroundColor: "#d3d3d3",
        },
        thumb: {
          backgroundColor: "#52d869",
          height: "24px",
          width: "24px",
          border: " 2px solid #52d869",
          "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
            boxShadow: "none",
          },
          "&:before": {
            display: "none",
          },
        },
        root: {
          width: "60%",
          alignSelf: "center",
          display: "inline-flex",
          padding: "unset",
          marginLeft: "auto",
        },
      },
      defaultProps: {},
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
          "&.Mui-checked": {
            backgroundColor: "#52d869",
          },
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
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: `
            font-size: 12px;
            font-family: 'Roboto Mono', monospace;
            height: auto;
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
    MuiInputBase: {
      styleOverrides: {
        root: `
          font-size: 14px;
          height: auto !important;
          transform: unset;
        `,
      },
    },
  },
})
