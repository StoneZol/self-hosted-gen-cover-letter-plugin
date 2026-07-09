import { z } from 'zod'

const optionalString = z.preprocess((value) => {
    if (value === null || value === undefined) {
        return undefined
    }

    if (typeof value === 'string' && value.trim() === '') {
        return undefined
    }

    return value
}, z.string().optional())

export const resumeSchema = z.object({
    id: z.string(),
    title: z.string(),
    source: z.string(),
    language: z.string(),
    selfAbout: optionalString,
    experience: z.array(
        z.object({
            company: z.string(),
            position: z.string(),
            description: z.string(),
            startDate: z.string(),
            endDate: z.string(),
        }),
    ),
    education: z.array(
        z.object({
            organization: z.string(),
            degree: z.string(),
            speciality: z.string(),
        }),
    ),
    skills: z.array(z.string()),
    projects: z.array(
        z.object({
            name: z.string(),
            description: z.string(),
            link: optionalString,
        }),
    ),
    certifications: z.array(
        z.object({
            name: z.string(),
            description: z.string(),
        }),
    ),
})
export type Resume = z.infer<typeof resumeSchema>

export type ResumeSelectionState = {
    resumes: Resume[]
    selectedResumeId: string | null
    selectedResume: Resume | null
}