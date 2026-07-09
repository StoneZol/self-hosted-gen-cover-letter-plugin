import { DEFAULT_CONTENT_CONFIG } from '@/lib/configs/content/config'
import type { AppPageInfo, AppPageType } from '@/lib/types/app/page'

function getPageType(url: URL): AppPageType {
    if (!/(\.|^)hh\.ru$/i.test(url.hostname)) {
        return 'external'
    }

    if (new RegExp(DEFAULT_CONTENT_CONFIG.resumePagePattern, 'i').test(url.href)) {
        return 'hh-resume'
    }

    if (/^\/vacancy\/\d+/i.test(url.pathname)) {
        return 'hh-vacancy'
    }

    if (url.pathname === '/' || url.pathname === '') {
        return 'hh-home'
    }

    return 'hh-other'
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
    return resolveAppPageInfo(urlString).type === 'hh-resume'
}
