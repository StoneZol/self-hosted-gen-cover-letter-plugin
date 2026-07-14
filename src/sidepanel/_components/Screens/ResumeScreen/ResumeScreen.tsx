import { ResumePicker } from '../../ResumePicker'
import { ScreenHeader } from '../../ScreenHeader'
import { formatResumeDisplayTitle } from '@/lib/resume/formatResumeDisplayTitle'
import { useResumes } from '@/sidepanel/useResumes'

export const ResumeScreen = () => {
    const { resumes, selectedResume, isLoading } = useResumes()
    const hasResumes = resumes.length > 0

    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Резюме" />

            {hasResumes ? <ResumePicker action="delete" /> : null}

            {isLoading ? (
                <section className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                    Загружаю резюме...
                </section>
            ) : selectedResume ? (
                <div className="flex flex-col gap-3">
                    <section className="rounded-xl border border-border bg-card p-4">
                        <h2 className="text-base font-semibold text-foreground">
                            {formatResumeDisplayTitle(selectedResume)}
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Язык: {selectedResume.language}
                        </p>
                    </section>

                    {selectedResume.selfAbout ? (
                        <section className="rounded-xl border border-border bg-card p-4">
                            <h3 className="text-sm font-semibold text-foreground">О себе</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{selectedResume.selfAbout}</p>
                        </section>
                    ) : null}

                    {selectedResume.skills.length > 0 ? (
                        <section className="rounded-xl border border-border bg-card p-4">
                            <h3 className="text-sm font-semibold text-foreground">Навыки</h3>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {selectedResume.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {selectedResume.experience.length > 0 ? (
                        <section className="rounded-xl border border-border bg-card p-4">
                            <h3 className="text-sm font-semibold text-foreground">Опыт</h3>
                            <div className="mt-3 flex flex-col gap-3">
                                {selectedResume.experience.map((experience) => (
                                    <div key={`${experience.company}-${experience.position}`}>
                                        <p className="text-sm font-medium text-foreground">
                                            {experience.position} · {experience.company}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {experience.startDate} — {experience.endDate}
                                        </p>
                                        {experience.description ? (
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {experience.description}
                                            </p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </div>
            ) : (
                <section className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                    Нет сохранённых резюме. Откройте резюме на hh и сохраните его кнопкой на странице.
                </section>
            )}
        </div>
    )
}
