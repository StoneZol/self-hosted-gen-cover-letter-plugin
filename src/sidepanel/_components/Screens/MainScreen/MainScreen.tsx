import { FileText, Sparkles } from 'lucide-react'
import useScreenStore from '@/sidepanel/store'
import { ScreenHeader } from '../../ScreenHeader'

const MOCK_ACTIVE_RESUME = 'Frontend-разработчик React/Next/TS'

export const MainScreen = () => {
    const setScreen = useScreenStore((state) => state.setScreen)

    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Главная" showSettings />

            <section className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                    <h2 className="text-sm font-semibold">Быстрый старт</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                    Откройте резюме на hh, сохраните его через кнопку на странице и используйте данные для генерации откликов.
                </p>
            </section>

            <button
                type="button"
                onClick={() => setScreen('resume')}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary hover:bg-primary/10"
            >
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">Мои резюме</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {MOCK_ACTIVE_RESUME}
                        </p>
                    </div>
                </div>
                <span className="text-xs font-medium text-primary">Открыть</span>
            </button>

            <section className="rounded-xl border border-dashed border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">
                    Скоро здесь появится парсинг вакансии и генерация сопроводительного письма.
                </p>
            </section>
        </div>
    )
}
