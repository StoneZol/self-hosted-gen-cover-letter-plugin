import { ScreenHeader } from '../../ScreenHeader'
import { QuickChatBlock } from '../../QuickChatBlock'

export const ChatScreen = () => {
    return (
        <div className="flex min-h-0 flex-col gap-4">
            <ScreenHeader title="Быстрый чат" showBack />
            <QuickChatBlock variant="page" />
        </div>
    )
}
