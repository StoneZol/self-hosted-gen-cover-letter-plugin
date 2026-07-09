import { Status } from '@/components/Status'
import { DebugCurrentPage } from '@/components/DebugCurrentPage'
import { Navigator } from './_components/Navigator'

export default function App() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="p-4">
                <Navigator />
                <DebugCurrentPage />
                <div className="mt-4">
                    <Status />
                </div>
            </div>
        </div>
    )
}
