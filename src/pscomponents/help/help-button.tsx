import { Button } from "@mui/material"
import styled from "styled-components"

export { Button }

export const HelpButton = styled(Button)`
  color: black;
  background-color: #eee;
  width: 24px !important;
  height: 24px !important;
  display: inline-block;
  border-radius: 100%;
  font-size: 18px;
  margin-left: 8px !important;
  text-align: center;
  text-decoration: none;
  -webkit-box-shadow: inset -1px -1px 1px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: inset -1px -1px 1px 0px rgba(0, 0, 0, 0.25);
  box-shadow: inset -1px -1px 1px 0px rgba(0, 0, 0, 0.25);
  float: right;
  min-width: unset !important;
  align-self: center;
`
