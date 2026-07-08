import { ArrowLeft, Settings } from 'lucide-react'
import useScreenStore from '@/sidepanel/store'
import { cn } from '@/lib/helpers/cn'

type ScreenHeaderProps = {
    title: string
    showBack?: boolean
    showSettings?: boolean
    className?: string
}

const ScreenHeader = ({
    title,
    showBack = false,
    showSettings = false,
    className,
}: ScreenHeaderProps) => {
    const setScreen = useScreenStore((state) => state.setScreen)

    return (
        <header className={cn('mb-4 flex items-center justify-between gap-3', className)}>
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

            {showSettings ? (
                <button
                    type="button"
                    onClick={() => setScreen('settings')}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    aria-label="Настройки"
                >
                    <Settings className="h-4 w-4" />
                </button>
            ) : (
                <div className="h-9 w-9 shrink-0" />
            )}
        </header>
    )
}

export default ScreenHeader
