import { SYNC_VACANCY_DRAFT_MESSAGE } from '@/lib/extension/contentMessages'
import {
    getMatchingResumePlatform,
    getMatchingVacancyPlatform,
} from '@/lib/configs/content/config'
import { getContentConfig, initContentConfig, subscribeContentConfig } from './contentConfigRuntime'
import {
    mountResumeScenario,
    mountVacancyResponseScenario,
    unmountVacancyResponseScenario,
} from './scenarios'
import {
    forceSyncVacancyPageDraft,
    syncVacancyPageDraftForUrl,
    watchVacancyPageDraftVisibility,
} from './syncVacancyPageDraft'
import { watchUrlChanges } from './watchUrlChanges'

function syncContentScenarios(url: string): void {
    const config = getContentConfig()

    syncVacancyPageDraftForUrl(url)

    if (getMatchingResumePlatform(url, config)) {
        mountResumeScenario()
    }

    if (getMatchingVacancyPlatform(url, config)) {
        mountVacancyResponseScenario()
        return
    }

    unmountVacancyResponseScenario()
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== SYNC_VACANCY_DRAFT_MESSAGE) {
        return
    }

    void forceSyncVacancyPageDraft().then(() => {
        sendResponse({ ok: true })
    })

    return true
})

void initContentConfig().then(() => {
    watchVacancyPageDraftVisibility()
    syncContentScenarios(window.location.href)
    watchUrlChanges(syncContentScenarios)
    subscribeContentConfig(() => syncContentScenarios(window.location.href))
})
