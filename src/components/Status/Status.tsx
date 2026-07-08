import { cn } from '@/lib/helpers/cn'
import type { StatusType } from '@/lib/types/app/status'
import type { StatusProps } from './Status.types'
import { useAppStatus } from './Status.hooks'

const statusVariantClasses: Record<StatusType, string> = {
    info: 'border-border bg-card text-card-foreground',
    success: 'border-primary/40 bg-primary/10 text-foreground',
    error: 'border-destructive/40 bg-destructive/10 text-foreground',
    loading: 'border-border bg-muted text-muted-foreground',
}

const Status = ({
    className,
}: StatusProps) => {

    const { status } = useAppStatus()
    if (!status.message) {
        return null
    }

    return (
        <section className={cn('rounded-xl border p-4', statusVariantClasses[status.type], className)}>
            {/* <h2 className="mb-2 text-sm font-semibold">{status.title}</h2> */}
            <p className="text-sm whitespace-pre-wrap">{status.message}</p>
        </section>
    )
}

export default Status
