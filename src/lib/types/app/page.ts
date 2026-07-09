import { z } from 'zod'

export const appPageTypeSchema = z.enum([
    'unknown',
    'external',
    'hh-home',
    'hh-resume',
    'hh-vacancy',
    'hh-other',
])
export type AppPageType = z.infer<typeof appPageTypeSchema>

export const appPageInfoSchema = z.object({
    type: appPageTypeSchema,
    url: z.string(),
    title: z.string(),
    checkedAt: z.string(),
})
export type AppPageInfo = z.infer<typeof appPageInfoSchema>
