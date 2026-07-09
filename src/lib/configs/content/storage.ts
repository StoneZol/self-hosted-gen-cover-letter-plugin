import type { ContentConfig, ContentPlatform } from '@/lib/types/content/types'
import { DEFAULT_CONTENT_CONFIG } from './config'

const STORAGE_KEY = 'contentConfig'

type LegacyContentConfig = {
    resumePagePattern?: string
    resumeContentSelector?: string
}

function normalizeStringLines(lines: string[] | undefined, fallback: string[]): string[] {
    const normalized = lines?.map((line) => line.trim()).filter(Boolean) ?? []

    return normalized.length > 0 ? normalized : fallback
}

function normalizeOptionalStringLines(lines: string[] | undefined): string[] {
    return lines?.map((line) => line.trim()).filter(Boolean) ?? []
}

function normalizePlatform(platform: Partial<ContentPlatform>): ContentPlatform {
    const defaultPlatform = DEFAULT_CONTENT_CONFIG.platforms[0]
    const legacyVacancyPatterns = [
        ...(platform.vacancyPagePatterns ?? []),
        ...(('vacancyResponsePagePatterns' in platform
            ? (platform as Partial<ContentPlatform> & { vacancyResponsePagePatterns?: string[] }).vacancyResponsePagePatterns
            : []) ?? []),
    ]
    const legacyVacancySelectors =
        ('vacancyResponseLetterInputSelectors' in platform
            ? (platform as Partial<ContentPlatform> & { vacancyResponseLetterInputSelectors?: string[] }).vacancyResponseLetterInputSelectors
            : undefined) ?? platform.vacancyLetterInputSelectors

    return {
        id: platform.id?.trim() || defaultPlatform.id,
        title: platform.title?.trim() || defaultPlatform.title,
        enabled: platform.enabled ?? true,
        resumePagePatterns: normalizeStringLines(
            platform.resumePagePatterns,
            defaultPlatform.resumePagePatterns,
        ),
        resumeContentSelectors: normalizeStringLines(
            platform.resumeContentSelectors,
            defaultPlatform.resumeContentSelectors,
        ),
        vacancyPagePatterns: normalizeStringLines(
            legacyVacancyPatterns,
            defaultPlatform.vacancyPagePatterns,
        ),
        vacancyLetterInputSelectors: normalizeStringLines(
            legacyVacancySelectors,
            defaultPlatform.vacancyLetterInputSelectors,
        ),
        vacancyLetterInjectSelectors:
            platform.vacancyLetterInjectSelectors !== undefined
                ? normalizeOptionalStringLines(platform.vacancyLetterInjectSelectors)
                : defaultPlatform.vacancyLetterInjectSelectors,
    }
}

function normalizeContentConfig(
    storedConfig?: Partial<ContentConfig> | LegacyContentConfig,
): ContentConfig {
    if (storedConfig && 'platforms' in storedConfig && Array.isArray(storedConfig.platforms)) {
        return {
            platforms: storedConfig.platforms.map(normalizePlatform),
        }
    }

    if (storedConfig && ('resumePagePattern' in storedConfig || 'resumeContentSelector' in storedConfig)) {
        const defaultPlatform = DEFAULT_CONTENT_CONFIG.platforms[0]

        return {
            platforms: [
                normalizePlatform({
                    id: defaultPlatform.id,
                    title: defaultPlatform.title,
                    enabled: true,
                    resumePagePatterns: [
                        storedConfig.resumePagePattern || defaultPlatform.resumePagePatterns[0],
                    ],
                    resumeContentSelectors: [
                        storedConfig.resumeContentSelector || defaultPlatform.resumeContentSelectors[0],
                    ],
                }),
            ],
        }
    }

    return DEFAULT_CONTENT_CONFIG
}

export async function loadContentConfig(): Promise<ContentConfig> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedConfig = result[STORAGE_KEY] as Partial<ContentConfig> | LegacyContentConfig | undefined

    return normalizeContentConfig(storedConfig)
}

export async function saveContentConfig(config: ContentConfig): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: normalizeContentConfig(config),
    })
}
