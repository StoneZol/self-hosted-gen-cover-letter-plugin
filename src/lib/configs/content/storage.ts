import type { ContentConfig } from '@/lib/types/content/types'
import { DEFAULT_CONTENT_CONFIG } from './config'

const STORAGE_KEY = 'contentConfig'

export async function loadContentConfig(): Promise<ContentConfig> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedConfig = result[STORAGE_KEY] as Partial<ContentConfig> | undefined

    return {
        ...DEFAULT_CONTENT_CONFIG,
        ...storedConfig,
    }
}

export async function saveContentConfig(config: ContentConfig): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: config,
    })
}
