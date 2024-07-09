import { PubSub } from '~/utils/pubsub'

export const backpackSelectKey = Symbol('backpackSelectKey')
export const backpackUnSelectKey = Symbol('backpackUnSelectKey')
export const backpackSelectPubsub = new PubSub()
