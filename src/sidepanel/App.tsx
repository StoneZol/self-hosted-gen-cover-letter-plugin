import { Status } from '@/components/Status'
import { useAppStatus } from '@/components/Status/Status.hooks'
import { cn } from '@/lib/helpers/cn'
// import useScreenStore from '@/sidepanel/store'
import { Navigator } from './_components/Navigator'

function AppStatusBar() {
    const { status } = useAppStatus()

    if (!status.message) {
        return null
    }

    return (
        <div className="shrink-0 border-b border-border bg-background py-3">
            <Status className="rounded-lg p-3" />
        </div>
    )
}

export default function App() {
    // const isChatScreen = useScreenStore((state) => state.screen === 'chat')

    return (
        <div
            className={cn(
                'flex flex-col bg-background pl-4 pr-6 text-foreground',
                'min-h-screen',
            )}
        >
            <AppStatusBar />

            <div
                className={cn(
                    'min-w-[320px] pt-4 pb-4',
                )}
            >
                <Navigator />
            </div>
        </div>
    )
}
