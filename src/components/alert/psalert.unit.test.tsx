import React, { act } from "react"
import { render, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { vi, it, expect, describe, beforeAll } from "vitest"
import GlobalAlertProvider from "./globalalertprovider"
import { snackActions } from "./psalert"

beforeAll(() => {
  console.warn(
    "1/14/2023 - Surpressing console 'Update to ... not wrapped in act.' error msg"
  )
  vi.spyOn(console, "error").mockImplementation(vi.fn())
})

/**
 * For each of these snackbar tests; since the developer can override
 * styling and such, all I care about is that the message is 'displayed'
 * (i.e. correctly added to the DOM.)
 */
describe("snackbar_test", () => {
  it(
    "snackbar_shows_default",
    async () => {
      const testTxt = "hello world"
      const wrapper = render(
        <div id="root">
          <GlobalAlertProvider>
            <div />
          </GlobalAlertProvider>
        </div>
      )

      act(() => {
        snackActions.toast(testTxt)
      })

      if (!wrapper) expect("").toEqual("Test error - failed to mount")

      await waitFor(() => {
        expect(wrapper.getByText(testTxt)).toBeDefined()
      })

      await waitFor(
        () => {
          expect(wrapper.queryAllByText(testTxt).length).toEqual(0)
        },
        { timeout: 25000 }
      )
    },
    { repeats: 2, timeout: 30000 }
  )

  it("snackbar_programatically_closes", async () => {
    const testTxt = "hello world"
    const wrapper = render(
      <div id="root">
        <GlobalAlertProvider>
          <div />
        </GlobalAlertProvider>
      </div>
    )
    const key = snackActions.toast(testTxt, { persist: true })

    await waitFor(() => {
      expect(wrapper.getByText(testTxt)).toBeDefined()
    })

    act(() => {
      snackActions.closeSnackbar(key)
    })

    await waitFor(
      () => {
        expect(wrapper.queryAllByText(testTxt).length).toEqual(0)
      },
      { timeout: 5000 }
    )
  }, 6000)

  it("snackbar_dismiss_click", async () => {
    const testTxt = "hello world"
    const wrapper = render(
      <div id="root">
        <GlobalAlertProvider>
          <div />
        </GlobalAlertProvider>
      </div>
    )

    act(() => {
      snackActions.toast(testTxt)
    })

    await waitFor(() => {
      expect(wrapper.getByText(testTxt)).toBeDefined()
    })

    userEvent.click(wrapper.getByRole("button"))

    await waitFor(
      () => {
        expect(wrapper.queryAllByText(testTxt).length).toEqual(0)
      },
      { timeout: 3000 }
    )
  }, 6000)
})
