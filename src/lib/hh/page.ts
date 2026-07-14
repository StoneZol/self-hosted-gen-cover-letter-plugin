import {
    DEFAULT_CONTENT_CONFIG,
    getMatchingResumePlatform,
    getMatchingVacancyPlatform,
    isVacancyParsePage,
} from '@/lib/configs/content/config'
import type { ContentConfig } from '@/lib/types/content/types'
import type { AppPageInfo, AppPageType } from '@/lib/types/app/page'

function getPageType(url: URL, config: ContentConfig = DEFAULT_CONTENT_CONFIG): AppPageType {
    if (getMatchingResumePlatform(url.href, config)) {
        return 'resume'
    }

    if (getMatchingVacancyPlatform(url.href, config)) {
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

export function resolveAppPageInfo(
    urlString: string,
    title = '',
    config: ContentConfig = DEFAULT_CONTENT_CONFIG,
): AppPageInfo {
    try {
        const url = new URL(urlString)

        return {
            type: getPageType(url, config),
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

export function isResumePage(
    urlString: string,
    config: ContentConfig = DEFAULT_CONTENT_CONFIG,
): boolean {
    return resolveAppPageInfo(urlString, '', config).type === 'resume'
}

export function isVacancyPage(
    urlString: string,
    config: ContentConfig = DEFAULT_CONTENT_CONFIG,
): boolean {
    return resolveAppPageInfo(urlString, '', config).type === 'vacancy'
}

export function isVacancyParseTab(
    urlString: string,
    config: ContentConfig = DEFAULT_CONTENT_CONFIG,
): boolean {
    return isVacancyParsePage(urlString, config)
}
