import type { Resume } from '@/lib/types/resume/types'

export function formatResumeDisplayTitle(resume: Pick<Resume, 'title' | 'source'>): string {
    const source = resume.source.trim()

    if (!source) {
        return resume.title
    }

    return `${resume.title} (${source})`
}
