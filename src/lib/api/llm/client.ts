import type { ChatMessage, GenerateChatCompletionOptions, LlmConfig, NormalizedLlmResponse } from '@/lib/types/llm/types'
import { generateAnthropicChatCompletion, healthCheckAnthropic } from './anthropic'
import { generateOpenAiCompatibleChatCompletion, healthCheckOpenAiCompatible } from './openaiCompatible'

export type { GenerateChatCompletionOptions }

export async function generateChatCompletion(
    config: LlmConfig,
    messages: ChatMessage[],
    options: GenerateChatCompletionOptions = {},
): Promise<NormalizedLlmResponse> {
    switch (config.providerType) {
        case 'anthropic':
            return generateAnthropicChatCompletion(config, messages, options)
        case 'openai-compatible':
        default:
            return generateOpenAiCompatibleChatCompletion(config, messages, options)
    }
}

export async function healthCheckLlm(config: LlmConfig): Promise<string> {
    switch (config.providerType) {
        case 'anthropic':
            return healthCheckAnthropic(config)
        case 'openai-compatible':
        default:
            return healthCheckOpenAiCompatible(config)
    }
}

export function extractAssistantText(response: NormalizedLlmResponse): string {
    return response.text.trim()
}

export function isResponseTruncated(response: NormalizedLlmResponse): boolean {
    return response.finishReason === 'length' || response.finishReason === 'max_tokens'
}
