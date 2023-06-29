import path from 'path'
import net from 'net'
import { ALARM_EVENT_BUFFER_SIZE, ALARM_TIMEOUT_MS_DEFAULT, loadConfig } from './config'
import Registry from './registry'
import mqtt from 'mqtt'
import { getCameraNameFromEvent } from './parser'

async function main() {
  const configFilePath = path.join(process.cwd(), 'config.json')
  const config = await loadConfig(configFilePath)
  const registry = new Registry(config.alarmTimeoutMs ?? ALARM_TIMEOUT_MS_DEFAULT)

  if (config.debug) {
    registry.onEventStart(cameraName => {
      console.log(`Event start: ${cameraName}`)
    })
    registry.onEventEnd(cameraName => {
      console.log(`Event end: ${cameraName}`)
    })
  }

  // Listening server
  const server = net.createServer(socket => {
    if (config.debug) {
      console.log('Alarm server client connected')
    }
    let contents = Buffer.alloc(0)
    socket.on('end', () => {
      const cameraName = getCameraNameFromEvent(contents)
      if (config.debug) {
        console.log(`Camera (${cameraName}) triggered: ${contents.toString('hex')}`)
      }
      if (cameraName != null) {
        registry.trigger(cameraName)
      }
    })
    socket.on('data', data => {
      if (contents.length >= ALARM_EVENT_BUFFER_SIZE) {
        // No op
        return
      }
      contents = Buffer.concat([contents, data.subarray(0, ALARM_EVENT_BUFFER_SIZE)])
    })

    // Delayed socket end
    setTimeout(() => {
      socket.end()
    }, 1000)
    socket.on('error', () => {
      // No op
    })
  })

  server.listen(config.alarmServerPort, config.alarmServerHost)
  server.on('error', err => {
    console.error('Alarm Server error', err)
    process.exit(1)
  })
  server.on('listening', () => {
    console.log('Listening for alarm events')
  })

  // MQTT client
  const mqttClient = mqtt.connect(config.mqttServerURI)
  mqttClient.on('error', err => {
    // NOTE: Intentionally not killing the process on error here, just logging
    console.error('MQTT client error', err)
  })
  registry.onEventStart(cameraName => {
    mqttClient.publish(`motion-detection/${cameraName}`, 'start')
  })
  registry.onEventEnd(cameraName => {
    mqttClient.publish(`motion-detection/${cameraName}`, 'end')
  })
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
