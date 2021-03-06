/* eslint-disable @typescript-eslint/no-var-requires */
import createCanvasSnapshotSerializer from "./canvasSnapshotSerializer"

const fs = require("fs")
const path = require("path")
const hasha = require("hasha")
import prettyFormat from "pretty-format"

export default createCanvasSnapshotSerializer(
  fs,
  path,
  hasha,
  prettyFormat,
  expect.getState
)

module.exports = createCanvasSnapshotSerializer(
  fs,
  path,
  hasha,
  prettyFormat,
  expect.getState
)
