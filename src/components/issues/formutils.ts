import { PictureAnswer } from "../../canvas/canvastypes"

export enum IssueType {
  PICTURE = "picprob",
  FEATURE = "feature",
  OTHER = "othprob",
}

export function getFormData(
  email: string,
  text: string,
  answer: PictureAnswer,
  selection: IssueType
): FormData {
  const canvas: HTMLCanvasElement = document.getElementById(
    "pscanvas"
  ) as HTMLCanvasElement

  let realEmail = email === "" ? "not_provided" : email

  if (email && email.indexOf("@") === -1) realEmail += "@gmail.com"

  const realText = text === "" ? "default-no-text" : text

  const formData = new FormData()

  formData.append("email", realEmail)
  formData.append(
    "comments",
    realText + " \n\n" + JSON.stringify(answer, null, 2)
  )
  formData.append("problemtype", selection)

  if (selection === "picprob")
    formData.append("image", canvas.toDataURL("image/png"))

  return formData
}
