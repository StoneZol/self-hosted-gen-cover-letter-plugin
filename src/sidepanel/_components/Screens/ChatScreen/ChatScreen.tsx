import { ScreenHeader } from '../../ScreenHeader'
import { QuickChatBlock } from '../../QuickChatBlock'

export const ChatScreen = () => {
    return (
        <>
            <ScreenHeader title="Быстрый чат" className="mb-0 shrink-0" />
            <QuickChatBlock variant="page" />
        </>
    )
}
