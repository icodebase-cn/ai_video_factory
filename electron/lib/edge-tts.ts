import WebSocket from 'ws'
import { writeFileSync } from 'fs'
import request from './request'

export const Constants = {
  TRUSTED_CLIENT_TOKEN: '6A5AA1D4EAFF4E9FB37E23D68491D6F4',
  WSS_URL: 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1',
  VOICES_URL: 'https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list',
}

export const AUDIO_FORMAT = 'audio-24khz-48kbitrate-mono-mp3'
export const AUDIO_EXTENSION = '.mp3'

export const AUDIO_METADATA: AudioMetadata = {
  format: 'mp3',
  bitrate: '48k',
  sampleRate: 24000,
  channels: 1,
}

export enum EdgeTTSGender {
  MALE = 'Male',
  FEMALE = 'Female',
  NEUTRAL = 'Neutral',
}

interface VoiceTag {
  ContentCategories: string[]
  VoicePersonalities: string[]
}

export interface EdgeTTSVoice {
  Name: string
  ShortName: string
  FriendlyName: string
  Gender: EdgeTTSGender
  Locale: string
  Status: string
  VoiceTag: VoiceTag
  SuggestedCodec: string
}

export interface SynthesisOptions {
  pitch?: number // Hz, -100 to 100
  rate?: number // Percentage, -100 to 100
  volume?: number // Percentage, -100 to 100
}

export interface AudioMetadata {
  format: string
  bitrate: string
  sampleRate: number
  channels: number
}

export interface SynthesisResult {
  /**
   * Convert audio data to Base64 string
   */
  toBase64(): string

  /**
   * Save audio data to file
   * @param outputPath - Output file path (without extension)
   */
  toFile(outputPath: string): Promise<void>

  /**
   * Get raw audio buffer (identical to toBase64)
   * @deprecated Use toBase64() instead
   */
  toRaw(): string

  /**
   * Get audio buffer directly
   */
  getBuffer(): Buffer

  /**
   * Get audio format
   */
  getFormat(): string

  /**
   * Get audio metadata
   */
  getMetadata(): AudioMetadata

  /**
   * Get audio size in bytes
   */
  getSize(): number
}

class SynthesisResultImpl implements SynthesisResult {
  private readonly audioBuffer: Buffer

  constructor(audioData: Buffer[]) {
    this.audioBuffer = Buffer.concat(audioData)
  }

  toBase64(): string {
    if (this.audioBuffer.length === 0) {
      throw new Error('No audio data available.')
    }
    return this.audioBuffer.toString('base64')
  }

  async toFile(outputPath: string): Promise<void> {
    if (this.audioBuffer.length === 0) {
      throw new Error('No audio data available to save.')
    }

    if (outputPath.endsWith(AUDIO_EXTENSION)) {
      writeFileSync(outputPath, this.audioBuffer)
    } else {
      writeFileSync(`${outputPath}${this.getExtension()}`, this.audioBuffer)
    }
  }

  toRaw(): string {
    return this.toBase64()
  }

  getBuffer(): Buffer {
    return this.audioBuffer
  }

  getFormat(): string {
    return AUDIO_FORMAT
  }

  getExtension(): string {
    return AUDIO_EXTENSION
  }

  getMetadata(): AudioMetadata {
    return AUDIO_METADATA
  }

  getSize(): number {
    return this.audioBuffer.length
  }
}

