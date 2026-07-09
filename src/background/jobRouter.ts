import { loadResumeParseJob, RESUME_PARSE_JOB_STORAGE_KEY } from '@/lib/configs/jobs/resumeParseJobStorage'
import { processResumeParseJob } from '@/lib/resume/processResumeParseJob'
import type { ResumeParseJob } from '@/lib/types/jobs/resumeParseJob'

type ExtensionJobHandler<TJob> = (job: TJob | null | undefined) => Promise<void>

type RegisteredExtensionJob = {
    storageKey: string
    handle: ExtensionJobHandler<ResumeParseJob>
}

let isResumeParseProcessing = false

async function handleResumeParseJob(job: ResumeParseJob | null | undefined): Promise<void> {
    if (!job || job.status !== 'pending' || isResumeParseProcessing) {
        return
    }

    isResumeParseProcessing = true

    try {
        await processResumeParseJob(job)
    } finally {
        isResumeParseProcessing = false
    }
}

const extensionJobs: RegisteredExtensionJob[] = [
    {
        storageKey: RESUME_PARSE_JOB_STORAGE_KEY,
        handle: handleResumeParseJob,
    },
]

export function startExtensionJobRouter(): void {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'local') {
            return
        }

        for (const jobRegistration of extensionJobs) {
            if (!changes[jobRegistration.storageKey]) {
                continue
            }

            void jobRegistration.handle(
                changes[jobRegistration.storageKey].newValue as ResumeParseJob | undefined,
            )
        }
    })

    void loadResumeParseJob().then((job) => handleResumeParseJob(job))
}
