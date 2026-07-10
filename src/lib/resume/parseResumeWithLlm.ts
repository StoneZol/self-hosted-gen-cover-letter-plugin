import { generateChatCompletion, extractAssistantText } from '@/lib/api/llm/openaiCompatible'
import { loadLlmConfig } from '@/lib/configs/llm/storage'
import { resumeSchema, type Resume } from '@/lib/types/resume/types'
import { buildResumeParsingMessages } from './buildResumeParsingMessages'
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
    const messages = buildResumeParsingMessages({
        sourceUrl,
        rawResumeText,
    })
    const response = await generateChatCompletion(llmConfig, messages)
    const assistantText = extractAssistantText(response)

    if (!assistantText) {
        throw new Error('Модель вернула пустой ответ.')
    }

    const parsedResume = resumeSchema.parse(parseResumeJsonFromAssistant(assistantText))

    return resumeSchema.parse({
        ...parsedResume,
        selfAbout: sanitizeResumeSelfAbout(parsedResume.selfAbout),
    })
}
