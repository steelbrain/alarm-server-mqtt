const MAGIC_NUMBER_START = 32
const MAGIC_NUMBER_LENGTH = 9

const CAMERA_NAME_TEST = /[a-z0-9]+/i
const MANUFACTURER_MARKER = 'EZVIZ'

export function getCameraNameFromEvent(payload: Buffer): string | null {
  const startingIndex = payload.indexOf(MANUFACTURER_MARKER)
  if (startingIndex === -1) {
    return null
  }
  const newPayload = payload.subarray(startingIndex)
  const cameraName = newPayload.toString('utf8', MAGIC_NUMBER_START, MAGIC_NUMBER_START + MAGIC_NUMBER_LENGTH)
  return CAMERA_NAME_TEST.test(cameraName) ? cameraName : null
}
