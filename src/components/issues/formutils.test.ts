import { describe, it, expect, vi } from "vitest"
import { IssueType, getFormData } from "./formutils"

vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockImplementation(
  () => "fake_data"
)

//@ts-expect-error ignore typing
vi.spyOn(document, "getElementById").mockImplementation(() => {
  return { toDataURL: () => "fake_data" }
})

describe("issue_report_form_utils", () => {
  it("prepares_formdata_with_all", () => {
    const formData = getFormData(
      "abc",
      "123",
      { pic: "", groups: [] },
      IssueType.PICTURE
    )

    expect(formData.get("email")).toEqual("abc@gmail.com")
    expect(formData.get("comments")?.toString().includes("123"))
    expect(formData.get("image")?.toString().includes("fake_data"))
  })

  it("prepares_formdata_with_no_email", () => {
    const formData = getFormData(
      "",
      "123",
      { pic: "", groups: [] },
      IssueType.PICTURE
    )

    expect(formData.get("email")).toEqual("not_provided")
    expect(formData.get("comments")?.toString().includes("123"))
  })

  it("prepares_formdata_with_no_description", () => {
    const formData = getFormData(
      "abc",
      "",
      { pic: "", groups: [] },
      IssueType.FEATURE
    )

    expect(formData.get("email")).toEqual("abc@gmail.com")
    expect(formData.get("comments")?.toString().includes("default-no-text"))
    expect(formData.get("image")).toEqual(null)
  })
})
