import type { FormEvent, KeyboardEvent } from 'react'
import { useQuickChat } from '@/sidepanel/useQuickChat'
import { cn } from '@/lib/helpers/cn'

type QuickChatBlockProps = {
    variant?: 'embedded' | 'page'
}

function splitIntoParagraphs(text: string): string[] {
    const paragraphs = text
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)

    if (paragraphs.length > 0) {
        return paragraphs
    }

    return text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
}

export function QuickChatBlock({ variant = 'embedded' }: QuickChatBlockProps) {
    const { messages, draft, isLoading, setDraft, sendMessage, clearChat } = useQuickChat()
    const isPage = variant === 'page'

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

    const content = (
        <>
            {isPage ? (
                <div className="flex items-center justify-between gap-3">
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
            ) : null}

            {messages.length > 0 ? (
                <div
                    className={cn(
                        'flex flex-col gap-3',
                        isPage ? 'min-h-0 flex-1 overflow-y-auto pr-1' : 'mt-4',
                    )}
                >
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
                                <div className="mt-2 flex flex-col gap-2">
                                    {splitIntoParagraphs(message.content).map((paragraph, index) => (
                                        <p
                                            key={`${message.id}-${index}`}
                                            className="text-sm text-foreground whitespace-pre-wrap"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : isPage ? (
                <p className="text-sm text-muted-foreground">
                    Пока сообщений нет. Напишите запрос ниже.
                </p>
            ) : null}

            {isLoading ? <p className="text-sm text-muted-foreground">Думаю...</p> : null}

            <form
                onSubmit={handleSubmit}
                className={cn('flex flex-col gap-3', isPage ? 'shrink-0' : 'mt-4')}
            >
                <textarea
                    value={draft}
                    rows={isPage ? 4 : 3}
                    placeholder="Например: напиши regex для страниц резюме на superjob.ru"
                    disabled={isLoading}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-20 resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                    type="submit"
                    disabled={isLoading || !draft.trim()}
                    className="rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? 'Отправляю...' : 'Отправить'}
                </button>
            </form>
        </>
    )

    if (isPage) {
        return (
            <div className="flex min-h-[calc(100vh-8.5rem)] flex-col gap-4 rounded-xl border border-border bg-card p-4">
                {content}
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
                Задайте вопрос LLM прямо здесь — например, попросите regex для новой платформы или подсказку по
                селекторам.
            </p>

            {content}
        </section>
    )
}
