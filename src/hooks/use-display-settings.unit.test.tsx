/* eslint-disable react/no-multi-comp */
import React, { useEffect } from "react"
import { render, waitFor } from "@testing-library/react"
import { it, describe, expect } from "vitest"
import { useDisplaySettings } from "./use-display-settings"

describe("use-display-settings-hook", () => {
  describe("handles_datastyle", () => {
    it("stores_correctly", () => {
      const Component = () => {
        const { state } = useDisplaySettings()

        return <>{state.dataStyle}</>
      }

      const wrapper = render(<Component />)

      expect(wrapper.queryAllByText("1").length).toBeGreaterThan(0)
    })

    it("toggles_correctly", async () => {
      const Component = () => {
        const { state, toggles } = useDisplaySettings()

        useEffect(() => {
          toggles.toggleDataStyle()
        }, [])

        return <>{state.dataStyle}</>
      }

      const wrapper = render(<Component />)

      await waitFor(() => {
        expect(wrapper.queryAllByText("1").length).toEqual(0)
        expect(wrapper.queryAllByText("0").length).toBeGreaterThan(0)
      })
    })
  })

  describe("handles_canvas_orient", () => {
    it("stores_correctly", () => {
      const Component = () => {
        const { state } = useDisplaySettings()

        return <>{state.canvasConfig.orient}</>
      }

      const wrapper = render(<Component />)

      expect(wrapper.queryAllByText("2").length).toBeGreaterThan(0)
    })

    it("toggles_correctly", async () => {
      const Component = () => {
        const { state, toggles } = useDisplaySettings()

        useEffect(() => {
          toggles.toggleCanvasOrient()
        }, [])

        return <>{state.canvasConfig.orient}</>
      }

      const wrapper = render(<Component />)

      await waitFor(() => {
        expect(wrapper.queryAllByText("1").length).toEqual(0)
        expect(wrapper.queryAllByText("0").length).toBeGreaterThan(0)
      })
    })
  })
})
