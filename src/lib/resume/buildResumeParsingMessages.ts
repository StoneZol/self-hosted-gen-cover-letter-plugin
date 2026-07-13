import { loadResumeParsingConfig } from '@/lib/configs/resumeParsing/storage'
import type { ChatMessage } from '@/lib/types/llm/types'
import { assembleResumeParsingSystemPrompt } from './assembleResumeParsingPrompt'

type BuildResumeParsingMessagesInput = {
    sourceUrl: string
    rawResumeText: string
}

export async function buildResumeParsingMessages({
    sourceUrl,
    rawResumeText,
}: BuildResumeParsingMessagesInput): Promise<ChatMessage[]> {
    const { parsingPrompt } = await loadResumeParsingConfig()

    return [
        {
            role: 'developer',
            content: assembleResumeParsingSystemPrompt(parsingPrompt),
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