export class EdgeTTS {
  async getVoices(): Promise<EdgeTTSVoice[]> {
    const response = await request(
      `${Constants.VOICES_URL}?trustedclienttoken=${Constants.TRUSTED_CLIENT_TOKEN}`,
    )
    const voices: EdgeTTSVoice[] = await response.json()
    return voices.map((voice) => ({
      Name: voice.Name,
      ShortName: voice.ShortName,
      FriendlyName: voice.FriendlyName,
      Gender: voice.Gender,
      Locale: voice.Locale,
      Status: voice.Status,
      VoiceTag: voice.VoiceTag,
      SuggestedCodec: voice.SuggestedCodec,
    }))
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = (Math.random() * 16) | 0
      const value = char === 'x' ? random : (random & 0x3) | 0x8
      return value.toString(16)
    })
  }

  private validatePitch(pitch: number): number {
    if (!Number.isInteger(pitch) || pitch < -100 || pitch > 100) {
      throw new Error('Invalid pitch value. Expected integer between -100 and 100 Hz.')
    }
    return pitch
  }

  private validateRate(rate: number): number {
    if (isNaN(rate) || rate < -100 || rate > 100) {
      throw new Error('Invalid rate value. Expected integer between -100 and 100%.')
    }
    return rate
  }

  private validateVolume(volume: number): number {
    if (!Number.isInteger(volume) || volume < -100 || volume > 100) {
      throw new Error('Invalid volume value. Expected integer between -100 and 100%.')
    }
    return volume
  }

  /**
   * Synthesize text to speech and return a result object with audio manipulation methods
   * @param text - Text to synthesize
   * @param voice - Voice to use for synthesis
   * @param options - Synthesis options (pitch, rate, volume)
   * @returns SynthesisResult object with audio data and methods
   */
  async synthesize(
    text: string,
    voice: string = 'en-US-AnaNeural',
    options: SynthesisOptions = {},
  ): Promise<SynthesisResult> {
    return new Promise((resolve, reject) => {
      const audioStream: Buffer[] = []
      const requestId = this.generateUUID()
      const ws = new WebSocket(
        `${Constants.WSS_URL}?trustedclienttoken=${Constants.TRUSTED_CLIENT_TOKEN}&ConnectionId=${requestId}`,
      )

      const ssmlText = this.getSSML(text, voice, options)

      ws.on('open', () => {
        const configMessage = this.buildTTSConfigMessage()
        ws.send(configMessage)

        const speechMessage = this.buildSpeechMessage(requestId, ssmlText)
        ws.send(speechMessage)
      })

      ws.on('message', (data: Buffer) => {
        this.processAudioData(data, audioStream, ws)
      })

      ws.on('close', () => {
        const result = new SynthesisResultImpl(audioStream)
        resolve(result)
      })

      ws.on('error', (error: Error) => {
        reject(error)
      })
    })
  }

  private getSSML(text: string, voice: string, options: SynthesisOptions): string {
    const pitch = this.validatePitch(options.pitch ?? 0)
    const rate = this.validateRate(options.rate ?? 0)
    const volume = this.validateVolume(options.volume ?? 0)

    return `<speak version='1.0' xml:lang='en-US'>
      <voice name='${voice}'>
        <prosody pitch='${pitch}Hz' rate='${rate}%' volume='${volume}%'>
          ${text}
        </prosody>
      </voice>
    </speak>`
  }

  private buildTTSConfigMessage(): string {
    const audioFormat = AUDIO_FORMAT
    const timestamp = new Date().toISOString() + 'Z'
    return (
      `X-Timestamp:${timestamp}\r\n` +
      `Content-Type:application/json; charset=utf-8\r\n` +
      `Path:speech.config\r\n\r\n` +
      JSON.stringify({
        context: {
          synthesis: {
            audio: {
              metadataoptions: {
                sentenceBoundaryEnabled: false,
                wordBoundaryEnabled: true,
              },
              outputFormat: audioFormat,
            },
          },
        },
      })
    )
  }

  private buildSpeechMessage(requestId: string, ssmlText: string): string {
    const timestamp = new Date().toISOString() + 'Z'
    return (
      `X-RequestId:${requestId}\r\n` +
      `Content-Type:application/ssml+xml\r\n` +
      `X-Timestamp:${timestamp}\r\n` +
      `Path:ssml\r\n\r\n${ssmlText}`
    )
  }

  private processAudioData(data: Buffer, audioStream: Buffer[], ws: WebSocket): void {
    const needle = Buffer.from('Path:audio\r\n')

    const startIndex = data.indexOf(needle)

    if (startIndex !== -1) {
      const audioData = data.subarray(startIndex + needle.length)

      if (audioData.length > 0) {
        audioStream.push(audioData)
      }
    }

    if (data.includes('Path:turn.end')) {
      ws.close()
    }
  }
}
