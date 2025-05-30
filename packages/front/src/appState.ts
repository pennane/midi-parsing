import type { MidiParser } from './parser/midiParser'
import type { PlaybackControl } from './player/playTrack'

type AppState = {
  selectedMidi: MidiParser
  selectedWaveform: OscillatorType
  currentPlayback: PlaybackControl | null
  audioContext: AudioContext
  gainNode: GainNode
  analyserNode: AnalyserNode
  percussion: boolean
}

let state: AppState

export function initAppState(
  defaultMidi: MidiParser,
  audioContext: AudioContext,
  gainNode: GainNode,
  analyserNode: AnalyserNode
): void {
  state = {
    selectedMidi: defaultMidi,
    selectedWaveform: 'sawtooth',
    currentPlayback: null,
    audioContext,
    gainNode,
    analyserNode,
    percussion: true
  }
}

export function getState(): AppState {
  return state
}

export function setSelectedMidi(midi: MidiParser): void {
  if (state.currentPlayback?.isPlaying()) {
    state.currentPlayback.pause()
  }

  state.selectedMidi = midi
  state.currentPlayback = null
}

export function setSelectedWaveform(waveform: OscillatorType): void {
  state.selectedWaveform = waveform

  if (state.currentPlayback) {
    state.currentPlayback.setWaveform(waveform)
  }
}

export function getSelectedWaveform() {
  return state.selectedWaveform
}

export function setCurrentPlayback(playback: PlaybackControl | null): void {
  state.currentPlayback = playback
}

export function setPercussion(enabled: boolean): void {
  const state = getState()
  state.currentPlayback?.setPercussion(enabled)
  state.percussion = enabled
}
export function getPercussion(): boolean {
  return getState().percussion
}
