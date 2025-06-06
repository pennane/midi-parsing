/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spec } from 'parser'
import {
  isChannelPressureEvent,
  isControllerChangeEvent,
  isEffectiveNoteOff,
  isEffectiveNoteOn,
  isMetaEvent,
  isMidiEvent,
  isPercussionEvent,
  isPitchBendEvent,
  isProgramChangeEvent
} from './typeGuards'

import { EventProcessor, EventProcessorPredicate } from './models'
import { metaProcessors } from './processors/metaProcessors'
import {
  controllerProcessors,
  voiceMessageProcessors
} from './processors/midiProcessors'
import { percussionProcessors } from './processors/percussion/percussionProcessors'

function matchEvent<IN>(
  ...handlers: EventProcessorPredicate<IN, any>[]
): EventProcessor<IN> {
  return (ctx, event) => handlers.find(([pred]) => pred(event))?.[1](ctx, event)
}

function fallThrough(_: unknown): _ is any {
  return true
}

const processPercussionEvent = matchEvent(
  [isEffectiveNoteOn, (ctx, event) => percussionProcessors.noteOn(ctx, event)],
  [
    isEffectiveNoteOff,
    (ctx, event) => percussionProcessors.noteOff(ctx, event)
  ],
  [
    fallThrough,
    (_, event) =>
      console.info(
        'unhandled percussion event',
        Spec.MidiChannelVoiceMessageType[event.messageType]
      )
  ]
)

const processControllerEvent: EventProcessor<
  Spec.MidiChannelControllerChangeMessage
> = (ctx, event) => {
  const processor = controllerProcessors[event.data1]
  if (!processor) {
    console.info(
      'unhandled controller change event',
      Spec.MidiControllerChange[event.data1]
    )
    return
  }
  if (ctx.strategies.controllers.type === 'disabled') return
  return processor(ctx, event)
}

const processMidi: EventProcessor<Spec.MidiChannelMessage> = matchEvent(
  [isControllerChangeEvent, processControllerEvent],
  [isPercussionEvent, processPercussionEvent],
  [isEffectiveNoteOn, voiceMessageProcessors.noteOn],
  [isEffectiveNoteOff, voiceMessageProcessors.noteOff],
  [isPitchBendEvent, voiceMessageProcessors.pitchBend],
  [isChannelPressureEvent, voiceMessageProcessors.channelPressure],
  [isProgramChangeEvent, voiceMessageProcessors.programChange],
  [
    fallThrough,
    (_, event) =>
      console.info(
        'unhandled midi event',
        Spec.MidiChannelVoiceMessageType[event.messageType]
      )
  ]
)

const processMetaEvent: EventProcessor<Spec.MetaEvent> = (ctx, event) => {
  const processor = metaProcessors[event.metaType]
  if (!processor) {
    console.info(
      'unhandled meta event',
      Spec.MetaEventType[event.metaType] ?? 'unknown ' + event.metaType
    )
    return
  }
  return processor(ctx, event)
}

export const processEvent = matchEvent(
  [isMidiEvent, processMidi],
  [isMetaEvent, processMetaEvent],
  [fallThrough, (_, event) => console.info('unhandled top level event', event)]
)
