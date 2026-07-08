import { useState } from 'react'
import { ScreenHeader } from '../../ScreenHeader'

const MOCK_RESUMES = [
    {
        id: 'resume-1',
        title: 'Frontend-разработчик React/Next/TS',
        language: 'ru',
        about: 'Frontend-разработчик с 3+ годами коммерческого опыта в продуктовых командах.',
        skills: ['TypeScript', 'React', 'Next.js', 'Zustand', 'FSD'],
        experience: 'ODAA Studio, Your CodeReview, NAOHASA',
    },
    {
        id: 'resume-2',
        title: 'Fullstack-разработчик',
        language: 'ru',
        about: 'Опыт в web-разработке, backend и frontend.',
        skills: ['TypeScript', 'Node.js', 'PostgreSQL'],
        experience: 'Пример компании A, Пример компании B',
    },
]

export const ResumeScreen = () => {
    const [selectedResumeId, setSelectedResumeId] = useState(MOCK_RESUMES[0]?.id ?? '')
    const selectedResume = MOCK_RESUMES.find((resume) => resume.id === selectedResumeId)

    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Резюме" showBack />

            <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-foreground">Выберите резюме</span>
                <select
                    value={selectedResumeId}
                    onChange={(event) => setSelectedResumeId(event.target.value)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                >
                    {MOCK_RESUMES.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                            {resume.title}
                        </option>
                    ))}
                </select>
            </label>

            {selectedResume ? (
                <div className="flex flex-col gap-3">
                    <section className="rounded-xl border border-border bg-card p-4">
                        <h2 className="text-base font-semibold text-foreground">{selectedResume.title}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Язык: {selectedResume.language}</p>
                    </section>

                    <section className="rounded-xl border border-border bg-card p-4">
                        <h3 className="text-sm font-semibold text-foreground">О себе</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{selectedResume.about}</p>
                    </section>

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

                    <section className="rounded-xl border border-border bg-card p-4">
                        <h3 className="text-sm font-semibold text-foreground">Опыт</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{selectedResume.experience}</p>
                    </section>
                </div>
            ) : null}
        </div>
    )
}
