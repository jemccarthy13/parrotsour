import React from "react"
import { AccordionSummary, List } from "../utils/muiadapter"
import { ExpandMoreIcon } from "../utils/muiiconadapter"
import { ChangeLI, StyledAccordion } from "./styles"

/**
 * Issue #13 -- allow this to also use a fetch to retrieve the 'images' directory on
 * awardspace to show all currently reported bugs from other people
 *
 * @returns Material-ui accordion of known bugs
 */
export default function BugList(): JSX.Element {
  const bugs = [
    {
      version: "4.1.0",
      description:
        "Sometimes in hard mode, picture 'width' will be <5 nm (sometimes '0')",
    },
    {
      version: "4.1.0",
      description:
        "Sometimes packages and leading edge draw really weird pictures",
    },
    {
      version: "4.1.0",
      description:
        "Sometimes random group draws with a large number of contacts?",
    },
  ]

  return (
    <StyledAccordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Known Bugs
      </AccordionSummary>
      <List>
        {bugs.map((bug) => {
          return (
            <ChangeLI key={`${bug.version}${bug.description.slice(0, 5)}`}>
              - ({bug.version}) {bug.description}
            </ChangeLI>
          )
        })}
      </List>
    </StyledAccordion>
  )
}
