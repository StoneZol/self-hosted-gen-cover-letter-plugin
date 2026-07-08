import { z } from "zod"

export const resumeSchema = z.object({
    id: z.string(),
    title: z.string(),
    source: z.enum(['hh']),
    language: z.enum(['en', 'ru']),
    selfAbout: z.string().optional(),
    experience: z.array(z.object({
        company: z.string(),
        position: z.string(),
        description: z.string(),
        startDate: z.string(),
        endDate: z.string(),
    })),
    education: z.array(z.object({
        organization: z.string(),
        degree: z.string(),
        speciality: z.string(),
    })),
    skills: z.array(z.string()),
    projects: z.array(z.object({
        name: z.string(),
        description: z.string(),
        link: z.string().optional(),
    })),
    certifications: z.array(z.object({
        name: z.string(),
        description: z.string(),
    })),
})
export type Resume = z.infer<typeof resumeSchema>