import useScreenStore from '@/sidepanel/store'
import { DebugCurrentPage } from '@/components/DebugCurrentPage'
import { ChatScreen } from '../Screens/ChatScreen'
import { GuideScreen } from '../Screens/GuideScreen'
import { MainScreen } from '../Screens/MainScreen'
import { ResumeScreen } from '../Screens/ResumeScreen/ResumeScreen'
import { SettingsScreen } from '../Screens/SettingsScreen/SettingsScreen'

const Navigator = () => {
    const screen = useScreenStore((state) => state.screen)

    switch (screen) {
        case 'settings':
            return (
                <>
                    <SettingsScreen />
                    <DebugCurrentPage />
                </>
            )
        case 'resume':
            return (
                <>
                    <ResumeScreen />
                    <DebugCurrentPage />
                </>
            )
        case 'guide':
            return (
                <>
                    <GuideScreen />
                    <DebugCurrentPage />
                </>
            )
        case 'chat':
            return <ChatScreen />
        case 'main':
        default:
            return (
                <>
                    <MainScreen />
                    <DebugCurrentPage />
                </>
            )
    }
}

export default Navigator
