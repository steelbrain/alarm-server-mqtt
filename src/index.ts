import path from 'path'
import { loadConfig } from './config'

async function main() {
  const configFilePath = path.join(process.cwd(), 'config.json')
  const config = await loadConfig(configFilePath)
  console.log(config)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
