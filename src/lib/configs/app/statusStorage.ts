import type { AppStatus } from '@/lib/types/app/status'

export const DEFAULT_APP_STATUS: AppStatus = {
    message: '',
    type: 'info',
}

const STORAGE_KEY = 'appStatus'

export async function loadAppStatus(): Promise<AppStatus> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedStatus = result[STORAGE_KEY] as Partial<AppStatus> | undefined

    return {
        ...DEFAULT_APP_STATUS,
        ...storedStatus,
    }
}

export async function saveAppStatus(status: AppStatus): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: status,
    })
}

export { STORAGE_KEY as APP_STATUS_STORAGE_KEY }
