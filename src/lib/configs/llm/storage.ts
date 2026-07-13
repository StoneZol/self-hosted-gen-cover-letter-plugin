import type { OpenAiCompatibleConfig } from '../../types/llm/types'

export const DEFAULT_LLM_CONFIG: OpenAiCompatibleConfig = {
    providerType: 'openai-compatible',
    baseUrl: 'http://localhost:1234/v1',
    apiKey: 'lm-studio',
    model: 'local-model',
    temperature: 0.2,
    maxTokens: 6000,
}

const STORAGE_KEY = 'llmConfig'

export async function loadLlmConfig(): Promise<OpenAiCompatibleConfig> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedConfig = result[STORAGE_KEY] as Partial<OpenAiCompatibleConfig> | undefined

    return {
        ...DEFAULT_LLM_CONFIG,
        ...storedConfig,
        providerType: 'openai-compatible',
    }
}

export async function saveLlmConfig(config: OpenAiCompatibleConfig): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: config,
    })
}
