import { z } from 'zod'

export const contentPlatformSchema = z.object({
    id: z.string(),
    title: z.string(),
    enabled: z.boolean(),
    resumePagePatterns: z.array(z.string()),
    resumeContentSelectors: z.array(z.string()),
    vacancyPagePatterns: z.array(z.string()),
    vacancyLetterInputSelectors: z.array(z.string()),
    vacancyLetterInjectSelectors: z.array(z.string()),
})
export type ContentPlatform = z.infer<typeof contentPlatformSchema>

export const contentConfigSchema = z.object({
    platforms: z.array(contentPlatformSchema),
})
export type ContentConfig = z.infer<typeof contentConfigSchema>
