import { DEMO } from '../data/demo'

export function buildChatContext(): string {
  return JSON.stringify(DEMO, null, 0)
}
