import fs from 'node:fs'
import path from 'node:path'

export function generateUniqueFileName(filePath: string): string {
  const dir = path.dirname(filePath)
  const ext = path.extname(filePath)
  const baseName = path.basename(filePath, ext)
  let counter = 1
  let newPath = filePath

  while (fs.existsSync(newPath)) {
    newPath = path.join(dir, `${baseName}(${counter})${ext}`)
    counter++
  }
  return newPath
}
