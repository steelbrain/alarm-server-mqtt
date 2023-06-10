import path from 'path'
import net from 'net'
import { ALARM_TIMEOUT_MS_DEFAULT, loadConfig } from './config'
import Registry from './registry'
import mqtt from 'mqtt'

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
    console.log('client connected')
    socket.on('end', () => {
      console.log('client disconnected')
    })
    socket.on('data', data => {
      console.log(data.toString('hex'))
    })
    socket.end()
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
