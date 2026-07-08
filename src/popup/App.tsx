import { OpenSidePanel } from '@/components/OpenSidePanel'
import { Status, useAppStatus } from '@/components/Status'

export default function App() {
    const { status } = useAppStatus()

    return (
        <div className="flex flex-col gap-4 p-4 min-w-[320px]">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">HH Free Cheat</p>
            <h1 className="text-lg font-semibold">Quick actions</h1>
            <p className="text-sm text-muted-foreground">
                Open the main extension interface in the side panel and keep working next to the vacancy page.
            </p>

            <OpenSidePanel />
            <Status message={status.message} type={status.type} />
        </div>
    )
}
