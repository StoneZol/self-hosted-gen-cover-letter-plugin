import type {
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatMessage,
    OpenAiCompatibleConfig,
} from '../../types/llm/types'
import { assertExtensionNetworkContext } from '../../extension/networkGuard'
import { startServiceWorkerKeepAlive } from '../../extension/serviceWorkerKeepAlive'

function trimTrailingSlash(value: string): string {
    return value.endsWith('/') ? value.slice(0, -1) : value
}

function buildChatCompletionsUrl(baseUrl: string): string {
    return `${trimTrailingSlash(baseUrl)}/chat/completions`
}

function withReasoningDisabled(payload: ChatCompletionRequest): ChatCompletionRequest {
    return {
        ...payload,
        reasoning_effort: 'none',
    }
}

async function postChatCompletion(
    config: OpenAiCompatibleConfig,
    payload: ChatCompletionRequest,
): Promise<ChatCompletionResponse> {
    assertExtensionNetworkContext()

    const stopKeepAlive = startServiceWorkerKeepAlive()

    try {
        const response = await fetch(buildChatCompletionsUrl(config.baseUrl), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify(withReasoningDisabled(payload)),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`LLM request failed: ${response.status} ${response.statusText}. ${errorText}`)
        }

        return response.json() as Promise<ChatCompletionResponse>
    } finally {
        stopKeepAlive()
    }
}

export async function healthCheckOpenAiCompatible(config: OpenAiCompatibleConfig): Promise<string> {
    const response = await postChatCompletion(config, {
        model: config.model,
        temperature: 0,
        max_tokens: 20,
        messages: [
            {
                role: 'user',
                content: 'Ты жив?',
            },
        ],
    })

    const assistantText = response?.choices?.[0]?.message.content?.trim() ?? ''

    if (!assistantText) {
        throw new Error('Сервер не вернул текст в ответе.')
    }

    return assistantText
}

export type GenerateChatCompletionOptions = {
    maxTokens?: number
    temperature?: number
}

export async function generateChatCompletion(
    config: OpenAiCompatibleConfig,
    messages: ChatMessage[],
    options: GenerateChatCompletionOptions = {},
): Promise<ChatCompletionResponse> {
    return postChatCompletion(config, {
        model: config.model,
        temperature: options.temperature ?? config.temperature,
        max_tokens: options.maxTokens ?? config.maxTokens,
        messages,
    })
}

export function extractAssistantText(response: ChatCompletionResponse): string {
    return response?.choices?.[0]?.message.content?.trim() ?? ''
}
