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
    const trimmed = value.trim()

    if (!trimmed || trimmed.toLowerCase() === 'null') {
        return null
    }

    const lines = value.split('\n').map((line) => line.trim()).filter(Boolean)

    return lines.length > 0 ? lines : null
}

export function getPlatformDisplayTitle(platform: { id: string | null; title: string | null }, index: number): string {
    return platform.title || platform.id || `Платформа ${index + 1}`
}
