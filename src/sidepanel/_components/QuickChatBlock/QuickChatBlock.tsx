import { useEffect, useLayoutEffect, useRef } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useQuickChat } from '@/sidepanel/useQuickChat'
import { cn } from '@/lib/helpers/cn'
import { QuickChatMarkdown } from './QuickChatMarkdown'

type QuickChatBlockProps = {
    variant?: 'embedded' | 'page'
}

export function QuickChatBlock({ variant = 'embedded' }: QuickChatBlockProps) {
    const { messages, draft, isLoading, setDraft, sendMessage, clearChat } = useQuickChat()
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const isPage = variant === 'page'

    function scrollChatToBottom(behavior: ScrollBehavior = 'smooth') {
        messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' })
        document.documentElement.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior,
        })
    }

    useLayoutEffect(() => {
        if (!isPage) {
            return
        }

        scrollChatToBottom('auto')
    }, [isPage, messages])

    useEffect(() => {
        if (!isPage) {
            return
        }

        const frameId = requestAnimationFrame(() => {
            scrollChatToBottom('smooth')

            requestAnimationFrame(() => {
                scrollChatToBottom('auto')
            })
        })

        return () => cancelAnimationFrame(frameId)
    }, [isPage, messages, isLoading])

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

    const messagesList =
        messages.length > 0 ? (
            <div className={cn('flex flex-col gap-3', !isPage && 'mt-4')}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            'rounded-lg border px-3 py-2',
                            message.role === 'user'
                                ? 'border-primary/30 bg-primary/10'
                                : 'border-border bg-background',
                        )}
                    >
                        <p className="text-xs font-medium text-muted-foreground">
                            {message.role === 'user' ? 'Вы' : 'Ответ'}
                        </p>

                        {message.role === 'user' ? (
                            <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
                        ) : (
                            <div className="mt-2">
                                <QuickChatMarkdown content={message.content} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ) : isPage ? (
            <p className="text-sm text-muted-foreground">Пока сообщений нет. Напишите запрос ниже.</p>
        ) : null

    const inputForm = (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <textarea
                value={draft}
                rows={3}
                placeholder="Например: напиши regex для страниц резюме на superjob.ru"
                disabled={isLoading}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-20 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
                type="submit"
                disabled={isLoading || !draft.trim()}
                className="rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isLoading ? 'Отправляю...' : 'Отправить'}
            </button>
        </form>
    )

    if (isPage) {
        return (
            <div className="flex-1 mb-44 pr-1">
                <div className="flex items-start justify-between gap-3 pb-4">
                    <p className="text-sm text-muted-foreground">
                        Задайте вопрос LLM — например, попросите regex для новой платформы или подсказку по
                        селекторам.
                    </p>

                    {messages.length > 0 ? (
                        <button
                            type="button"
                            onClick={clearChat}
                            disabled={isLoading}
                            className="shrink-0 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Очистить
                        </button>
                    ) : null}
                </div>

                {messagesList}

                {isLoading ? <p className="mt-3 text-sm text-muted-foreground">Думаю...</p> : null}

                <div ref={messagesEndRef} aria-hidden="true" />
            </div>
        )
    }

    return (
        <section className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-primary">Быстрый чат</h2>

                {messages.length > 0 ? (
                    <button
                        type="button"
                        onClick={clearChat}
                        disabled={isLoading}
                        className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Очистить
                    </button>
                ) : null}
            </div>

            <p className="text-sm text-muted-foreground">
                Задайте вопрос LLM прямо здесь
            </p>

            {messagesList}

            {isLoading ? <p className="text-sm text-muted-foreground">Думаю...</p> : null}

            {inputForm}
        </section>
    )
}
