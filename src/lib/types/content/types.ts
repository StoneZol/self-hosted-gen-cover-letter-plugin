import { z } from 'zod'

export const contentConfigSchema = z.object({
    resumePagePattern: z.string(),
    resumeContentSelector: z.string(),
})
export type ContentConfig = z.infer<typeof contentConfigSchema>
