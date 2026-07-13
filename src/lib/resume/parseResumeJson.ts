function extractJsonCandidate(text: string): string {
    const trimmedText = text.trim()
    const fencedMatch = trimmedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)

    if (fencedMatch?.[1]) {
        return fencedMatch[1].trim()
    }

    const start = trimmedText.indexOf('{')
    const end = trimmedText.lastIndexOf('}')

    if (start !== -1 && end > start) {
        return trimmedText.slice(start, end + 1)
    }

    return trimmedText
}

function escapeControlCharactersInsideJsonStrings(jsonText: string): string {
    let result = ''
    let inString = false
    let escaped = false

    for (const char of jsonText) {
        if (escaped) {
            result += char
            escaped = false
            continue
        }

        if (char === '\\' && inString) {
            result += char
            escaped = true
            continue
        }

        if (char === '"') {
            inString = !inString
            result += char
            continue
        }

        if (inString) {
            if (char === '\n') {
                result += '\\n'
                continue
            }

            if (char === '\r') {
                result += '\\r'
                continue
            }

            if (char === '\t') {
                result += '\\t'
                continue
            }
        }

        result += char
    }

    return result
}

function removeTrailingCommas(jsonText: string): string {
    return jsonText.replace(/,\s*([}\]])/g, '$1')
}

export function parseResumeJsonFromAssistant(text: string): unknown {
    const trimmedText = text.trim()

    if (!trimmedText) {
        throw new Error('Модель вернула пустой ответ.')
    }

    const jsonText = removeTrailingCommas(
        escapeControlCharactersInsideJsonStrings(extractJsonCandidate(trimmedText)),
    )

    try {
        return JSON.parse(jsonText)
    } catch (error: unknown) {
        const looksTruncated = !jsonText.trimEnd().endsWith('}') && !jsonText.trimEnd().endsWith(']')

        if (looksTruncated) {
            throw new Error(
                'JSON резюме обрезан — генерация прервалась до конца. Попробуйте ещё раз или выберите более быструю модель.',
            )
        }

        const details = error instanceof Error ? error.message : 'неизвестная ошибка'
        throw new Error(`Модель вернула невалидный JSON: ${details}`)
    }
}
