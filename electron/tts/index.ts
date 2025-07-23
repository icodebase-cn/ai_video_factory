import { EdgeTTS } from '../lib/edge-tts'

const edgeTts = new EdgeTTS()

export function getEdgeTtsVoiceList() {
  return edgeTts.getVoices()
}
