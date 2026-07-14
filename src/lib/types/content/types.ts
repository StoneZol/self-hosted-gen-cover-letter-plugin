import { z } from 'zod'

const nullableString = z.string().nullable()
const nullableStringArray = z.array(z.string()).nullable()

export const contentPlatformSchema = z.object({
    id: nullableString,
    title: nullableString,
    enabled: z.boolean(),
    resumePagePatterns: nullableStringArray,
    resumeContentSelectors: nullableStringArray,
    vacancyPagePatterns: nullableStringArray,
    vacancyParsePagePatterns: nullableStringArray,
    vacancyParseContentSelectors: nullableStringArray,
    vacancyLetterInputSelectors: nullableStringArray,
    vacancyLetterInjectSelectors: nullableStringArray,
})
export type ContentPlatform = z.infer<typeof contentPlatformSchema>

export const contentConfigSchema = z.object({
    platforms: z.array(contentPlatformSchema),
})
export type ContentConfig = z.infer<typeof contentConfigSchema>
