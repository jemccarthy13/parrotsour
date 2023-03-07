import React, { ReactElement } from "react"
import { FormControlLabel, Radio, RadioGroup } from "../../utils/muiadapter"
import { IssueHelpText } from "./styles"

type IssueSelectorProps = {
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value?: string
}

const IssueSelector = ({
  onChange,
  value = "picprob",
}: IssueSelectorProps): ReactElement => {
  return (
    <div>
      <h2>
        <u>Problem:</u>
      </h2>
      {/* Issue #13 - ISSUE_REPORTS -- change this to /issues.html and use php to read from reported issues */}
      <div style={{ marginBottom: "24px" }}>
        See a list of{" "}
        <a style={{ color: "#42a5f5" }} href="/#/changelog">
          known issues
        </a>
        .
      </div>

      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={onChange}
      >
        <FormControlLabel
          value="picprob"
          control={<Radio />}
          label={
            <>
              The answer to this picture is incorrect
              <IssueHelpText>
                A copy of the image is submitted with this report
              </IssueHelpText>
            </>
          }
        />
        <FormControlLabel
          value="feature"
          control={<Radio />}
          label={
            <>
              Feature request
              <IssueHelpText>Wouldn&lsquo;t it be nice if...</IssueHelpText>
            </>
          }
        />
        <FormControlLabel value="othprob" control={<Radio />} label="Other" />
      </RadioGroup>
    </div>
  )
}

export default IssueSelector
