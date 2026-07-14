import { DEFAULT_CONTENT_CONFIG } from '@/lib/configs/content/config'
import { loadContentConfig } from '@/lib/configs/content/storage'
import type { ContentConfig } from '@/lib/types/content/types'

let contentConfig: ContentConfig = DEFAULT_CONTENT_CONFIG
const listeners = new Set<() => void>()

export function getContentConfig(): ContentConfig {
    return contentConfig
}

export function subscribeContentConfig(listener: () => void): () => void {
    listeners.add(listener)

    return () => {
        listeners.delete(listener)
    }
}

function notifyContentConfigListeners(): void {
    listeners.forEach((listener) => listener())
}

export async function initContentConfig(): Promise<void> {
    contentConfig = await loadContentConfig()

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'local' || !changes.contentConfig) {
            return
        }

        void loadContentConfig().then((nextConfig) => {
            contentConfig = nextConfig
            notifyContentConfigListeners()
        })
    })
}
