import { ExternalLink, Trash2 } from 'lucide-react'
import { Select } from '@/components/Select'
import { useResumePicker, type ResumePickerAction } from './ResumePicker.hooks'

type ResumePickerProps = {
    action: ResumePickerAction
    onOpen?: () => void
}

export function ResumePicker({ action, onOpen }: ResumePickerProps) {
    const {
        isLoading,
        hasResumes,
        options,
        selectedResumeId,
        isActionDisabled,
        setSelectedResumeId,
        handleAction,
    } = useResumePicker({ action, onOpen })

    if (isLoading || !hasResumes) {
        return null
    }

    return (
        <section className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3">
                <h2 className="text-sm font-semibold text-foreground">Резюме для генерации</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Выбранное резюме используется при генерации сопроводительного письма.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <Select
                    label="Выберите резюме"
                    value={selectedResumeId}
                    options={options}
                    placeholder="Нет сохранённых резюме"
                    onChange={(value) => void setSelectedResumeId(value)}
                />

                <button
                    type="button"
                    onClick={() => void handleAction()}
                    disabled={isActionDisabled}
                    className={
                        action === 'delete'
                            ? 'inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60'
                            : 'inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60'
                    }
                >
                    {action === 'open' ? (
                        <>
                            <ExternalLink className="h-4 w-4" />
                            Открыть
                        </>
                    ) : (
                        <>
                            <Trash2 className="h-4 w-4" />
                            Удалить
                        </>
                    )}
                </button>
            </div>
        </section>
    )
}
