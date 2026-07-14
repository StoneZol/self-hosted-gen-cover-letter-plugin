import { useCallback } from 'react'
import { extractAssistantText, generateChatCompletion } from '@/lib/api/llm/openaiCompatible'
import { loadLlmConfig } from '@/lib/configs/llm/storage'
import type { ChatMessage } from '@/lib/types/llm/types'
import useQuickChatStore from './quickChatStore'

const QUICK_CHAT_SYSTEM_PROMPT = ``

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

        const userMessage = {
            id: createMessageId(),
            role: 'user' as const,
            content: trimmedDraft,
        }

        addMessage(userMessage)
        setDraft('')
        setIsLoading(true)

        try {
            const config = await loadLlmConfig()
            const history = useQuickChatStore.getState().messages
            const chatMessages: ChatMessage[] = [
                { role: 'system', content: QUICK_CHAT_SYSTEM_PROMPT },
                ...history.map((message) => ({
                    role: message.role,
                    content: message.content,
                })),
            ]

            const response = await generateChatCompletion(config, chatMessages)
            const assistantText = extractAssistantText(response)

            addMessage({
                id: createMessageId(),
                role: 'assistant',
                content: assistantText || 'Модель вернула пустой ответ.',
            })
        } catch (error: unknown) {
            addMessage({
                id: createMessageId(),
                role: 'assistant',
                content:
                    error instanceof Error
                        ? `Ошибка: ${error.message}`
                        : 'Не удалось получить ответ от LLM.',
            })
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
