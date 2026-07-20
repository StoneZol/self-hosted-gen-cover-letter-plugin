import { parseResumeJsonFromAssistant } from '@/lib/resume/parseResumeJson'
import {
    vacancyClassificationResultSchema,
    type VacancyClassificationResult,
} from '@/lib/types/vacancy/types'
import { extractAssistantText, generateChatCompletion } from '@/lib/api/llm/client'
import { loadLlmConfig } from '@/lib/configs/llm/storage'
import { buildVacancyClassificationMessages } from './buildVacancyClassificationMessages'

export async function classifyVacancyWithLlm(vacancyText: string): Promise<VacancyClassificationResult> {
    const llmConfig = await loadLlmConfig()
    const messages = buildVacancyClassificationMessages(vacancyText)
    const response = await generateChatCompletion(llmConfig, messages)
    const assistantText = extractAssistantText(response)

    if (!assistantText) {
        throw new Error('Модель вернула пустой ответ.')
    }

    const normalizedText = assistantText.trim().toLowerCase()

    if (normalizedText === 'true') {
        return { isVacancy: true }
    }

    if (normalizedText === 'false') {
        return { isVacancy: false }
    }

    const parsedResult = parseResumeJsonFromAssistant(assistantText)

    return vacancyClassificationResultSchema.parse(parsedResult)
}
