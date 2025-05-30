import {
  EventType,
  MetaEvent,
  MetaEventType,
  MidiChannelControllerChangeMessage,
  MidiChannelMessage,
  MidiChannelVoiceMessageType,
  MidiTrackEvent
} from '../models'

export function isMidiEvent(
  event: MidiTrackEvent
): event is MidiChannelMessage {
  return event.type === EventType.Midi
}

export function isMetaEvent(event: MidiTrackEvent): event is MetaEvent {
  return event.type === EventType.Meta
}
export function isPitchBendEvent(
  event: MidiTrackEvent
): event is MidiChannelMessage & {
  messageType: MidiChannelVoiceMessageType.PitchBendChange
} {
  return (
    isMidiEvent(event) &&
    event.messageType === MidiChannelVoiceMessageType.PitchBendChange
  )
}

export function isChannelPressureEvent(
  event: MidiTrackEvent
): event is MidiChannelMessage & {
  messageType: MidiChannelVoiceMessageType.ChannelPressure
} {
  return (
    isMidiEvent(event) &&
    event.messageType === MidiChannelVoiceMessageType.ChannelPressure
  )
}

function isNoteOnEvent(event: MidiTrackEvent): event is MidiChannelMessage {
  return (
    isMidiEvent(event) &&
    event.messageType === MidiChannelVoiceMessageType.NoteOn
  )
}

function isNoteOffEvent(event: MidiTrackEvent): event is MidiChannelMessage {
  return (
    isMidiEvent(event) &&
    event.messageType === MidiChannelVoiceMessageType.NoteOff
  )
}

function isNoteOnWithZeroVelocity(
  event: MidiTrackEvent
): event is MidiChannelMessage & { data2: 0 } {
  return isNoteOnEvent(event) && event.data2 === 0
}

export function isEffectiveNoteOff(
  event: MidiTrackEvent
): event is MidiChannelMessage {
  return isNoteOffEvent(event) || isNoteOnWithZeroVelocity(event)
}

export function isEffectiveNoteOn(
  event: MidiTrackEvent
): event is MidiChannelMessage {
  return isNoteOnEvent(event) && !isNoteOnWithZeroVelocity(event)
}

export function isControllerChangeEvent(
  event: MidiTrackEvent
): event is MidiChannelControllerChangeMessage {
  return (
    isMidiEvent(event) &&
    event.messageType === MidiChannelVoiceMessageType.ControlChange
  )
}

export function isPercussionEvent(
  event: MidiTrackEvent
): event is MidiChannelMessage & { channel: 9 } {
  return isMidiEvent(event) && event.channel === 9
}

export function isTempoEvent(event: MidiTrackEvent): event is MetaEvent {
  return isMetaEvent(event) && event.metaType === MetaEventType.SetTempo
}
