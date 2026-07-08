import { useCallback, useEffect, useState } from 'react'
import {
    APP_STATUS_STORAGE_KEY,
    DEFAULT_APP_STATUS,
    loadAppStatus,
    saveAppStatus,
} from '@/lib/configs/app/statusStorage'
import type { AppStatus, StatusType } from '@/lib/types/app/status'

export function useAppStatus() {
    const [status, setStatusState] = useState<AppStatus>(DEFAULT_APP_STATUS)

    useEffect(() => {
        loadAppStatus().then(setStatusState)

        function handleStorageChange(
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) {
            if (areaName !== 'local' || !changes[APP_STATUS_STORAGE_KEY]) {
                return
            }

            const nextStatus = changes[APP_STATUS_STORAGE_KEY].newValue as AppStatus | undefined
            setStatusState(nextStatus ?? DEFAULT_APP_STATUS)
        }

        chrome.storage.onChanged.addListener(handleStorageChange)
        return () => chrome.storage.onChanged.removeListener(handleStorageChange)
    }, [])

    const setStatus = useCallback(async (message: string, type: StatusType = 'info') => {
        const nextStatus: AppStatus = { message, type }
        await saveAppStatus(nextStatus)
        setStatusState(nextStatus)
    }, [])

    return {
        status,
        setStatus,
    }
}
