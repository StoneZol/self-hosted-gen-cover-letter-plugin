import useScreenStore from '@/sidepanel/store'
import { LastVacancyBlock } from '../../LastVacancyBlock'
import { ResumePicker } from '../../ResumePicker'
import { ScreenHeader } from '../../ScreenHeader'

export const MainScreen = () => {
    const setScreen = useScreenStore((state) => state.setScreen)

    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Главная" />

            <button
                type="button"
                onClick={() => setScreen('disclaimer')}
                className="rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary hover:bg-primary/10"
            >
                <p className="text-sm text-foreground">
                    Используя плагин, вы принимаете условия отказа от ответственности.
                </p>
                <span className="mt-1 inline-block text-xs font-medium text-primary">
                    Открыть полный текст →
                </span>
            </button>

            <ResumePicker action="open" onOpen={() => setScreen('resume')} />

            <LastVacancyBlock />
        </div>
    )
}
