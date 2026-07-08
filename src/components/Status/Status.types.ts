import type { StatusType } from '@/lib/types/app/status'

export type StatusProps = {
    message?: string
    type?: StatusType
    title?: string
    className?: string
}
