import { DEFAULT_CONTENT_CONFIG } from '@/lib/configs/content/config'
import { loadContentConfig } from '@/lib/configs/content/storage'
import type { ContentConfig } from '@/lib/types/content/types'

let contentConfig: ContentConfig = DEFAULT_CONTENT_CONFIG

export function getContentConfig(): ContentConfig {
    return contentConfig
}

export async function initContentConfig(): Promise<void> {
    contentConfig = await loadContentConfig()

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'local' || !changes.contentConfig) {
            return
        }

        void loadContentConfig().then((nextConfig) => {
            contentConfig = nextConfig
        })
    })
}
