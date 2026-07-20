import disclaimerMarkdown from '@/lib/license/disclaimerMarkdown'
import { QuickChatMarkdown } from '../../QuickChatBlock/QuickChatMarkdown'
import { ScreenHeader } from '../../ScreenHeader'

export const DisclaimerScreen = () => {
    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Отказ от ответственности" />

            <section className="rounded-xl border border-border bg-card p-4">
                <QuickChatMarkdown content={disclaimerMarkdown} />
            </section>
        </div>
    )
}
