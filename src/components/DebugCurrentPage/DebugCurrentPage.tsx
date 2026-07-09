import { useEffect, useState } from 'react'
import {
    APP_PAGE_INFO_STORAGE_KEY,
    loadAppPageInfo,
    saveAppPageInfo,
} from '@/lib/configs/app/pageStorage'
import { resolveAppPageInfo } from '@/lib/hh/page'
import type { AppPageInfo } from '@/lib/types/app/page'

async function getActiveTabPageInfo(): Promise<AppPageInfo> {
    const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    })

    return resolveAppPageInfo(activeTab?.url ?? '', activeTab?.title ?? '')
}

export function DebugCurrentPage() {
    const [pageInfo, setPageInfo] = useState<AppPageInfo | null>(null)

    useEffect(() => {
        loadAppPageInfo().then(setPageInfo)

        async function syncCurrentPage() {
            const nextPageInfo = await getActiveTabPageInfo()
            await saveAppPageInfo(nextPageInfo)
            setPageInfo(nextPageInfo)
        }

        function handleStorageChange(
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) {
            if (areaName !== 'local' || !changes[APP_PAGE_INFO_STORAGE_KEY]) {
                return
            }

            const nextPageInfo = changes[APP_PAGE_INFO_STORAGE_KEY].newValue as AppPageInfo | undefined
            setPageInfo(nextPageInfo ?? null)
        }

        function handleTabActivity() {
            void syncCurrentPage()
        }

        void syncCurrentPage()

        chrome.storage.onChanged.addListener(handleStorageChange)
        chrome.tabs.onActivated.addListener(handleTabActivity)
        chrome.tabs.onUpdated.addListener(handleTabActivity)

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
            chrome.tabs.onActivated.removeListener(handleTabActivity)
            chrome.tabs.onUpdated.removeListener(handleTabActivity)
        }
    }, [])

    return (
        <section className="mt-4 rounded-xl border border-border bg-card p-4">
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                    Debug
                </p>
                <h2 className="text-sm font-semibold text-foreground">Current page detector</h2>
            </div>

            <div className="mt-4 space-y-2 text-sm">
                <p>
                    <span className="font-medium text-foreground">Type:</span>{' '}
                    <span className="text-muted-foreground">{pageInfo?.type ?? 'unknown'}</span>
                </p>
                <p>
                    <span className="font-medium text-foreground">Title:</span>{' '}
                    <span className="text-muted-foreground">{pageInfo?.title || '-'}</span>
                </p>
                <p>
                    <span className="font-medium text-foreground">URL:</span>{' '}
                    <span className="break-all text-muted-foreground">{pageInfo?.url || '-'}</span>
                </p>
                <p>
                    <span className="font-medium text-foreground">Checked:</span>{' '}
                    <span className="text-muted-foreground">{pageInfo?.checkedAt || '-'}</span>
                </p>
            </div>
        </section>
    )
}
