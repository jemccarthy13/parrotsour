import { Theme, makeStyles, createTheme } from "../utils/muistylesadapter"

// Issue #21 - Themes
const theme: Theme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: "20px !important",
          width: "50%",
        },
      },
    },
  },
})

export const useStyles = makeStyles(() => ({
  changeLI: {
    color: "gray",
    borderBottom: "0px solid gray",
  },
  changeLILast: {
    color: "gray",
    borderBottom: "0px",
  },
  accordion: {
    borderRadius: "20px !important",
    width: "50%",
  },
  accordionChild: {
    borderRadius: "20px !important",
    width: "50%",
    margin: "16px 0",
  },
  column: {
    flexBasis: "33.33%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(15),
  },
}))
