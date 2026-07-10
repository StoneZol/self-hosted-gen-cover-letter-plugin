import { ChevronDown, ExternalLink, Trash2 } from 'lucide-react'
import { useResumes } from '@/sidepanel/useResumes'

type ResumePickerProps = {
    action: 'open' | 'delete'
    onOpen?: () => void
}

export function ResumePicker({ action, onOpen }: ResumePickerProps) {
    const {
        resumes,
        selectedResumeId,
        selectedResume,
        isLoading,
        setSelectedResumeId,
        deleteResume,
    } = useResumes()

    const hasResumes = resumes.length > 0

    if (isLoading || !hasResumes) {
        return null
    }

    const isActionDisabled = !selectedResumeId

    async function handleAction() {
        if (!selectedResumeId) {
            return
        }

        if (action === 'open') {
            onOpen?.()
            return
        }

        await deleteResume(selectedResumeId)
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
                <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-foreground">Выберите резюме</span>

                    <div className="relative">
                        <div
                            aria-hidden
                            className="pointer-events-none min-h-11 rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm leading-snug text-foreground break-words whitespace-normal"
                        >
                            {selectedResume?.title ?? 'Нет сохранённых резюме'}
                        </div>

                        <ChevronDown
                            aria-hidden
                            className="pointer-events-none absolute top-3 right-3 h-4 w-4 text-muted-foreground"
                        />

                        <select
                            value={selectedResumeId ?? ''}
                            onChange={(event) => void setSelectedResumeId(event.target.value)}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 [color-scheme:light]"
                        >
                            {resumes.map((resume) => (
                                <option key={resume.id} value={resume.id} className="text-black">
                                    {resume.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </label>

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
