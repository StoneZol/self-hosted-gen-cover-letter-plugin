import {
    getVacancyLetterInjectTargetFromConfig,
    getVacancyLetterInputFromConfig,
    hasVacancyLetterInjectSelectors,
} from '@/lib/configs/content/config'
import { getContentConfig } from './contentConfigRuntime'

export function getVacancyLetterInputElement(): HTMLElement | null {
    return getVacancyLetterInputFromConfig(window.location.href, getContentConfig())
}

export function getVacancyLetterInjectElement(
    letterInput?: HTMLElement | null,
): HTMLElement | null {
    return getVacancyLetterInjectTargetFromConfig(
        window.location.href,
        getContentConfig(),
        document,
        letterInput,
    )
}

export function isVacancyLetterInjectTargetConfigured(): boolean {
    return hasVacancyLetterInjectSelectors(window.location.href, getContentConfig())
}
