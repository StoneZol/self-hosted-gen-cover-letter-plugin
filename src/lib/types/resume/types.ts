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

function defaultArray<T extends z.ZodTypeAny>(itemSchema: T) {
    return z.preprocess(
        (value) => (Array.isArray(value) ? value : []),
        z.array(itemSchema),
    )
}

export const resumeSchema = z.object({
    id: z.string(),
    title: z.string(),
    source: z.string(),
    language: z.string(),
    selfAbout: optionalString,
    experience: defaultArray(
        z.object({
            company: z.string(),
            position: z.string(),
            description: z.string(),
            startDate: z.string(),
            endDate: z.string(),
        }),
    ),
    education: defaultArray(
        z.object({
            organization: z.string(),
            degree: z.string(),
            speciality: z.string(),
        }),
    ),
    skills: defaultArray(z.string()),
    projects: defaultArray(
        z.object({
            name: z.string(),
            description: z.string(),
            link: optionalString,
        }),
    ),
    certifications: defaultArray(
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