import {
    extractAssistantText,
    generateChatCompletion,
    isResponseTruncated,
} from '@/lib/api/llm/client'
import { loadLlmConfig } from '@/lib/configs/llm/storage'
import { resumeSchema, type Resume } from '@/lib/types/resume/types'
import { buildResumeParsingMessages } from './buildResumeParsingMessages'
import { deriveResumeSourceFromUrl } from './deriveResumeSourceFromUrl'
import { parseResumeJsonFromAssistant } from './parseResumeJson'
import { sanitizeResumeSelfAbout } from './sanitizeResumeSelfAbout'

type ParseResumeWithLlmInput = {
    sourceUrl: string
    rawResumeText: string
}

export async function parseResumeWithLlm({
    sourceUrl,
    rawResumeText,
}: ParseResumeWithLlmInput): Promise<Resume> {
    const llmConfig = await loadLlmConfig()
    const messages = await buildResumeParsingMessages({
        sourceUrl,
        rawResumeText,
    })
    const response = await generateChatCompletion(llmConfig, messages, {
        temperature: 0.1,
    })
    const assistantText = extractAssistantText(response)

    if (!assistantText) {
        throw new Error('Модель вернула пустой ответ.')
    }

    if (isResponseTruncated(response)) {
        throw new Error('Ответ модели обрезан по max tokens. Увеличьте max tokens в настройках LLM.')
    }

    const parsedResume = resumeSchema.parse(parseResumeJsonFromAssistant(assistantText))
    const source = await deriveResumeSourceFromUrl(sourceUrl)

    return resumeSchema.parse({
        ...parsedResume,
        source,
        selfAbout: sanitizeResumeSelfAbout(parsedResume.selfAbout),
    })
}
