
import { Accordion, ListItem, Typography } from '@mui/material';
import styled from 'styled-components';

export const ChangeLI = styled(ListItem)`
  color: gray;
  border-bottom: 0px solid gray;
`;

export const Column = styled('div')`
  flex-basis: 33.33%;
`

export const Heading = styled(Typography)`
  font-size: ${(props) => props.theme.typography.pxToRem(15)};
`
export const SecondaryHeading = styled(Typography)`
  color: ${(props) => props.theme.palette.text.secondary};
  font-size: ${(props) => props.theme.typography.pxToRem(15)};
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
  
