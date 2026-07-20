import { useCallback } from 'react'
import { extractAssistantText, generateChatCompletion } from '@/lib/api/llm/client'
import { loadQuickChatConfig } from '@/lib/configs/quickChat/storage'
import { loadLlmConfig } from '@/lib/configs/llm/storage'
import type { ChatMessage } from '@/lib/types/llm/types'
import useQuickChatStore from './quickChatStore'

function createMessageId(): string {
    return crypto.randomUUID()
}

export function useQuickChat() {
    const messages = useQuickChatStore((state) => state.messages)
    const draft = useQuickChatStore((state) => state.draft)
    const isLoading = useQuickChatStore((state) => state.isLoading)
    const setDraft = useQuickChatStore((state) => state.setDraft)
    const addMessage = useQuickChatStore((state) => state.addMessage)
    const setIsLoading = useQuickChatStore((state) => state.setIsLoading)
    const clearChat = useQuickChatStore((state) => state.clearChat)

    const sendMessage = useCallback(async () => {
        const trimmedDraft = useQuickChatStore.getState().draft.trim()

        if (!trimmedDraft || useQuickChatStore.getState().isLoading) {
            return
        }

        const [config, quickChatConfig] = await Promise.all([loadLlmConfig(), loadQuickChatConfig()])
        const maxMessages = quickChatConfig.maxMessages

        const userMessage = {
            id: createMessageId(),
            role: 'user' as const,
            content: trimmedDraft,
        }

        addMessage(userMessage, maxMessages)
        setDraft('')
        setIsLoading(true)

        try {
            const history = useQuickChatStore.getState().messages
            const chatMessages: ChatMessage[] = [
                { role: 'system', content: quickChatConfig.systemPrompt },
                ...history.map((message) => ({
                    role: message.role,
                    content: message.content,
                })),
            ]

            const response = await generateChatCompletion(config, chatMessages)
            const assistantText = extractAssistantText(response)

            addMessage(
                {
                    id: createMessageId(),
                    role: 'assistant',
                    content: assistantText || 'Модель вернула пустой ответ.',
                },
                maxMessages,
            )
        } catch (error: unknown) {
            addMessage(
                {
                    id: createMessageId(),
                    role: 'assistant',
                    content:
                        error instanceof Error
                            ? `Ошибка: ${error.message}`
                            : 'Не удалось получить ответ от LLM.',
                },
                maxMessages,
            )
        } finally {
            setIsLoading(false)
        }
    }, [addMessage, setDraft, setIsLoading])

    return {
        messages,
        draft,
        isLoading,
        setDraft,
        sendMessage,
        clearChat,
    }
}
