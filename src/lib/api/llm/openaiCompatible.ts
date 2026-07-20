import type {
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatMessage,
    GenerateChatCompletionOptions,
    LlmConfig,
    NormalizedLlmResponse,
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

function normalizeOpenAiResponse(response: ChatCompletionResponse): NormalizedLlmResponse {
    const message = response?.choices?.[0]?.message
    const content = message?.content?.trim() ?? ''
    const text = content || message?.reasoning_content?.trim() || ''

    return {
        text,
        finishReason: response?.choices?.[0]?.finish_reason ?? null,
    }
}

async function postChatCompletion(
    config: LlmConfig,
    payload: ChatCompletionRequest,
): Promise<NormalizedLlmResponse> {
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

        const json = (await response.json()) as ChatCompletionResponse

        return normalizeOpenAiResponse(json)
    } finally {
        stopKeepAlive()
    }
}

export async function healthCheckOpenAiCompatible(config: LlmConfig): Promise<string> {
    const response = await postChatCompletion(config, {
        model: config.model,
        temperature: 0,
        max_tokens: config.maxTokens,
        messages: [
            {
                role: 'user',
                content: 'Ты жив?',
            },
        ],
    })

    if (!response.text) {
        throw new Error('Сервер не вернул текст в ответе.')
    }

    return response.text
}

export async function generateOpenAiCompatibleChatCompletion(
    config: LlmConfig,
    messages: ChatMessage[],
    options: GenerateChatCompletionOptions = {},
): Promise<NormalizedLlmResponse> {
    return postChatCompletion(config, {
        model: config.model,
        temperature: options.temperature ?? config.temperature,
        max_tokens: options.maxTokens ?? config.maxTokens,
        messages,
    })
}
