import type {
    ChatMessage,
    GenerateChatCompletionOptions,
    LlmConfig,
    NormalizedLlmResponse,
} from '@/lib/types/llm/types'
import { assertExtensionNetworkContext } from '../../extension/networkGuard'
import { startServiceWorkerKeepAlive } from '../../extension/serviceWorkerKeepAlive'
import { mapMessagesToAnthropic } from './mapMessagesToAnthropic'

const ANTHROPIC_VERSION = '2023-06-01'

type AnthropicContentBlock = {
    type: string
    text?: string
}

type AnthropicMessageResponse = {
    content?: AnthropicContentBlock[]
    stop_reason?: string | null
}

function trimTrailingSlash(value: string): string {
    return value.endsWith('/') ? value.slice(0, -1) : value
}

function buildMessagesUrl(baseUrl: string): string {
    return `${trimTrailingSlash(baseUrl)}/messages`
}

function extractAnthropicText(response: AnthropicMessageResponse): string {
    return (response.content ?? [])
        .filter((block) => block.type === 'text')
        .map((block) => block.text?.trim() ?? '')
        .filter(Boolean)
        .join('\n')
        .trim()
}

function normalizeAnthropicResponse(response: AnthropicMessageResponse): NormalizedLlmResponse {
    return {
        text: extractAnthropicText(response),
        finishReason: response.stop_reason ?? null,
    }
}

async function postAnthropicMessage(
    config: LlmConfig,
    messages: ChatMessage[],
    options: GenerateChatCompletionOptions = {},
): Promise<NormalizedLlmResponse> {
    assertExtensionNetworkContext()

    const stopKeepAlive = startServiceWorkerKeepAlive()
    const mappedMessages = mapMessagesToAnthropic(messages)

    try {
        const response = await fetch(buildMessagesUrl(config.baseUrl), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.apiKey,
                'anthropic-version': ANTHROPIC_VERSION,
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model: config.model,
                max_tokens: options.maxTokens ?? config.maxTokens,
                temperature: options.temperature ?? config.temperature,
                ...(mappedMessages.system ? { system: mappedMessages.system } : {}),
                messages: mappedMessages.messages,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`LLM request failed: ${response.status} ${response.statusText}. ${errorText}`)
        }

        const payload = (await response.json()) as AnthropicMessageResponse

        return normalizeAnthropicResponse(payload)
    } finally {
        stopKeepAlive()
    }
}

export async function healthCheckAnthropic(config: LlmConfig): Promise<string> {
    const response = await postAnthropicMessage(
        {
            ...config,
            temperature: 0,
        },
        [
            {
                role: 'user',
                content: 'Ты жив?',
            },
        ],
        {
            temperature: 0,
        },
    )

    if (!response.text) {
        throw new Error('Сервер не вернул текст в ответе.')
    }

    return response.text
}

export async function generateAnthropicChatCompletion(
    config: LlmConfig,
    messages: ChatMessage[],
    options: GenerateChatCompletionOptions = {},
): Promise<NormalizedLlmResponse> {
    return postAnthropicMessage(config, messages, options)
}
