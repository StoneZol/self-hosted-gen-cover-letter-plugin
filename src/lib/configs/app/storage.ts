import type { ContentConfig } from '@/lib/types/content/types'
import type { CoverLetterConfig } from '@/lib/types/coverLetter/types'
import type { OpenAiCompatibleConfig } from '@/lib/types/llm/types'
import { loadContentConfig } from '../content/storage'
import { loadCoverLetterConfig } from '../coverLetter/storage'
import { loadLlmConfig } from '../llm/storage'

export type AppConfig = {
    content: ContentConfig
    llm: OpenAiCompatibleConfig
    coverLetter: CoverLetterConfig
}

export async function loadAppConfig(): Promise<AppConfig> {
    const [content, llm, coverLetter] = await Promise.all([
        loadContentConfig(),
        loadLlmConfig(),
        loadCoverLetterConfig(),
    ])

    return {
        content,
        llm,
        coverLetter,
    }
}
