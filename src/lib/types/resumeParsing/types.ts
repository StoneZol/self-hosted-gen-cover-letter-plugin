import { z } from 'zod'

export const resumeParsingConfigSchema = z.object({
    parsingPrompt: z.string(),
})

export type ResumeParsingConfig = z.infer<typeof resumeParsingConfigSchema>
