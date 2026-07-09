export function extractResumeIdFromUrl(url: string): string | null {
    try {
        const pathname = new URL(url).pathname
        const match = pathname.match(/\/resume\/([^/?#]+)/i)

        return match?.[1] ?? null
    } catch {
        return null
    }
}
