import fs from 'node:fs'
import path from 'node:path'
import { EdgeTTS } from '../lib/edge-tts'
import { parseBuffer } from 'music-metadata'
import {
  EdgeTtsSynthesizeCommonParams,
  EdgeTtsSynthesizeToFileParams,
  EdgeTtsSynthesizeToFileResult,
} from './types'
import { getAppTempPath } from '../lib/tools'
import { app } from 'electron'

const edgeTts = new EdgeTTS()
const setupTime = new Date().getTime()

export function getTempTtsVoiceFilePath() {
  return path.join(getAppTempPath(), `temp-tts-voice-${setupTime}.mp3`).replace(/\\/g, '/')
}

export function clearCurrentTtsFiles() {
  const voicePath = getTempTtsVoiceFilePath()
  if (fs.existsSync(voicePath)) {
    fs.unlinkSync(voicePath)
  }
  const srtPath = path.join(path.dirname(voicePath), path.basename(voicePath, '.mp3') + '.srt')
  if (fs.existsSync(srtPath)) {
    fs.unlinkSync(srtPath)
  }
}

app.on('before-quit', () => {
  clearCurrentTtsFiles()
})

export function edgeTtsGetVoiceList() {
  return edgeTts.getVoices()
}

export async function edgeTtsSynthesizeToBase64(params: EdgeTtsSynthesizeCommonParams) {
  const { text, voice, options } = params
  const result = await edgeTts.synthesize(text, voice, options)
  return result.toBase64()
}

export async function edgeTtsSynthesizeToFile(
  params: EdgeTtsSynthesizeToFileParams,
): Promise<EdgeTtsSynthesizeToFileResult> {
  const { text, voice, options, withCaption } = params
  const result = await edgeTts.synthesize(text, voice, options)

  let outputPath = params.outputPath ?? getTempTtsVoiceFilePath()
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath)
  }
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  }
  await result.toFile(outputPath)

  if (withCaption) {
    const srtString = result.getCaptionSrtString()
    const srtPath = path.join(path.dirname(outputPath), path.basename(outputPath, '.mp3') + '.srt')
    if (fs.existsSync(srtPath)) {
      fs.unlinkSync(srtPath)
    }
    fs.writeFileSync(srtPath, srtString)
  }

  let duration = 0
  try {
    const metadata = await parseBuffer(result.getBuffer())
    duration = metadata.format.duration || 0
  } catch (error) {
    console.warn('Failed to parse audio metadata, using default duration:', error)
    // 如果无法解析元数据，使用默认值
    duration = 0
  }

  return {
    duration,
  }
}
