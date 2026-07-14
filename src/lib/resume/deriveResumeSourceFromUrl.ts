import { getMatchingResumePlatform } from '@/lib/configs/content/config'
import { loadContentConfig } from '@/lib/configs/content/storage'

function deriveResumeSourceFromHostname(hostname: string): string {
    const normalizedHostname = hostname.replace(/^www\./i, '')

    if (/(\.|^)hh\.ru$/i.test(normalizedHostname)) {
        return 'HeadHunter'
    }

    if (normalizedHostname.includes('careerist.ru')) {
        return 'Careerist'
    }

    const hostnameParts = normalizedHostname.split('.')
    const siteName = hostnameParts.length >= 2 ? hostnameParts[hostnameParts.length - 2] : undefined

    if (siteName) {
        return siteName.charAt(0).toUpperCase() + siteName.slice(1)
    }

    return normalizedHostname
}

export async function deriveResumeSourceFromUrl(sourceUrl: string): Promise<string> {
    const contentConfig = await loadContentConfig()
    const platform = getMatchingResumePlatform(sourceUrl, contentConfig)

    if (platform?.title) {
        return platform.title
    }

    if (platform?.id) {
        return platform.id
    }

    try {
        return deriveResumeSourceFromHostname(new URL(sourceUrl).hostname)
    } catch {
        return 'Unknown'
    }
}
