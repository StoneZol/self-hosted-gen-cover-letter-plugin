import { z } from 'zod'

export const quickChatConfigSchema = z.object({
    systemPrompt: z.string(),
})
export type QuickChatConfig = z.infer<typeof quickChatConfigSchema>
