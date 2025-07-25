import { EdgeTTS } from '../lib/edge-tts'
import { edgeTtsSynthesizeToBase64Params } from './types'

const edgeTts = new EdgeTTS()

export function edgeTtsGetVoiceList() {
  return edgeTts.getVoices()
}

export async function edgeTtsSynthesizeToBase64(params: edgeTtsSynthesizeToBase64Params) {
  const { text, voice, options } = params
  const result = await edgeTts.synthesize(text, voice, options)
  return result.toBase64()
}
