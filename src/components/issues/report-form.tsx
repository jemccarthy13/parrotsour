import React, {
  MutableRefObject,
  ReactElement,
  useCallback,
  useRef,
  useState,
} from "react"
import { InputLabel } from "@mui/material"
import { PictureAnswer } from "../../canvas/canvastypes"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "../../utils/muiadapter"
import { snackActions } from "../alert/psalert"
import { IssueType, getFormData } from "./formutils"
import IssueSelector from "./selector"
import { FormFieldContainer } from "./styles"

type IRProps = {
  answer?: PictureAnswer
}

export default function IssueReport({
  answer = { groups: [], pic: "" },
}: Readonly<IRProps>): ReactElement {
  const [showIssueForm, setShowIssueForm] = useState(false)
  const [selection, setSelection] = useState<IssueType>(IssueType.PICTURE)
  const [submitEnabled, setSubmitEnabled] = useState(true)
  const [email, setEmail] = useState("")
  const [text, setText] = useState("")

  const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null)

  const handleToggleIssueForm = useCallback(() => {
    setShowIssueForm((prev) => !prev)
  }, [])

  const onIssueSelChanged = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setSelection(evt.currentTarget.value as IssueType)
    },
    []
  )

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEmail(e.currentTarget.value)
    },
    [setEmail, email]
  )

  const handleTextChanged = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.currentTarget.value)
    },
    [setText]
  )

  const handleCancelClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault()
      setShowIssueForm(false)
    },
    [setShowIssueForm]
  )

  const handleSubmit = useCallback(
    async (selection: IssueType, email: string, text: string) => {
      const formData = getFormData(email, text, answer, selection)

      try {
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
      } catch (e) {
        snackActions.error("Issue report failed.\nTry again later.")
      }
    },
    []
  )

  const handleBtnSubmit = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      evt.preventDefault()
      const goodForm = evt.currentTarget.form?.reportValidity()

      console.log("checking valid: ", goodForm)
      setSubmitEnabled(false)
      if (goodForm) {
        handleSubmit(selection, email, text)
      }
      setSubmitEnabled(true)
    },
    [selection, email, text]
  )

  return (
    <div id="iss-rpt-form" data-testid="iss-rpt-form" style={{ width: "100%" }}>
      <Button
        data-testid="iss-rpt-btn"
        sx={{ marginLeft: "16px" }}
        onClick={handleToggleIssueForm}
      >
        Report Issue
      </Button>

      <Dialog
        sx={{ width: "100%", margin: "auto" }}
        fullScreen={false}
        open={showIssueForm}
        onClose={handleToggleIssueForm}
      >
        <form ref={formRef}>
          <DialogContent>
            <IssueSelector value={selection} onChange={onIssueSelChanged} />
          </DialogContent>
          <FormFieldContainer>
            <InputLabel htmlFor="email">Email*</InputLabel>
            <TextField
              required
              id="email"
              fullWidth
              sx={{ height: "56px !important" }}
              type="text"
              onChange={handleEmailChange}
            />
            <InputLabel htmlFor="issue">Issue Description*</InputLabel>
            <TextField
              required
              id="issue"
              name="issuetxt"
              fullWidth
              type="text"
              multiline
              onChange={handleTextChanged}
            />
          </FormFieldContainer>

          <DialogActions sx={{ justifyContent: "center" }}>
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
