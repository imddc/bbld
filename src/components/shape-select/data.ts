import { PubSub } from '~/utils/pubsub'

export const backpackSelectKey = Symbol('backpackSelectKey')
export const backpackSelectPubsub = new PubSub()
