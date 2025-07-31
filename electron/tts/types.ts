import { SynthesisOptions } from '../lib/edge-tts'

export interface edgeTtsSynthesizeCommonParams {
  text: string
  voice: string
  options: SynthesisOptions
}

export interface edgeTtsSynthesizeToFileParams extends edgeTtsSynthesizeCommonParams {
  withCaption?: boolean
  outputPath?: string
}
