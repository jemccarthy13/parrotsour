/* eslint-disable react/forbid-component-props */
import React from "react"
import { AccordionSummary, List } from "../utils/muiadapter"
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
    "(v4.xx?) Handle FAST and different speeds for aircraft (DataTrail upgrade)",
    "(v4.xx?) Opening/closing comm (range pics)",
    "(v4.xx?) Upgrade internals to functional components vs classes-- reduces bundle size (faster load) and execution time (less code)",
    "(v4.xx?) use styled components vs inline css (performance gain)",
    "(v4.xx?) Text to speech / speech to text & SSL security",
    "(v4.3.0) Basic Procedural simulation w/speech to text & text to speech",
    "(v4.4.0) Procedural simulation with more than one aircraft",
    "(v4.5.0) Procedural simulation with taskings (requests)",
    "(v4.6.0) Procedural simulation with ACO",
    "(v4.7.0) Procedural simulation with multiple chatrooms",
    "(v4.8.0) Procedural simulation with generated conflicts",
    "(v5.0.0) Full up procedural release, open/closing, speed(s)",
  ]

  return (
    <StyledAccordionChild>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Scheduled Features
      </AccordionSummary>
      <List>
        {features.map((feature) => {
          return (
            <ChangeLI key={`${feature.length}${feature.slice(0, 15)}`}>
              - {feature}
            </ChangeLI>
          )
        })}
      </List>
    </StyledAccordionChild>
  )
}
