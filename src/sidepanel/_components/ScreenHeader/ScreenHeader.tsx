import { ArrowLeft, BookOpen, MessageSquare, Settings } from 'lucide-react'
import { APP_DISPLAY_NAME } from '@/lib/constants/appName'
import useScreenStore from '@/sidepanel/store'
import { cn } from '@/lib/helpers/cn'

type ScreenHeaderProps = {
    title: string
    className?: string
}

const ScreenHeader = ({ title, className }: ScreenHeaderProps) => {
    const screen = useScreenStore((state) => state.screen)
    const setScreen = useScreenStore((state) => state.setScreen)

    const showBack = screen !== 'main'
    const showChatButton = screen !== 'chat'
    const showGuideButton = screen !== 'guide'
    const showSettingsButton = screen !== 'settings'

    return (
        <header
            className={cn(
                'sticky top-0 z-10 mb-4 flex min-w-0 items-center justify-between gap-3 border-b border-border bg-background/95 py-2 pr-1 backdrop-blur supports-backdrop-filter:bg-background/80',
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
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{APP_DISPLAY_NAME}</p>
                    <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                {showChatButton ? (
                    <button
                        type="button"
                        title="Быстрый чат с LLM"
                        aria-label="Быстрый чат с LLM"
                        onClick={() => setScreen('chat')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                        <MessageSquare className="h-4 w-4" />
                    </button>
                ) : null}

                {showGuideButton ? (
                    <button
                        type="button"
                        title="Гайд по использованию"
                        aria-label="Гайд по использованию"
                        onClick={() => setScreen('guide')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                        <BookOpen className="h-4 w-4" />
                    </button>
                ) : null}

                {showSettingsButton ? (
                    <button
                        type="button"
                        title="Настройки расширения"
                        aria-label="Настройки расширения"
                        onClick={() => setScreen('settings')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                ) : null}
            </div>
        </header>
    )
}

export default ScreenHeader
