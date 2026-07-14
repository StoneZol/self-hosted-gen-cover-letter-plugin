import { useState } from 'react'

type ConfirmDeleteButtonProps = {
    label: string
    onConfirm: () => void
    confirmLabel?: string
}

export const ConfirmDeleteButton = ({
    label,
    onConfirm,
    confirmLabel = 'Вы уверены?',
}: ConfirmDeleteButtonProps) => {
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

    if (isConfirmationOpen) {
        return (
            <div
                className="flex shrink-0 items-center gap-2"
                onClick={(event) => event.stopPropagation()}
            >
                <span className="text-xs text-muted-foreground">{confirmLabel}</span>
                <button
                    type="button"
                    onClick={() => {
                        onConfirm()
                        setIsConfirmationOpen(false)
                    }}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/15"
                >
                    Да
                </button>
                <button
                    type="button"
                    onClick={() => setIsConfirmationOpen(false)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10"
                >
                    Нет
                </button>
            </div>
        )
    }

    return (
        <button
            type="button"
            onClick={(event) => {
                event.stopPropagation()
                setIsConfirmationOpen(true)
            }}
            className="shrink-0 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/15"
        >
            {label}
        </button>
    )
}
