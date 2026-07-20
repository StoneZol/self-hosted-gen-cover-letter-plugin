import useScreenStore from '@/sidepanel/store'
import { LastVacancyBlock } from '../../LastVacancyBlock'
import { ResumePicker } from '../../ResumePicker'
import { ScreenHeader } from '../../ScreenHeader'

export const MainScreen = () => {
    const setScreen = useScreenStore((state) => state.setScreen)

    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Главная" />

            <ResumePicker action="open" onOpen={() => setScreen('resume')} />

            <LastVacancyBlock />
        </div>
    )
}
