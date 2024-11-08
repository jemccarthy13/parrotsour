import React, { useEffect } from "react"
import {
  Accordion,
  AccordionSummary,
  List,
  ListItem,
} from "../../utils/muiadapter"
import { ExpandMoreIcon } from "../../utils/muiiconadapter"
import { Column, Heading, SecondaryHeading, StyledAccordion } from "./styles"

/**
 * @returns Pretty formatted accordion of version history, with
 * changes/fixes/general improvements
 */

type vHistory = {
  version: string
  date: string
  features: string[]
  fixes: string[]
  improvements: string[]
}

type VersionList = vHistory[]

export default function VersionHistory(): JSX.Element {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // All of the version information, manually sorted newest->oldest
  // the order in this list === display order
  const versionHistory: VersionList = [
    {
      version: "4.3.0",
      date: "21 Feb 2024",
      features: [
        "Update LEADING EDGE to format 'SECOND WAVE' (Oct 2024 ALSSA)",
        "First attempt at ParrotSour WAVE comm",
      ],
      fixes: [
        "Remove 'AND' from stacks according to ALSSA October 2024 update",
        "Fix to WEIGHTED WALL calculations; previously WALLs might be WEIGHTED when not actually meeting criteria",
        "Change to ALSSA from ALSA where applicable",
        "Update tip/help text to stop mentioning ALSA as a new standard",
        "Update help text to describe PS as a training tool, rather than a 3-3 difference training tool",
        "Updated dependencies / open source tools",
      ],
      improvements: [],
    },
    {
      version: "4.2.2",
      date: "21 Feb 2024",
      features: [],
      fixes: [
        "Fixed issue with bullseye drawing during animation. It should now show properly",
        "Fixed long-term issue with picture of the day generation.",
        "Fixed some stability issues and minor formatting (whitespace) errors.",
      ],
      improvements: [
        "Added calculations for weighted wall, which was noticeably absent until now",
        "Updated several security fixes, patched some vulnerabilities, squashed some bugs",
        "Added at/over bullseye formatting if group is at/over bullseye (depends on format chosen)",
        "Reduced the complexity of some calculations; speeds up performance in some areas",
      ],
    },
    {
      version: "4.2.1",
      date: "22 May 2023",
      features: [],
      fixes: [
        "Fixed bullseye and increased stability of bullseye drawing / measuring app-wide",
        "Fixed BRAA and increased stability of BRAA drawing / measuring app-wide",
        "Provided center of mass (location) and blue air position on API export",
      ],
      improvements: [],
    },
    {
      version: "4.2.0",
      date: "15 Jan 2023",
      features: [
        "Added maintenance splash page for down times",
        "Added secure 'https' route and force traffic to use SSL",
      ],
      fixes: [
        "Upgrade to latest version of underlying frameworks and FOSS toolkits",
        "Added more tests and test coverage",
        "Squashed some bugs",
        "Reduced bundle size (faster loading times)",
      ],
      improvements: [
        "Upgraded some internals to latest development patterns",
        "Improved reusability of serveral code modules",
        "Redued code complexity in some areas (performance and maintenance benefits)",
        "API v2",
      ],
    },
    {
      version: "4.1.2",
      date: "7 Mar 2021",
      features: [],
      fixes: ["4.1.1 Minor security and stability improvements"],
      improvements: ["4.1.2 API v1"],
    },
    {
      version: "4.1.0",
      date: "29 Nov 2021",
      features: [],
      fixes: [
        "September 2021 ALSA - hot is assumed for pictures where all groups track hot",
        "Minor bug fixes with some internal logic discovered via automated testing",
      ],
      improvements: [
        "Minor edits to internal functions reduce probability of error",
        "Some restructuring was done to help for future ALSA updates",
        "Minor formatting change to answers to reduce unneccessary white spaces",
        "Unit tests to cover picture formatting should increase stability",
        "Added ability to convert reported issues to tests rapidly to facilitate quick fixes",
      ],
    },
    {
      version: "4.0.5",
      date: "12 Aug 2021",
      features: [
        "Can now select the number of contacts for red air via the XvX selector.",
        "CAP supports all standard picture types.",
        "Please report issues as you see them. The code behind PS has undergone significant changes recently!",
      ],
      fixes: [],
      improvements: [
        "Refactor of how pictures are drawn provides stability and reduces code " +
          "cyclomatic complexity.",
      ],
    },
    {
      version: "4.0.4",
      date: "20 May 2021",
      features: [
        "Please report issues as you see them. The code behind PS has undergone significant changes recently!",
        "CAP picture select now supports multiple picture types.",
        "Cursor over red air displays info in the top left corner (rudimentary first draft).",
        "Shift/CapsLock over red air displays the stack/alt boot feature.",
        "Notifications are now a one-time thing with the use of cookies. Cookies also allow some of " +
          "your selected preferences (i.e. hard mode, 'I want to measure', animation speed) " +
          "to be saved between sessions.",
        "Blue air animates and attempts to intercept red air",
        "New picture during animation functions to stop animation and generate a new picture",
        "Toggling DataTrail style (between RADAR/ARROW) will redraw the current picture. This allows " +
          "radar toggling at any point (including during animation) ",
        "A new ChangeLog page - featuring detailed Release Notes for major/minor versions",
        "Regression testing was added internally so future changes don't break existing logic",
      ],
      fixes: [
        "Opening/Closing is supported by better logic.",
        "Animation doesn't pause on measure (due to internal improvements this became possible)",
        "Animation no longer interferes with other internal processing (bull on cursor display became " +
          "more responsive during animation)",
        "Anchoring priorities verified for WAL/CHAMP. All pictures should now anchor correctly",
        "Lowest value for speed slider adjusted slower due to lack of pause on measure",
        "Pictures should no longer draw off canvas",
        "With the new clamp to canvas logic, pictures such as lead edge/packages are smarter with where they draw. " +
          "Previously, leading edge would fake <= 40 nm follow-on. Internally pictures can now be specified in terms of " +
          "'min and/or max distance from blue'",
        "Leading edge was redesigned to function a little smarter. Intended for less possible overlap between pictures",
        "Measurements bug fixed due to new internal DataTrail usage; measurements and braa/bull displays " +
          "are now based on 'center of mass'. Previous logic tended to base measurements on draw offset location " +
          "rather than truth data",
        "Clicking the New Pic button mid-animation functions correctly by stopping animation and generating a new picture",
        "On the backend, issue reporting now sends the correct message and doesn't include images with a feature request",
      ],
      improvements: [
        "Refactor of existing components and utils should provide much better stability throughout " +
          "and provide support for future functionality",
        "Intent was introduced internally as a concept. Intent allows for aircraft/groups to 'want' " +
          "to go to a specific heading or location. The animation logic tries to get each aircraft " +
          "to their desired location or heading. For intercepts, red air goes to the nearest 90 degree increment " +
          "towards blue. Blue will update it's heading towards red.",
        "Group/Aircraft internal API was overhauled. Aircraft are now stored at the singular level, " +
          "to allow each Aircraft it's own intent",
        "A side effect of singular Aircraft is that now Groups can split/merge in the future",
        "Maneuver logic was updated internally; aircraft can possibly maneuver more than once (future feature).",
        "Internal animation was overhauled for stability.",
        "",
      ],
    },
    {
      version: "3.1.0",
      date: "30 March 2021",
      features: [
        "Implemented radar/arrow toggle (make it look like radar returns instead of arrows)",
      ],
      fixes: ["Fixed small issue in package comm (labeling/anchoring)"],
      improvements: [
        "Migrated procedural implementation to typescript -- working on further development",
        "Finished conversion to typescript & made React Component library",
      ],
    },
    {
      version: "3.0.5",
      date: "21 March 2021",
      features: ["Bullseye follows mouse on canvas", "N/S orientation toggle"],
      fixes: [
        "Massive fixes to animation logic and arrow drawing",
        "Bug hunt and standards adherence (typescript)",
        "Threat now includes 'THREAT GROUP' and correct ALSA formatting",
      ],
      improvements: [
        "Codebase migrated to React and Typescript; Components to be easily included in other sites or mobile app",
        "Styling and UI design improvements due to react",
        "Responsiveness improvement and load time decrase d2 code splitting",
      ],
    },
    {
      version: "2.0.0",
      date: "15 February 2021",
      features: ["Added toggle to swap BRAA/BULLSEYE display order on screen"],
      fixes: ["Fixed anchoring pri's for more picture types"],
      improvements: ["Reduced code base size"],
    },
    {
      version: "1.3.4",
      date: "10 February 2021",
      features: ["Implemented opening closing for azimuth"],
      fixes: [
        "Fixed anchoring priorities for some picture types",
        "Fixed several small bugs",
        "Fixed a measurement issue (stale measurement on screen)",
        "Addressed several reported issues",
      ],
      improvements: [],
    },
    {
      version: "1.3.3",
      date: "15 Jan 2021",
      features: [
        "Implemented EA / Bogey Dope request/response",
        "'Hard Mode' random track direction and assess for echelon/weighted",
        "Implemented CAP and package",
        "Bug reporting via email submission",
      ],
      fixes: [
        "Multi-blue air formation bug fix",
        "Braaseye drawing accuracy improved",
      ],
      improvements: [],
    },
    {
      version: "1.2.2",
      date: "10 Jan 2021",
      features: ["THREAT as a picture type", "Expanded quick tips"],
      fixes: ["Measuring before/mid fight bugs fixed"],
      improvements: [
        "ALSA help button now has a link to the actual pub",
        "Initial support for mobile browsing and Touch-to-Measure",
        "Minor styling improvements",
        "Code splitting improvements",
      ],
    },
    {
      version: "1.2.0",
      date: "05 Jan 2021",
      features: [
        "Initial Release",
        "Select desired picture type",
        "Leading edge pictures",
        "Initial Red air basic maneuvers (picks new heading at predetermined range from blue)",
      ],
      fixes: [
        "Minor formatting fixes (stacks, high, anchoring > 10 nm)",
        "Minor appearance fixes (track dir, leading edge)",
        "Measure to pause the animation. Release resumes animation.",
        "Red air animations are 'smarter'",
        "Minor math calculations fixed",
        "Canvas styling to help math calculations fix",
      ],
      improvements: [],
    },
  ]

  return (
    <StyledAccordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Version History/Change Log
      </AccordionSummary>

      {versionHistory.map((vers, idx) => {
        return (
          <div key={"div" + vers.version}>
            <Accordion key={vers.version} defaultExpanded={idx === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Column>
                  <Heading>
                    <span id={vers.version}>
                      <b>Release {vers.version}</b>
                    </span>
                  </Heading>
                </Column>
                <Column>
                  <SecondaryHeading>{vers.date}</SecondaryHeading>
                </Column>
              </AccordionSummary>
              {vers.features.length > 0 && (
                <List>
                  &#128077; &nbsp;New Features
                  {vers.features.map((vFeat: string) => {
                    return (
                      <ListItem key={vFeat.length + Math.random() * 100}>
                        - {vFeat}
                      </ListItem>
                    )
                  })}
                </List>
              )}
              {vers.fixes.length > 0 && (
                <List>
                  &#10004;&#65039;&nbsp;Fixes
                  {vers.fixes.map((vFix: string) => {
                    return (
                      <ListItem key={vFix.length + Math.random() * 100}>
                        - {vFix}
                      </ListItem>
                    )
                  })}
                </List>
              )}
              {vers.improvements.length > 0 && (
                <List>
                  &#128640;Improvements
                  {vers.improvements.map((vImp: string) => {
                    return (
                      <ListItem key={vImp.length + Math.random() * 100}>
                        - {vImp}
                      </ListItem>
                    )
                  })}
                </List>
              )}
            </Accordion>
          </div>
        )
      })}
    </StyledAccordion>
  )
}
