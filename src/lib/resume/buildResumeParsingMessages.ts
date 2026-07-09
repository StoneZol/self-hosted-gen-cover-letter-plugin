import { INTERNAL_RESUME_PARSING_CONFIG } from '@/lib/configs/internal/resumeParsing'
import type { ChatMessage } from '@/lib/types/llm/types'

type BuildResumeParsingMessagesInput = {
    sourceUrl: string
    rawResumeText: string
}

export function buildResumeParsingMessages({
    sourceUrl,
    rawResumeText,
}: BuildResumeParsingMessagesInput): ChatMessage[] {
    return [
        {
            role: 'developer',
            content: INTERNAL_RESUME_PARSING_CONFIG.systemPrompt,
        },
        {
            role: 'user',
            content: `sourceUrl: ${sourceUrl}

Сырой текст резюме:
"""
${rawResumeText}
"""`,
        },
    ]
}
