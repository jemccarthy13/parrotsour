import { Accordion, Typography } from "@mui/material"
import styled from "styled-components"

export const Column = styled("div")`
  flex-basis: 33.33%;
`

export const Heading = styled(Typography)`
  font-size: 16px;
`
export const SecondaryHeading = styled(Typography)`
  font-size: 16px;
  color: white;
`

export const StyledAccordion = styled(Accordion)`
  border-radius: 20px !important;
  width: 50%;
`

export const StyledAccordionChild = styled(Accordion)`
  border-radius: 20px !important;
  width: 50%;
  margin: 16px 0;
`
