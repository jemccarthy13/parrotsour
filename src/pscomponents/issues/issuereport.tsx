import React, { MutableRefObject, ReactElement, useRef, useState } from "react"

import IssueSelector from "./issueselector"

import Snackbar from "../alert/psalert"

import { PictureAnswer } from "../../canvas/canvastypes"

import "../../css/collapsible.css"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "../../utils/muiadapter"

type IRProps = {
  answer?: PictureAnswer
}

export default function IssueReport(props: IRProps): ReactElement {
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
      const { answer } = props
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
        Snackbar.success("Submitted!")
        handleToggleIssueForm()
      } else {
        Snackbar.error("Issue report failed.\nTry again later.")
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
    <div style={{ width: "25%" }}>
      <button
        id="showFormBtn"
        type="button"
        style={{ marginLeft: "5%", top: "5px" }}
        onClick={handleToggleIssueForm}
      >
        {" "}
        Report Issue{" "}
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
          <TextField
            classes={{ root: "textfull" }}
            required
            id="email"
            label="Email"
            fullWidth
            type="text"
            onChange={handleEmailChange}
          />
          <TextField
            classes={{ root: "textfull" }}
            required
            id="issue"
            label="Issue Description"
            fullWidth
            type="text"
            multiline
            onChange={handleTextChanged}
          />
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

IssueReport.defaultProps = {
  answer: {
    pic: "",
    groups: [],
  },
}
