import { z } from 'zod'

export const coverLetterConfigSchema = z.object({
    basePrompt: z.string(),
    letterSignature: z.string(),
})
export type CoverLetterConfig = z.infer<typeof coverLetterConfigSchema>
