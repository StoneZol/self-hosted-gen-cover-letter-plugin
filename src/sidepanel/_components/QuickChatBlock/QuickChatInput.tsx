import { useEffect, useRef } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useQuickChat } from '@/sidepanel/useQuickChat'

export function QuickChatInput() {
    const { draft, isLoading, setDraft, sendMessage } = useQuickChat()
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        textareaRef.current?.focus()
    }, [])

    useEffect(() => {
        if (isLoading) {
            return
        }

        const frameId = requestAnimationFrame(() => {
            textareaRef.current?.focus()
        })

        return () => cancelAnimationFrame(frameId)
    }, [isLoading])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        await sendMessage()
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            void sendMessage()
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0">
            <div className="m-2 border-t border-border bg-background pt-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <textarea
                        ref={textareaRef}
                        value={draft}
                        rows={3}
                        placeholder="Например: напиши regex для страниц резюме на superjob.ru"
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="min-h-20 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !draft.trim()}
                        className="rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    )
}
