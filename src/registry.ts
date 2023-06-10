import { Emitter, Disposable } from 'sb-event-kit'

// This class keeps a registry of active ping events.
// It emits an event start when a ping is received from a camera for the first time, but ignores if ping was received from said camera within last 5 seconds.
// Every time a ping is received, it increments the "timeout" by 5 seconds.
// 5 seconds after the last ping is received, it emits an event end.
export default class Registry {
  private emitter: Emitter
  private activeEvents: Map<string, NodeJS.Timeout>
  constructor(private timeoutMs: number) {
    this.emitter = new Emitter()
    this.activeEvents = new Map()
  }
  onEventStart(callback: (cameraName: string) => void): Disposable {
    return this.emitter.on('event-start', callback)
  }
  onEventEnd(callback: (cameraName: string) => void): Disposable {
    return this.emitter.on('event-end', callback)
  }
  processEvent(cameraName: string): void {
    if (!this.activeEvents.has(cameraName)) {
      this.emitter.emit('event-start', cameraName)
    }
    const timeoutId = this.activeEvents.get(cameraName)
    clearTimeout(timeoutId)
    const newTimeoutId = setTimeout(() => {
      this.emitter.emit('event-end', cameraName)
      this.activeEvents.delete(cameraName)
    }, this.timeoutMs)
    this.activeEvents.set(cameraName, newTimeoutId)
  }

  dispose() {
    this.emitter.dispose()
  }
}
