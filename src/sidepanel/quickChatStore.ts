import { create } from 'zustand'

export type QuickChatMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
}

type QuickChatState = {
    messages: QuickChatMessage[]
    draft: string
    isLoading: boolean
    setDraft: (draft: string) => void
    addMessage: (message: QuickChatMessage) => void
    setIsLoading: (isLoading: boolean) => void
    clearChat: () => void
}

const useQuickChatStore = create<QuickChatState>((set) => ({
    messages: [],
    draft: '',
    isLoading: false,
    setDraft: (draft) => set({ draft }),
    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),
    setIsLoading: (isLoading) => set({ isLoading }),
    clearChat: () => set({ messages: [], draft: '', isLoading: false }),
}))

export default useQuickChatStore
