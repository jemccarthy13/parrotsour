/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { plugins } from "pretty-format"
import { OptionsReceived } from "pretty-format/build/types"

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function toMatchCanvasSnapshotFactory(
  fs: any,
  path: any,
  hash: any,
  prettyFormat: (val: unknown, options?: OptionsReceived) => string,
  getTestState: any
) {
  function format(element: any) {
    return prettyFormat(element, {
      plugins: [plugins.DOMElement],
    })
  }

  function ensureSnapshotDir() {
    const state = getTestState()
    const snapshotDir = path.dirname(state.snapshotState._snapshotPath)
    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir)
    }
  }

  function getImageContent(canvas: HTMLCanvasElement) {
    const imageBase64 = canvas.toDataURL()
    return imageBase64.replace(/^data:image\/png;base64,/, "")
  }

  function getImageData(canvas: HTMLCanvasElement): Uint8ClampedArray {
    const ctx = canvas.getContext("2d")
    if (ctx) return ctx.getImageData(0, 0, canvas.width, canvas.height).data
    return new Uint8ClampedArray()
  }

  function deleteFile(filepath: string) {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
    }
  }

  function getFormattedSnapshot() {
    const state = getTestState()
    const snapshotData = state.snapshotState._snapshotData

    const persistedSnapshot = snapshotData[state.currentTestName + " 1"]
    if (!persistedSnapshot) {
      return ""
    }
    const persistedSnapshotWithoutLineBreak = persistedSnapshot.replace(
      /\n/g,
      ""
    )

    const snapshotRoot = document.createElement("div")
    // eslint-disable-next-line no-unsanitized/property
    snapshotRoot.innerHTML = persistedSnapshotWithoutLineBreak
    return format(snapshotRoot.querySelector("canvas"))
  }

  return {
    test(val: any) {
      return val && val.tagName === "CANVAS"
    },
    print(val: any) {
      const state = getTestState()
      const update = state.snapshotState._updateSnapshot
      const snapshotPath = state.snapshotState._snapshotPath
      const normalizedTestName = state.currentTestName.replace(/\s+/g, "-")
      const imageFilePath = `${snapshotPath}.${normalizedTestName}.canvas-image.png`
      const imageDirtyFilePath = `${snapshotPath}.${normalizedTestName}.canvas-image.dirty.png`

      const write = (filepath: string) =>
        fs.writeFileSync(filepath, getImageContent(val), "base64")
      const writeImage = () => write(imageFilePath)
      const writeDirtyImage = () => write(imageDirtyFilePath)
      const deleteDirtyImage = () => deleteFile(imageDirtyFilePath)

      // snapshot directory is not yet written by jest
      ensureSnapshotDir()

      const clone = val.cloneNode()
      clone.setAttribute("data-snapshot-image", hash(getImageData(val)))
      const formatted = format(clone)

      const snapshotFormatted = getFormattedSnapshot()

      const dirty = formatted !== snapshotFormatted
      const imageExists = fs.existsSync(imageFilePath)

      if (dirty) {
        if (update === "all") {
          writeImage()
          deleteDirtyImage()
        } else if (update === "new") {
          if (imageExists) {
            writeDirtyImage()
          } else {
            writeImage()
          }
        }
      } else {
        deleteDirtyImage()
      }

      return formatted
    },
  }
}
