/* eslint-disable react/forbid-component-props */
import React from "react"
import { useStyles } from "./changelogstyles"
import { Accordion, AccordionSummary, List, ListItem } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

/**
 * TODO -- convert this to use a fetch to retrieve the 'images' directory on
 * awardspace to show all currently reported bugs from other people
 *
 * @returns Material-ui accordion of known bugs
 */
export default function BugList(): JSX.Element {
  const classes = useStyles()

  const bugs = [
    {
      version: "4.0.4",
      description:
        "Sometimes in hard mode, picture 'width' will be <5 nm (sometimes '0')",
    },
    {
      version: "4.0.4",
      description:
        "Sometimes packages and leading edge draw really weird pictures",
    },
    {
      version: "4.0.4",
      description:
        "Sometimes random group draws with a large number of contacts?",
    },
  ]

  return (
    <Accordion defaultExpanded className={classes.accordion}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Known Bugs
      </AccordionSummary>
      <List>
        {bugs.map((bug) => {
          return (
            <ListItem
              key={bug.version + Math.random() * 100}
              className={classes.changeLI}
            >
              - ({bug.version}) {bug.description}
            </ListItem>
          )
        })}
      </List>
    </Accordion>
  )
}
