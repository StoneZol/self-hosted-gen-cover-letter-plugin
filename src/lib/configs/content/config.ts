import type { ContentConfig, ContentPlatform } from '@/lib/types/content/types'

export const DEFAULT_CONTENT_CONFIG: ContentConfig = {
    platforms: [
        {
            id: 'hh',
            title: 'HeadHunter',
            enabled: true,
            resumePagePatterns: ['^https://(?:[^./]+\\.)?hh\\.ru/resume/[^/?#]+'],
            resumeContentSelectors: ['[data-qa="main-content"]'],
            vacancyPagePatterns: [
                '^https://(?:[^./]+\\.)?hh\\.ru/vacancy/\\d+',
                '^https://(?:[^./]+\\.)?hh\\.ru/applicant/vacancy_response',
            ],
            vacancyLetterInputSelectors: [
                '[data-qa="vacancy-response-popup-form-letter-input"]',
            ],
            vacancyLetterInjectSelectors: [
                '[data-qa="textarea-wrapper"]',
            ],
        },
    ],
}

export const INJECTED_WIDGET_SELECTOR = '#hh-free-cheat-save-resume'
export const INJECTED_COVER_LETTER_WIDGET_SELECTOR = '#hh-free-cheat-generate-cover-letter'

function matchesAnyPattern(url: string, patterns: string[]): boolean {
    return patterns.some((pattern) => new RegExp(pattern, 'i').test(url))
}

function isElementVisible(element: HTMLElement): boolean {
    if (!element.isConnected) {
        return false
    }

    const style = window.getComputedStyle(element)

    if (style.display === 'none' || style.visibility === 'hidden') {
        return false
    }

    const rect = element.getBoundingClientRect()

    return rect.width > 0 || rect.height > 0
}

function pickBestMatchedElement(elements: HTMLElement[]): HTMLElement | null {
    if (elements.length === 0) {
        return null
    }

    if (elements.length === 1) {
        return elements[0]
    }

    const visibleElements = elements.filter(isElementVisible)

    if (visibleElements.length === 1) {
        return visibleElements[0]
    }

    if (visibleElements.length > 1) {
        return visibleElements[visibleElements.length - 1]
    }

    return elements[elements.length - 1]
}

export function getEnabledContentPlatforms(config: ContentConfig): ContentPlatform[] {
    return config.platforms.filter((platform) => platform.enabled)
}

function findMatchingPlatform(
    url: string,
    patternsKey: 'resumePagePatterns' | 'vacancyPagePatterns',
    config: ContentConfig,
): ContentPlatform | null {
    return (
        getEnabledContentPlatforms(config).find((platform) =>
            matchesAnyPattern(url, platform[patternsKey]),
        ) ?? null
    )
}

export function getMatchingResumePlatform(
    url: string,
    config: ContentConfig = DEFAULT_CONTENT_CONFIG,
): ContentPlatform | null {
    return findMatchingPlatform(url, 'resumePagePatterns', config)
}

export function getMatchingVacancyPlatform(
    url: string,
    config: ContentConfig = DEFAULT_CONTENT_CONFIG,
): ContentPlatform | null {
    return findMatchingPlatform(url, 'vacancyPagePatterns', config)
}

export function getResumeContentElementFromConfig(
    url: string,
    config: ContentConfig = DEFAULT_CONTENT_CONFIG,
    root: ParentNode = document,
): HTMLElement | null {
    const platform = getMatchingResumePlatform(url, config)

    if (!platform) {
        return null
    }

    for (const selector of platform.resumeContentSelectors) {
        const element = root.querySelector<HTMLElement>(selector)

        if (element) {
            return element
        }
    }

    return null
}

export function getVacancyLetterInputFromConfig(
    url: string,
    config: ContentConfig = DEFAULT_CONTENT_CONFIG,
    root: ParentNode = document,
): HTMLElement | null {
    const platform = getMatchingVacancyPlatform(url, config)

    if (!platform) {
        return null
    }

    for (const selector of platform.vacancyLetterInputSelectors) {
        const elements = Array.from(root.querySelectorAll<HTMLElement>(selector))
        const element = pickBestMatchedElement(elements)

        if (element) {
            return element
        }
    }

    return null
}

export function hasVacancyLetterInjectSelectors(
    url: string,
    config: ContentConfig = DEFAULT_CONTENT_CONFIG,
): boolean {
    const platform = getMatchingVacancyPlatform(url, config)

    return Boolean(platform && platform.vacancyLetterInjectSelectors.length > 0)
}

function isInjectTargetRelatedToLetterInput(
    injectTarget: HTMLElement,
    selector: string,
    letterInput: HTMLElement,
): boolean {
    return injectTarget.contains(letterInput) || letterInput.closest(selector) === injectTarget
}

export function getVacancyLetterInjectTargetFromConfig(
    url: string,
    config: ContentConfig = DEFAULT_CONTENT_CONFIG,
    root: ParentNode = document,
    letterInput?: HTMLElement | null,
): HTMLElement | null {
    const platform = getMatchingVacancyPlatform(url, config)

    if (!platform || platform.vacancyLetterInjectSelectors.length === 0) {
        return null
    }

    if (letterInput) {
        for (const selector of platform.vacancyLetterInjectSelectors) {
            const closestTarget = letterInput.closest<HTMLElement>(selector)

            if (closestTarget) {
                return closestTarget
            }
        }

        for (const selector of platform.vacancyLetterInjectSelectors) {
            const relatedTargets = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
                (element) => element.contains(letterInput),
            )

            const relatedTarget = pickBestMatchedElement(relatedTargets)

            if (relatedTarget) {
                return relatedTarget
            }
        }
    }

    for (const selector of platform.vacancyLetterInjectSelectors) {
        const elements = root.querySelectorAll<HTMLElement>(selector)

        if (elements.length !== 1) {
            continue
        }

        const injectTarget = elements[0]

        if (letterInput && !isInjectTargetRelatedToLetterInput(injectTarget, selector, letterInput)) {
            continue
        }

        return injectTarget
    }

    return null
}
