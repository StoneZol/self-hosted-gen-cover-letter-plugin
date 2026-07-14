import type { ContentConfig, ContentPlatform } from '@/lib/types/content/types'
import { DEFAULT_CONTENT_CONFIG } from './config'

const STORAGE_KEY = 'contentConfig'

type LegacyContentConfig = {
    resumePagePattern?: string
    resumeContentSelector?: string
}

function normalizeNullableString(value: string | null | undefined): string | null {
    if (value === null || value === undefined) {
        return null
    }

    const trimmed = value.trim()

    return trimmed || null
}

function normalizeNullableStringLines(lines: string[] | null | undefined): string[] | null {
    if (lines === null || lines === undefined) {
        return null
    }

    const normalized = lines.map((line) => line.trim()).filter(Boolean)

    return normalized.length > 0 ? normalized : null
}

function normalizePlatform(platform: Partial<ContentPlatform>): ContentPlatform {
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
        id: normalizeNullableString(platform.id),
        title: normalizeNullableString(platform.title),
        enabled: platform.enabled ?? true,
        resumePagePatterns: normalizeNullableStringLines(platform.resumePagePatterns),
        resumeContentSelectors: normalizeNullableStringLines(platform.resumeContentSelectors),
        vacancyPagePatterns: normalizeNullableStringLines(
            legacyVacancyPatterns.length > 0 ? legacyVacancyPatterns : platform.vacancyPagePatterns,
        ),
        vacancyParsePagePatterns: normalizeNullableStringLines(platform.vacancyParsePagePatterns),
        vacancyParseContentSelectors: normalizeNullableStringLines(platform.vacancyParseContentSelectors),
        vacancyLetterInputSelectors: normalizeNullableStringLines(
            legacyVacancySelectors ?? platform.vacancyLetterInputSelectors,
        ),
        vacancyLetterInjectSelectors: normalizeNullableStringLines(platform.vacancyLetterInjectSelectors),
    }
}

function normalizeLegacyPlatform(storedConfig: LegacyContentConfig): ContentPlatform {
    const defaultPlatform = DEFAULT_CONTENT_CONFIG.platforms[0]

    return normalizePlatform({
        id: defaultPlatform.id,
        title: defaultPlatform.title,
        enabled: true,
        resumePagePatterns: [
            storedConfig.resumePagePattern || defaultPlatform.resumePagePatterns?.[0] || '',
        ].filter(Boolean),
        resumeContentSelectors: [
            storedConfig.resumeContentSelector || defaultPlatform.resumeContentSelectors?.[0] || '',
        ].filter(Boolean),
        vacancyPagePatterns: defaultPlatform.vacancyPagePatterns,
        vacancyParsePagePatterns: defaultPlatform.vacancyParsePagePatterns,
        vacancyParseContentSelectors: defaultPlatform.vacancyParseContentSelectors,
        vacancyLetterInputSelectors: defaultPlatform.vacancyLetterInputSelectors,
        vacancyLetterInjectSelectors: defaultPlatform.vacancyLetterInjectSelectors,
    })
}

function normalizeContentConfig(
    storedConfig?: Partial<ContentConfig> | LegacyContentConfig,
): ContentConfig {
    if (storedConfig && 'platforms' in storedConfig && Array.isArray(storedConfig.platforms)) {
        return {
            platforms: storedConfig.platforms.map((platform) => normalizePlatform(platform)),
        }
    }

    if (storedConfig && ('resumePagePattern' in storedConfig || 'resumeContentSelector' in storedConfig)) {
        return {
            platforms: [normalizeLegacyPlatform(storedConfig)],
        }
    }

    return {
        platforms: DEFAULT_CONTENT_CONFIG.platforms.map((platform) => normalizePlatform(platform)),
    }
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

export { STORAGE_KEY as CONTENT_CONFIG_STORAGE_KEY }
