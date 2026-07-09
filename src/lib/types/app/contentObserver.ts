import { z } from 'zod'
import { appPageTypeSchema } from './page'

export const vacancyObserverStatusSchema = z.enum([
    'idle',
    'watching',
    'mounted',
])
export type VacancyObserverStatus = z.infer<typeof vacancyObserverStatusSchema>

export const contentObserverDebugSchema = z.object({
    url: z.string(),
    pageType: appPageTypeSchema,
    vacancy: z.object({
        status: vacancyObserverStatusSchema,
        observerActive: z.boolean(),
        letterInputFound: z.boolean(),
        widgetMounted: z.boolean(),
        message: z.string(),
        updatedAt: z.string(),
    }),
})
export type ContentObserverDebug = z.infer<typeof contentObserverDebugSchema>
