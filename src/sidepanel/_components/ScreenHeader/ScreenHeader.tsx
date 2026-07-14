import { ArrowLeft, BookOpen, MessageSquare, Settings } from 'lucide-react'
import useScreenStore from '@/sidepanel/store'
import { cn } from '@/lib/helpers/cn'

type ScreenHeaderProps = {
    title: string
    showBack?: boolean
    showSettings?: boolean
    showGuide?: boolean
    className?: string
}

const ScreenHeader = ({
    title,
    showBack = false,
    showSettings = false,
    showGuide = false,
    className,
}: ScreenHeaderProps) => {
    const screen = useScreenStore((state) => state.screen)
    const setScreen = useScreenStore((state) => state.setScreen)
    const showChatButton = screen !== 'chat'

    return (
        <header
            className={cn(
                'sticky top-0 z-10 mb-4 flex min-w-0 items-center justify-between gap-3 border-b border-border bg-background/95 py-3 pr-1 backdrop-blur supports-backdrop-filter:bg-background/80',
                className,
            )}
        >
            <div className="flex min-w-0 flex-1 items-center gap-2">
                {showBack ? (
                    <button
                        type="button"
                        onClick={() => setScreen('main')}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
                        aria-label="Назад"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                ) : (
                    <div className="h-9 w-9 shrink-0" />
                )}

                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">HH Free Cheat</p>
                    <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                {showChatButton ? (
                    <button
                        type="button"
                        onClick={() => setScreen('chat')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        aria-label="Быстрый чат"
                    >
                        <MessageSquare className="h-4 w-4" />
                    </button>
                ) : null}

                {showGuide ? (
                    <button
                        type="button"
                        onClick={() => setScreen('guide')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        aria-label="Гайд"
                    >
                        <BookOpen className="h-4 w-4" />
                    </button>
                ) : null}

                {showSettings ? (
                    <button
                        type="button"
                        onClick={() => setScreen('settings')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        aria-label="Настройки"
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                ) : (
                    !showGuide && !showChatButton ? <div className="h-9 w-9 shrink-0" /> : null
                )}
            </div>
        </header>
    )
}

export default ScreenHeader
