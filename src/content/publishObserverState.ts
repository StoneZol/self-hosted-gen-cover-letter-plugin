import { saveContentObserverDebug } from '@/lib/configs/app/contentObserverStorage'
import { resolveAppPageInfo } from '@/lib/hh/page'
import type { ContentObserverDebug, VacancyObserverStatus } from '@/lib/types/app/contentObserver'

type VacancyObserverSnapshot = {
    status: VacancyObserverStatus
    observerActive: boolean
    letterInputFound: boolean
    widgetMounted: boolean
    message: string
}

export async function publishVacancyObserverState(snapshot: VacancyObserverSnapshot): Promise<void> {
    const pageInfo = resolveAppPageInfo(window.location.href, document.title)

    const debug: ContentObserverDebug = {
        url: window.location.href,
        pageType: pageInfo.type,
        vacancy: {
            ...snapshot,
            updatedAt: new Date().toISOString(),
        },
    }

    await saveContentObserverDebug(debug)
}
