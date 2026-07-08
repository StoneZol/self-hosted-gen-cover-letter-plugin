import { z } from 'zod'

export const statusTypeSchema = z.enum(['info', 'success', 'error', 'loading'])
export type StatusType = z.infer<typeof statusTypeSchema>

export const appStatusSchema = z.object({
    message: z.string(),
    type: statusTypeSchema,
})
export type AppStatus = z.infer<typeof appStatusSchema>
