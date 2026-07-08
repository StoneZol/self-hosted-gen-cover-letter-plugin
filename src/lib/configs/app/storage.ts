import type { ContentConfig } from '@/lib/types/content/types'
import type { OpenAiCompatibleConfig } from '@/lib/types/llm/types'
import { loadContentConfig } from '../content/storage'
import { loadLlmConfig } from '../llm/storage'

export type AppConfig = {
    content: ContentConfig
    llm: OpenAiCompatibleConfig
}

export async function loadAppConfig(): Promise<AppConfig> {
    const [content, llm] = await Promise.all([
        loadContentConfig(),
        loadLlmConfig(),
    ])

    return {
        content,
        llm,
    }
}
