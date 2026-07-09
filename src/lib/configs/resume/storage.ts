import type { Resume, ResumeSelectionState } from '@/lib/types/resume/types'

export const DEFAULT_RESUMES: Resume[] = [
    {
        id: 'resume-1',
        title: 'Frontend-разработчик React/Next/TS',
        source: 'HeadHunter',
        language: 'Русский',
        selfAbout: 'Frontend-разработчик с 3+ годами коммерческого опыта в продуктовых командах.',
        experience: [
            {
                company: 'ODAA Studio',
                position: 'Frontend-разработчик',
                description: '',
                startDate: '2022',
                endDate: '2024',
            },
            {
                company: 'Your CodeReview',
                position: 'Frontend-разработчик',
                description: '',
                startDate: '2021',
                endDate: '2022',
            },
            {
                company: 'NAOHASA',
                position: 'Frontend-разработчик',
                description: '',
                startDate: '2020',
                endDate: '2021',
            },
        ],
        education: [],
        skills: ['TypeScript', 'React', 'Next.js', 'Zustand', 'FSD'],
        projects: [],
        certifications: [],
    },
    {
        id: 'resume-2',
        title: 'Fullstack-разработчик',
        source: 'HeadHunter',
        language: 'Русский',
        selfAbout: 'Опыт в web-разработке, backend и frontend.',
        experience: [
            {
                company: 'Пример компании A',
                position: 'Fullstack-разработчик',
                description: '',
                startDate: '2021',
                endDate: '2023',
            },
            {
                company: 'Пример компании B',
                position: 'Fullstack-разработчик',
                description: '',
                startDate: '2019',
                endDate: '2021',
            },
        ],
        education: [],
        skills: ['TypeScript', 'Node.js', 'PostgreSQL'],
        projects: [],
        certifications: [],
    },
]

const RESUMES_STORAGE_KEY = 'resumes'
const SELECTED_RESUME_ID_STORAGE_KEY = 'selectedResumeId'

export async function loadResumes(): Promise<Resume[]> {
    const result = await chrome.storage.local.get(RESUMES_STORAGE_KEY)
    const storedResumes = result[RESUMES_STORAGE_KEY] as Resume[] | undefined

    return storedResumes ?? []
}

export async function findResumeById(resumeId: string): Promise<Resume | null> {
    const resumes = await loadResumes()

    return resumes.find((resume) => resume.id === resumeId) ?? null
}

export async function upsertResume(resume: Resume): Promise<{ isUpdate: boolean }> {
    const resumes = await loadResumes()
    const existingIndex = resumes.findIndex((storedResume) => storedResume.id === resume.id)
    const isUpdate = existingIndex >= 0
    const nextResumes = isUpdate
        ? resumes.map((storedResume, index) => (index === existingIndex ? resume : storedResume))
        : [...resumes, resume]

    await saveResumes(nextResumes)
    await saveSelectedResumeId(resume.id)

    return { isUpdate }
}

export async function saveResumes(resumes: Resume[]): Promise<void> {
    await chrome.storage.local.set({
        [RESUMES_STORAGE_KEY]: resumes,
    })
}

export async function loadSelectedResumeId(): Promise<string | null> {
    const result = await chrome.storage.local.get(SELECTED_RESUME_ID_STORAGE_KEY)
    const storedSelectedId = result[SELECTED_RESUME_ID_STORAGE_KEY] as string | null | undefined

    if (storedSelectedId) {
        return storedSelectedId
    }

    const resumes = await loadResumes()

    return resumes[0]?.id ?? null
}

export async function saveSelectedResumeId(selectedResumeId: string | null): Promise<void> {
    await chrome.storage.local.set({
        [SELECTED_RESUME_ID_STORAGE_KEY]: selectedResumeId,
    })
}

export async function loadResumeSelectionState(): Promise<ResumeSelectionState> {
    const resumes = await loadResumes()
    const selectedResumeId = await loadSelectedResumeId()
    const selectedResume = resumes.find((resume) => resume.id === selectedResumeId) ?? null

    return {
        resumes,
        selectedResumeId,
        selectedResume,
    }
}

export async function getSelectedResumeForGeneration(): Promise<Resume | null> {
    const { selectedResume } = await loadResumeSelectionState()

    return selectedResume
}

export { RESUMES_STORAGE_KEY, SELECTED_RESUME_ID_STORAGE_KEY }
