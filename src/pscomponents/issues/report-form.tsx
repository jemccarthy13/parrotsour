import React, { MutableRefObject, ReactElement, useRef, useState } from "react"
import { PictureAnswer } from "../../canvas/canvastypes"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "../../utils/muiadapter"
import { snackActions } from "../alert/psalert"
import IssueSelector from "./selector"
import "../../css/collapsible.css"

type IRProps = {
  answer?: PictureAnswer
}

export default function IssueReport({
  answer = { groups: [], pic: "" },
}: IRProps): ReactElement {
  const [showIssueForm, setShowIssueForm] = useState(false)
  const [selection, setSelection] = useState("picprob")
  const [submitEnabled, setSubmitEnabled] = useState(true)
  const [email, setEmail] = useState("")
  const [text, setText] = useState("")

  const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null)

  /**
   * Toggle the issue form display when the control button is pressed in the header,
   * or when clickaway happens
   */
  function handleToggleIssueForm() {
    setShowIssueForm(!showIssueForm)
  }

  function onIssueSelChanged(val: string): () => void {
    return () => {
      setSelection(val)
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setEmail(e.currentTarget.value)
  }

  function handleTextChanged(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setText(e.currentTarget.value)
  }

  async function handleSubmit(): Promise<void> {
    let goodForm = false

    if (formRef.current) {
      goodForm = formRef.current.reportValidity()
    }

    setSubmitEnabled(false)
    if (goodForm) {
      const canvas: HTMLCanvasElement = document.getElementById(
        "pscanvas"
      ) as HTMLCanvasElement

      let realEmail = email ? email : "unknown"

      if (email && email.indexOf("@") === -1) realEmail += "@gmail.com"

      const realText = text ? text : "unknown"

      const formData = new FormData()

      formData.append("email", realEmail)
      formData.append("comments", realText + " \n\n" + answer)
      formData.append("problemtype", selection)

      if (selection === "picprob")
        formData.append("image", canvas.toDataURL("image/png"))
      const response = await fetch(
        process.env.PUBLIC_URL + "/database/emailissue.php",
        {
          method: "POST",
          body: formData,
        }
      )

      if (response.ok) {
        snackActions.success("Submitted!")
        handleToggleIssueForm()
      } else {
        snackActions.error("Issue report failed.\nTry again later.")
      }
    }

    setSubmitEnabled(true)
  }

  async function handleFormSubmit(
    evt: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    evt.preventDefault()
    handleSubmit()
  }

  async function handleBtnSubmit(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    evt.preventDefault()
    handleSubmit()
  }

  /**
   * Handle cancel button click
   * @param event
   */
  function handleCancelClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault()
    setShowIssueForm(false)
  }

  return (
    <div data-testid="iss-rpt-form" style={{ width: "25%" }}>
      <button
        data-testid="iss-rpt-btn"
        id="showFormBtn"
        type="button"
        style={{ marginLeft: "5%", top: "5px" }}
        onClick={handleToggleIssueForm}
      >
        Report Issue
      </button>
      <Dialog
        fullScreen={false}
        open={showIssueForm}
        onClose={handleToggleIssueForm}
      >
        <DialogContent>
          {/* Issue #13 - ISSUE_REPORTS -- change this to /issues.html and use php to read from reported issues */}
          See a list of <a href="/#/changelog.html">known issues</a>.
        </DialogContent>

        <form onSubmit={handleFormSubmit} ref={formRef}>
          <DialogContent>
            <IssueSelector selectionChanged={onIssueSelChanged} />
          </DialogContent>
          <div style={{ width: "75%", margin: "auto", height: "100%" }}>
            <TextField
              required
              id="email"
              label="Email"
              fullWidth
              type="text"
              onChange={handleEmailChange}
            />
            <TextField
              required
              id="issue"
              name="issuetxt"
              label="Issue Description"
              fullWidth
              type="text"
              multiline
              onChange={handleTextChanged}
            />
          </div>

          <button type="button" hidden onClick={handleSubmit} />
          <DialogActions>
            <Button
              id="submitIssueReport"
              onClick={handleBtnSubmit}
              disabled={!submitEnabled}
            >
              Submit
            </Button>
            <Button id="cancelIssueReport" onClick={handleCancelClick}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}
