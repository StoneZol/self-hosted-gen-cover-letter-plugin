import type { ExtensionJobTimestamps } from '@/lib/types/jobs/types'
import type { Resume } from '@/lib/types/resume/types'

export type ResumeParseJob = ExtensionJobTimestamps & {
    sourceUrl: string
    rawResumeText: string
    result?: {
        resume: Resume
        isUpdate: boolean
    }
    error?: string
}
