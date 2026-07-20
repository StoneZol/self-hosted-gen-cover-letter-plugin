import { loadCoverLetterConfig } from '@/lib/configs/coverLetter/storage'
import { extractAssistantText, generateChatCompletion } from '@/lib/api/llm/client'
import { loadLlmConfig } from '@/lib/configs/llm/storage'
import type { LastVacancy } from '@/lib/types/vacancy/types'
import type { Resume } from '@/lib/types/resume/types'
import { assembleCoverLetter } from './assemble'
import { buildCoverLetterMessages } from './buildCoverLetterMessages'
import { normalizeCoverLetterBody } from './normalizeCoverLetterBody'

type GenerateCoverLetterInput = {
    resume: Resume
    vacancy: LastVacancy | null
}

export async function generateCoverLetterWithLlm({
    resume,
    vacancy,
}: GenerateCoverLetterInput): Promise<string> {
    const [llmConfig, coverLetterConfig] = await Promise.all([
        loadLlmConfig(),
        loadCoverLetterConfig(),
    ])

    const messages = buildCoverLetterMessages({
        generationPrompt: coverLetterConfig.generationPrompt,
        resume,
        vacancy,
    })

    const response = await generateChatCompletion(llmConfig, messages)
    const assistantText = extractAssistantText(response)

    if (!assistantText) {
        throw new Error('Модель вернула пустой ответ.')
    }

    return assembleCoverLetter(
        normalizeCoverLetterBody(assistantText),
        coverLetterConfig.letterSignature,
    )
}
