export function parseResumeJsonFromAssistant(text: string): unknown {
    const trimmedText = text.trim()
    const fencedMatch = trimmedText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
    const jsonText = fencedMatch?.[1]?.trim() ?? trimmedText

    return JSON.parse(jsonText)
}
