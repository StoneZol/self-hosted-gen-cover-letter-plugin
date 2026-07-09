import {
    DEFAULT_CONTENT_CONFIG,
    getMatchingResumePlatform,
    getMatchingVacancyPlatform,
} from '@/lib/configs/content/config'
import type { AppPageInfo, AppPageType } from '@/lib/types/app/page'

function getPageType(url: URL): AppPageType {
    if (getMatchingResumePlatform(url.href, DEFAULT_CONTENT_CONFIG)) {
        return 'resume'
    }

    if (getMatchingVacancyPlatform(url.href, DEFAULT_CONTENT_CONFIG)) {
        return 'vacancy'
    }

    if (!/(\.|^)hh\.ru$/i.test(url.hostname)) {
        return 'external'
    }

    if (url.pathname === '/' || url.pathname === '') {
        return 'home'
    }

    return 'other'
}

export function resolveAppPageInfo(urlString: string, title = ''): AppPageInfo {
    try {
        const url = new URL(urlString)

        return {
            type: getPageType(url),
            url: url.href,
            title,
            checkedAt: new Date().toISOString(),
        }
    } catch {
        return {
            type: 'unknown',
            url: urlString,
            title,
            checkedAt: new Date().toISOString(),
        }
    }
}

export function isResumePage(urlString: string): boolean {
    return resolveAppPageInfo(urlString).type === 'resume'
}

export function isVacancyPage(urlString: string): boolean {
    return resolveAppPageInfo(urlString).type === 'vacancy'
}
