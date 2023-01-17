import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "unset",
          backgroundColor: "#eee",
          color: "#444",
          cursor: "pointer",
          padding: "10px",
          border: "none",
          textAlign: "left",
          outline: "none",
          fontSize: "15px",
          width: "25%",
          borderRadius: "10px",
          height: "36px",
        },
      },
      defaultProps: {
        size: "small",
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          margin: "auto",
          padding: "8px",
          "&.Mui-checked": {
            color: "#52d869",
          },
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          "&:not(:last-of-type)": {
            marginBottom: "16px",
          },
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
    MuiListItem: {
      styleOverrides: {
        root: {
          color: "gray",
          borderBottom: "0px solid gray",
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#52d869",
          },
        },
      },
      defaultProps: { disableRipple: true },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#444",
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
          marginLeft: "16px",
        },
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
    MuiInput: {
      styleOverrides: {
        input: {
          paddingTop: "8px",
          paddingBottom: "4px",
          paddingRight: "16px",
          paddingLeft: "4px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontSize: "12px",
          fontFamily: "'Roboto Mono', monospace",
          height: "100%",
          transform: "unset",
          "& .MuiInputBase-input": {
            height: "100%",
            paddingTop: "8px",
            paddingBottom: "4px",
            paddingRight: "16px",
            paddingLeft: "8px",
          },
        },
      },
      defaultProps: {
        variant: "filled",
        size: "small",
        InputProps: {
          disableUnderline: true,
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          padding: "4px",
          marginTop: "10px",
          marginBottom: "15px",
          "&.Mui-selected": {
            border: "4px solid #52d869",
            color: "white",
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          paddingTop: "4px",
          paddingBottom: "4px",
          paddingLeft: "16px",
          paddingRight: "16px",
          "&.Mui-selected": {
            border: "2px solid #52d869",
            color: "white",
          },
          "&.Mui-selected&.MuiToggleButtonGroup-grouped&:not(:first-of-type)": {
            borderLeft: "2px solid #52d869",
          },
        },
      },
    },
  },
})
