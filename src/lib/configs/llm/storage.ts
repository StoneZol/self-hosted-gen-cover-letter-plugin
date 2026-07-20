import type { LlmConfig, LlmProviderType } from '../../types/llm/types'

export const DEFAULT_OPENAI_COMPATIBLE_LLM_CONFIG: LlmConfig = {
    providerType: 'openai-compatible',
    baseUrl: 'http://localhost:1234/v1',
    apiKey: 'lm-studio',
    model: 'local-model',
    temperature: 0.2,
    maxTokens: 6000,
}

export const DEFAULT_ANTHROPIC_LLM_CONFIG: LlmConfig = {
    providerType: 'anthropic',
    baseUrl: 'http://localhost:1234/v1',
    apiKey: 'lm-studio',
    model: 'local-model',
    temperature: 0.2,
    maxTokens: 6000,
}

const STORAGE_KEY = 'llmConfig'

export function getDefaultLlmConfigForProvider(providerType: LlmProviderType): LlmConfig {
    return providerType === 'anthropic'
        ? DEFAULT_ANTHROPIC_LLM_CONFIG
        : DEFAULT_OPENAI_COMPATIBLE_LLM_CONFIG
}

function normalizeStoredLlmConfig(storedConfig: Partial<LlmConfig> | undefined): LlmConfig {
    const providerType: LlmProviderType =
        storedConfig?.providerType === 'anthropic' ? 'anthropic' : 'openai-compatible'
    const defaults = getDefaultLlmConfigForProvider(providerType)

    return {
        ...defaults,
        ...storedConfig,
        providerType,
        temperature: Number(storedConfig?.temperature ?? defaults.temperature) || 0,
        maxTokens: Number(storedConfig?.maxTokens ?? defaults.maxTokens) || 0,
    }
}

export async function loadLlmConfig(): Promise<LlmConfig> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedConfig = result[STORAGE_KEY] as Partial<LlmConfig> | undefined

    return normalizeStoredLlmConfig(storedConfig)
}

export async function saveLlmConfig(config: LlmConfig): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: normalizeStoredLlmConfig(config),
    })
}
