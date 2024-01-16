import fs from "fs"
import { rm } from "fs/promises"
import path from "path"

export async function clearDirectory(dirPath) {
  await rm(dirPath, { recursive: true })
}

function searchFile(dir, fileName) {
  // read the contents of the directory
  const files = fs.readdirSync(dir)

  // search through the files
  for (const file of files) {
    // build the full path of the file
    const filePath = path.join(dir, file)

    if (file.includes(fileName)) {
      console.log(filePath)
    }

    // get the file stats
    const fileStat = fs.statSync(filePath)

    // if the file is a directory, recursively search the directory
    if (fileStat.isDirectory()) {
      searchFile(filePath, fileName)
    }
  }
}

searchFile("./src", "__snapshots__")
