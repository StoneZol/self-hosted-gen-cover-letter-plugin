import { APP_PAGE_INFO_STORAGE_KEY } from '@/lib/configs/app/pageStorage'
import type { AppPageInfo } from '@/lib/types/app/page'
import { isResumePage } from '@/lib/hh/page'
import { mountResumeScenario } from './scenarios'

function syncContentScenarios(url: string): void {
    if (isResumePage(url)) {
        mountResumeScenario()
    }
}

function handlePageInfoChange(pageInfo?: AppPageInfo): void {
    if (!pageInfo) {
        return
    }

    if (pageInfo.url !== window.location.href) {
        return
    }

    syncContentScenarios(pageInfo.url)
}

syncContentScenarios(window.location.href)

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local' || !changes[APP_PAGE_INFO_STORAGE_KEY]) {
        return
    }

    handlePageInfoChange(changes[APP_PAGE_INFO_STORAGE_KEY].newValue as AppPageInfo | undefined)
})
