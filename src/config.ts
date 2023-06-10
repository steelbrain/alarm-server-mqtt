import { z } from 'zod'
import fs from 'node:fs/promises'

const configSchema = z.object({
  mqttServerURI: z.string(),
  alarmServerPort: z.number(),
  alarmServerHost: z.string().optional(),
})

export type Config = z.infer<typeof configSchema>

export async function loadConfig(filePath: string): Promise<Config> {
  let contents: string
  try {
    contents = await fs.readFile(filePath, 'utf-8')
  } catch (err) {
    if (err != null && typeof err === 'object' && 'code' in err && err.code === 'ENOENT') {
      throw new Error(`Config file not found at ${filePath}`)
    }
    throw err
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(contents)
  } catch (err) {
    throw new Error(`Config file at ${filePath} is not valid JSON`)
  }
  return configSchema.parse(parsed)
}
