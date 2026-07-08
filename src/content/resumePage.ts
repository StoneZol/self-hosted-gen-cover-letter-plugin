import {
    DEFAULT_CONTENT_CONFIG,
    INJECTED_WIDGET_SELECTOR,
} from '@/lib/configs/content/config'

const blockedLinePatterns = [
    /^window\./i,
    /^Мои резюме\//i,
    /^Редактировать/i,
    /^Добавить/i,
    /^Развернуть/i,
    /^Указать уровни/i,
    /^Перейти к тестам/i,
    /^Подтверждение навыков/i,
    /^Подобрали для вас \d+ подходящих вакансий/i,
    /^Завершённость резюме$/i,
    /^Ещё вы можете добавить$/i,
    /^Последнее\s+—/i,
    /^Видимость резюме$/i,
    /^ML и Data Science/i,
    /^Краткие и углублённые курсы/i,
    /^Посмотреть курсы/i,
]

function normalizeLine(line: string): string {
    return line.replace(/\s+/g, ' ').trim()
}

function isBlockedLine(line: string): boolean {
    return blockedLinePatterns.some((pattern) => pattern.test(line))
}

function dedupeSequentialLines(lines: string[]): string[] {
    return lines.filter((line, index) => line !== lines[index - 1])
}

export function getResumeContentElement(): HTMLElement | null {
    return document.querySelector<HTMLElement>(DEFAULT_CONTENT_CONFIG.resumeContentSelector)
}

export function extractResumeText(): string | null {
    const resumeContentElement = getResumeContentElement()

    if (!resumeContentElement) {
        return null
    }

    const injectedWidget = document.querySelector<HTMLElement>(INJECTED_WIDGET_SELECTOR)
    const widgetPlaceholder = document.createComment('hh-free-cheat-save-resume')

    if (injectedWidget?.parentNode) {
        injectedWidget.parentNode.replaceChild(widgetPlaceholder, injectedWidget)
    }

    try {
        const normalizedLines = resumeContentElement.innerText
            .split('\n')
            .map(normalizeLine)
            .filter(Boolean)
            .filter((line) => !isBlockedLine(line))

        const normalizedText = dedupeSequentialLines(normalizedLines).join('\n')

        return normalizedText || null
    } finally {
        if (widgetPlaceholder.parentNode && injectedWidget) {
            widgetPlaceholder.parentNode.replaceChild(injectedWidget, widgetPlaceholder)
        }
    }
}
