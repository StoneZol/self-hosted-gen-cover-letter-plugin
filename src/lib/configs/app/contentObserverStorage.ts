import type { ContentObserverDebug } from '@/lib/types/app/contentObserver'

export const DEFAULT_CONTENT_OBSERVER_DEBUG: ContentObserverDebug = {
    url: '',
    pageType: 'unknown',
    vacancy: {
        status: 'idle',
        observerActive: false,
        letterInputFound: false,
        widgetMounted: false,
        message: 'Наблюдатель не запущен.',
        updatedAt: '',
    },
}

const STORAGE_KEY = 'contentObserverDebug'

export async function loadContentObserverDebug(): Promise<ContentObserverDebug> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedDebug = result[STORAGE_KEY] as Partial<ContentObserverDebug> | undefined

    return {
        ...DEFAULT_CONTENT_OBSERVER_DEBUG,
        ...storedDebug,
        vacancy: {
            ...DEFAULT_CONTENT_OBSERVER_DEBUG.vacancy,
            ...storedDebug?.vacancy,
        },
    }
}

export async function saveContentObserverDebug(debug: ContentObserverDebug): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: debug,
    })
}

export { STORAGE_KEY as CONTENT_OBSERVER_DEBUG_STORAGE_KEY }
