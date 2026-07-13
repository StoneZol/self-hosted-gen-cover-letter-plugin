import {
    RESUME_JSON_SCHEMA,
    RESUME_PARSING_OUTPUT_FORMAT_RULES,
} from '@/lib/configs/resumeParsing/schema'

export function assembleResumeParsingSystemPrompt(parsingPrompt: string): string {
    const trimmedPrompt = parsingPrompt.trim()

    return `${trimmedPrompt}

Схема ответа (обязательная структура, не меняй поля и типы):
${RESUME_JSON_SCHEMA}

${RESUME_PARSING_OUTPUT_FORMAT_RULES}`
}
