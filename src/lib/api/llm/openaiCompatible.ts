import type {
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatMessage,
    OpenAiCompatibleConfig,
} from '../../types/llm/types'
import { assertExtensionNetworkContext } from '../../extension/networkGuard'

function trimTrailingSlash(value: string): string {
    return value.endsWith('/') ? value.slice(0, -1) : value
}

function buildChatCompletionsUrl(baseUrl: string): string {
    return `${trimTrailingSlash(baseUrl)}/chat/completions`
}

async function postChatCompletion(
    config: OpenAiCompatibleConfig,
    payload: ChatCompletionRequest,
): Promise<ChatCompletionResponse> {
    assertExtensionNetworkContext()

    const response = await fetch(buildChatCompletionsUrl(config.baseUrl), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`LLM request failed: ${response.status} ${response.statusText}. ${errorText}`)
    }

    return response.json() as Promise<ChatCompletionResponse>
}

export async function healthCheckOpenAiCompatible(config: OpenAiCompatibleConfig): Promise<string> {
    const response = await postChatCompletion(config, {
        model: config.model,
        temperature: 0,
        max_tokens: 20,
        messages: [
            {
                role: 'developer',
                content: 'Reply with exactly OK.',
            },
            {
                role: 'user',
                content: 'Health check',
            },
        ],
    })

    return response?.choices?.[0]?.message.content?.trim() ?? ''
}

export async function generateChatCompletion(
    config: OpenAiCompatibleConfig,
    messages: ChatMessage[],
): Promise<ChatCompletionResponse> {
    return postChatCompletion(config, {
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        messages,
    })
}

export function extractAssistantText(response: ChatCompletionResponse): string {
    return response?.choices?.[0]?.message.content?.trim() ?? ''
}
