import { Status } from '@/components/Status'
import { useAppStatus } from '@/components/Status/Status.hooks'
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
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background pl-4 pr-6 text-foreground">
            <AppStatusBar />

            <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-4 pt-4">
                <Navigator />
            </div>
        </div>
    )
}
