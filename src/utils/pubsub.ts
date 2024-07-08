type EventKey = string | symbol
type Callback<T = any> = (payload: T) => void

export class PubSub {
  private events: Record<EventKey, Callback[]> = {}

  public on(event: EventKey, callback: Callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function')
    }
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  public emit<T = any>(event: EventKey, payload: T) {
    if (!this.events[event]) {
      return
    }
    this.events[event].forEach((callback: Callback) => {
      callback(payload)
    })
  }

  public off(event: EventKey, callback: Callback) {
    if (!this.events[event]) {
      return
    }
    const index = this.events[event].indexOf(callback)
    if (index > -1) {
      this.events[event].splice(index, 1)
    }
  }
}
