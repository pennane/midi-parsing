import { MidiPlayer } from 'player'
import { initFileSelector } from './fileSelector'
import { initPlaybackController } from './playbackController'
import { initProgressBar } from './progressBar'
import { initStrategyControl } from './strategyControl'
import { initTextAnnouncer } from './textAnnouncer'
import { initVisualizer } from './visualizer'
import { initVolumeControl } from './volumeControl'

export function initUi(
  player: MidiPlayer,
  gainNode: GainNode,
  analyserNode: AnalyserNode
) {
  initProgressBar(player)
  initFileSelector(player)
  initPlaybackController(player)
  initStrategyControl(player)
  initTextAnnouncer(player)
  initVolumeControl(gainNode)
  initVisualizer(analyserNode)
}
