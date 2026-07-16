export function stringifyNullable(value: string | null): string {
    return value ?? 'null'
}

export function parseNullableString(value: string): string | null {
    const trimmed = value.trim()

    if (!trimmed || trimmed.toLowerCase() === 'null') {
        return null
    }

    return trimmed
}

export function stringifyNullableLines(values: string[] | null): string {
    if (values === null) {
        return 'null'
    }

    return values.join('\n')
}

export function parseNullableLinesForEdit(value: string): string[] | null {
    const normalized = value.replace(/\r\n/g, '\n')
    const trimmedWhole = normalized.trim()

    if (!trimmedWhole || trimmedWhole.toLowerCase() === 'null') {
        return null
    }

    // Keep empty lines and trailing newlines while editing — otherwise Enter
    // appears to do nothing (empty line is filtered out on every keystroke).
    return normalized.split('\n')
}

export function getPlatformDisplayTitle(platform: { id: string | null; title: string | null }, index: number): string {
    return platform.title || platform.id || `Платформа ${index + 1}`
}
