export function assembleCoverLetter(body: string, letterSignature: string): string {
    const trimmedBody = body.trim()
    const trimmedSignature = letterSignature.trim()

    if (!trimmedSignature) {
        return trimmedBody
    }

    if (!trimmedBody) {
        return trimmedSignature
    }

    return `${trimmedBody}\n\n${trimmedSignature}`
}
