import useScreenStore from '@/sidepanel/store'
import { GuideScreen } from '../Screens/GuideScreen'
import { MainScreen } from '../Screens/MainScreen'
import { ResumeScreen } from '../Screens/ResumeScreen/ResumeScreen'
import { SettingsScreen } from '../Screens/SettingsScreen/SettingsScreen'

const Navigator = () => {
    const screen = useScreenStore((state) => state.screen)

    switch (screen) {
        case 'settings':
            return <SettingsScreen />
        case 'resume':
            return <ResumeScreen />
        case 'guide':
            return <GuideScreen />
        case 'main':
        default:
            return <MainScreen />
    }
}

export default Navigator
