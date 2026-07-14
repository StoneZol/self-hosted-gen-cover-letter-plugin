import useScreenStore from '@/sidepanel/store'
import { LastVacancyBlock } from '../../LastVacancyBlock'
import { ResumePicker } from '../../ResumePicker'
import { ScreenHeader } from '../../ScreenHeader'

export const MainScreen = () => {
    const setScreen = useScreenStore((state) => state.setScreen)

    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Главная" />

            <section className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                    Настройте LLM, сохраните резюме на hh и генерируйте сопроводительные на вакансиях.
                </p>
            </section>

            <ResumePicker action="open" onOpen={() => setScreen('resume')} />

            <LastVacancyBlock />
        </div>
    )
}
