/* eslint-disable react/forbid-component-props */
import React from "react"
import {
  AccordionSummary,
  List,
} from "../utils/muiadapter"
import { ExpandMoreIcon } from "../utils/muiiconadapter"
import { ChangeLI, StyledAccordionChild } from "./styles"

/**
 * Returns a pretty list of scheduled features.
 *
 * To add a feature, add another string to the "features" array.
 *
 * @returns Material-ui accordion of anticipated features.
 */
export default function BugList(): JSX.Element {

  const features = [
    "(v4.2.0) Handle FAST and different speeds for aircraft (DataTrail upgrade)",
    "(v4.2.1) Opening/closing comm (range pics)",
    "(v4.3.0) Basic Procedural simulation",
    "(v4.4.0) Procedural simulation with more than one aircraft",
    "(v4.5.0) Procedural simulation with taskings (requests)",
    "(v4.6.0) Procedural simulation with ACO",
    "(v4.7.0) Procedural simulation with multiple chatrooms",
    "(v4.8.0) Procedural simulation with generated conflicts",
    "(v5.0.0) Full up procedural release",
  ]

  return (
    <StyledAccordionChild>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Scheduled Features
      </AccordionSummary>
      <List>
        {features.map((feature) => {
          return (
            <ChangeLI
              key={feature.length + Math.random() * 100}
            >
              - {feature}
            </ChangeLI>
          )
        })}
      </List>
    </StyledAccordionChild>
  )
}
