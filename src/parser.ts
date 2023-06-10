const MAGIC_NUMBER_START = 79
const MAGIC_NUMBER_LENGTH = 9

const CAMERA_NAME_TEST = /[a-z0-9]+/i

export function getCameraNameFromEvent(payload: Buffer): string | null {
  const cameraName = payload.toString('utf8', MAGIC_NUMBER_START, MAGIC_NUMBER_START + MAGIC_NUMBER_LENGTH)
  return CAMERA_NAME_TEST.test(cameraName) ? cameraName : null
}
