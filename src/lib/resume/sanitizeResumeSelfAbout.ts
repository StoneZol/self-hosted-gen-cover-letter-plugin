const HH_RESUME_UI_GARBAGE_PATTERN =
    /(?:поднятие резюме|поднимать автоматически|видно всем работодателям|зарегистрированным на hh\.ru|можно сегодня в \d{1,2}:\d{2})/i

const LANGUAGE_LINE_PATTERN = /^язык\s*:/i

export function sanitizeResumeSelfAbout(selfAbout: string | undefined): string | undefined {
    const trimmedSelfAbout = selfAbout?.trim()

    if (!trimmedSelfAbout) {
        return undefined
    }

    if (HH_RESUME_UI_GARBAGE_PATTERN.test(trimmedSelfAbout)) {
        return undefined
    }

    if (LANGUAGE_LINE_PATTERN.test(trimmedSelfAbout)) {
        return undefined
    }

    return trimmedSelfAbout
}
