import fs from 'node:fs'
import path from 'node:path'
import { app } from 'electron'
import { EdgeTTS } from '../lib/edge-tts'
import { edgeTtsSynthesizeCommonParams, edgeTtsSynthesizeToFileParams } from './types'

const edgeTts = new EdgeTTS()

export function getTempTtsVoiceFilePath() {
  return path.join(app.getPath('temp'), 'temp-tts-voice.mp3')
}

export function edgeTtsGetVoiceList() {
  return edgeTts.getVoices()
}

export async function edgeTtsSynthesizeToBase64(params: edgeTtsSynthesizeCommonParams) {
  const { text, voice, options } = params
  const result = await edgeTts.synthesize(text, voice, options)
  return result.toBase64()
}

export async function edgeTtsSynthesizeToFile(params: edgeTtsSynthesizeToFileParams) {
  const { text, voice, options, withCaption } = params
  const result = await edgeTts.synthesize(text, voice, options)

  let outputPath = params.outputPath ?? getTempTtsVoiceFilePath()
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath)
  }
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  }
  result.toFile(outputPath)

  if (withCaption) {
    const srtString = result.getCaptionSrtString()
    const srtPath = path.join(path.dirname(outputPath), path.basename(outputPath, '.mp3') + '.srt')
    if (fs.existsSync(srtPath)) {
      fs.unlinkSync(srtPath)
    }
    fs.writeFileSync(srtPath, srtString)
  }

  // [TODO] 返回音频时长
  return {
    duration: 0,
  }
}
