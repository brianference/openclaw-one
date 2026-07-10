import { DEMO } from './data'
export function seedContext(): string {
  return JSON.stringify(DEMO, null, 0)
}
