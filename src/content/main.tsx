import { isResumePage, isVacancyPage } from '@/lib/hh/page'
import { initContentConfig } from './contentConfigRuntime'
import {
    mountResumeScenario,
    mountVacancyResponseScenario,
    unmountVacancyResponseScenario,
} from './scenarios'
import { watchUrlChanges } from './watchUrlChanges'

function syncContentScenarios(url: string): void {
    if (isResumePage(url)) {
        mountResumeScenario()
    }

    if (isVacancyPage(url)) {
        mountVacancyResponseScenario()
        return
    }

    unmountVacancyResponseScenario()
}

void initContentConfig().then(() => {
    syncContentScenarios(window.location.href)
    watchUrlChanges(syncContentScenarios)
})
