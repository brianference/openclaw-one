import { useSyncExternalStore } from 'react'
import { getState, subscribe } from './store'
import type { DemoState } from '../data/seed'

/** React binding to the local demo store. */
export function useDemoStore(): DemoState {
  return useSyncExternalStore(subscribe, getState, getState)
}
