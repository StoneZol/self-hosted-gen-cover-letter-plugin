import type { ChatMessage } from '@/lib/types/llm/types'

type AnthropicConversationMessage = {
    role: 'user' | 'assistant'
    content: string
}

export type AnthropicMappedMessages = {
    system?: string
    messages: AnthropicConversationMessage[]
}

export function mapMessagesToAnthropic(messages: ChatMessage[]): AnthropicMappedMessages {
    const systemParts: string[] = []
    const conversation: AnthropicConversationMessage[] = []

    for (const message of messages) {
        if (message.role === 'developer' || message.role === 'system') {
            systemParts.push(message.content)
            continue
        }

        const role = message.role
        const lastMessage = conversation[conversation.length - 1]

        if (lastMessage && lastMessage.role === role) {
            lastMessage.content = `${lastMessage.content}\n\n${message.content}`
            continue
        }

        conversation.push({
            role,
            content: message.content,
        })
    }

    if (conversation.length === 0) {
        conversation.push({ role: 'user', content: ' ' })
    } else if (conversation[0].role === 'assistant') {
        conversation.unshift({ role: 'user', content: ' ' })
    }

    return {
        system: systemParts.length > 0 ? systemParts.join('\n\n') : undefined,
        messages: conversation,
    }
}
