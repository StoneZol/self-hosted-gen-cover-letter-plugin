import type { AppPageInfo } from '@/lib/types/app/page'

export const DEFAULT_APP_PAGE_INFO: AppPageInfo = {
    type: 'unknown',
    url: '',
    title: '',
    checkedAt: '',
}

const STORAGE_KEY = 'appPageInfo'

export async function loadAppPageInfo(): Promise<AppPageInfo> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedPageInfo = result[STORAGE_KEY] as Partial<AppPageInfo> | undefined

    return {
        ...DEFAULT_APP_PAGE_INFO,
        ...storedPageInfo,
    }
}

export async function saveAppPageInfo(pageInfo: AppPageInfo): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: pageInfo,
    })
}

export { STORAGE_KEY as APP_PAGE_INFO_STORAGE_KEY }
