import { useEffect, useState } from 'react'
import {
    APP_PAGE_INFO_STORAGE_KEY,
    loadAppPageInfo,
    saveAppPageInfo,
} from '@/lib/configs/app/pageStorage'
import {
    CONTENT_OBSERVER_DEBUG_STORAGE_KEY,
    loadContentObserverDebug,
} from '@/lib/configs/app/contentObserverStorage'
import { resolveAppPageInfo } from '@/lib/hh/page'
import type { AppPageInfo } from '@/lib/types/app/page'
import type { ContentObserverDebug } from '@/lib/types/app/contentObserver'

async function getActiveTabPageInfo(): Promise<AppPageInfo> {
    const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    })

    return resolveAppPageInfo(activeTab?.url ?? '', activeTab?.title ?? '')
}

async function getActiveTabUrl(): Promise<string> {
    const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    })

    return activeTab?.url ?? ''
}

export function DebugCurrentPage() {
    const [pageInfo, setPageInfo] = useState<AppPageInfo | null>(null)
    const [observerDebug, setObserverDebug] = useState<ContentObserverDebug | null>(null)
    const [activeTabUrl, setActiveTabUrl] = useState('')

    useEffect(() => {
        async function loadDebugState() {
            const [loadedPageInfo, loadedObserverDebug, tabUrl] = await Promise.all([
                loadAppPageInfo(),
                loadContentObserverDebug(),
                getActiveTabUrl(),
            ])

            setPageInfo(loadedPageInfo)
            setObserverDebug(loadedObserverDebug)
            setActiveTabUrl(tabUrl)
        }

        async function syncCurrentPage() {
            const nextPageInfo = await getActiveTabPageInfo()
            const tabUrl = await getActiveTabUrl()

            await saveAppPageInfo(nextPageInfo)
            setPageInfo(nextPageInfo)
            setActiveTabUrl(tabUrl)
        }

        function handleStorageChange(
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) {
            if (areaName !== 'local') {
                return
            }

            if (changes[APP_PAGE_INFO_STORAGE_KEY]) {
                const nextPageInfo = changes[APP_PAGE_INFO_STORAGE_KEY].newValue as AppPageInfo | undefined
                setPageInfo(nextPageInfo ?? null)
            }

            if (changes[CONTENT_OBSERVER_DEBUG_STORAGE_KEY]) {
                const nextObserverDebug = changes[CONTENT_OBSERVER_DEBUG_STORAGE_KEY].newValue as
                    | ContentObserverDebug
                    | undefined
                setObserverDebug(nextObserverDebug ?? null)
            }
        }

        function handleTabActivity() {
            void syncCurrentPage()
        }

        void loadDebugState()
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

    const isObserverForActiveTab = observerDebug?.url === activeTabUrl

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

            <div className="mt-4 border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-foreground">Mutation observer</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                    Состояние content script. Инжект больше не зависит от этого блока.
                </p>

                <div className="mt-3 space-y-2 text-sm">
                    <p>
                        <span className="font-medium text-foreground">Active tab match:</span>{' '}
                        <span className="text-muted-foreground">
                            {isObserverForActiveTab ? 'yes' : 'no'}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium text-foreground">Vacancy status:</span>{' '}
                        <span className="text-muted-foreground">
                            {isObserverForActiveTab
                                ? observerDebug?.vacancy.status ?? 'unknown'
                                : '-'}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium text-foreground">Observer active:</span>{' '}
                        <span className="text-muted-foreground">
                            {isObserverForActiveTab
                                ? String(observerDebug?.vacancy.observerActive ?? false)
                                : '-'}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium text-foreground">Letter input found:</span>{' '}
                        <span className="text-muted-foreground">
                            {isObserverForActiveTab
                                ? String(observerDebug?.vacancy.letterInputFound ?? false)
                                : '-'}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium text-foreground">Widget mounted:</span>{' '}
                        <span className="text-muted-foreground">
                            {isObserverForActiveTab
                                ? String(observerDebug?.vacancy.widgetMounted ?? false)
                                : '-'}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium text-foreground">Message:</span>{' '}
                        <span className="text-muted-foreground">
                            {isObserverForActiveTab
                                ? observerDebug?.vacancy.message || '-'
                                : 'Нет данных от content script для активной вкладки.'}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium text-foreground">Updated:</span>{' '}
                        <span className="text-muted-foreground">
                            {isObserverForActiveTab
                                ? observerDebug?.vacancy.updatedAt || '-'
                                : '-'}
                        </span>
                    </p>
                </div>
            </div>
        </section>
    )
}
