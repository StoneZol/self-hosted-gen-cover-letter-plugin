import { Sparkles } from 'lucide-react'
import useScreenStore from '@/sidepanel/store'
import { ResumePicker } from '../../ResumePicker'
import { ScreenHeader } from '../../ScreenHeader'

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

            <ResumePicker action="open" onOpen={() => setScreen('resume')} />

            <section className="rounded-xl border border-dashed border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">
                    Скоро здесь появится парсинг вакансии и генерация сопроводительного письма.
                </p>
            </section>
        </div>
    )
}
