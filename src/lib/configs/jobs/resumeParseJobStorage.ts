import type { ResumeParseJob } from '@/lib/types/jobs/resumeParseJob'

const STORAGE_KEY = 'resumeParseJob'

type EnqueueResumeParseJobInput = {
    sourceUrl: string
    rawResumeText: string
}

export async function loadResumeParseJob(): Promise<ResumeParseJob | null> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedJob = result[STORAGE_KEY] as ResumeParseJob | undefined

    return storedJob ?? null
}

export async function saveResumeParseJob(job: ResumeParseJob): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: job,
    })
}

export async function clearResumeParseJob(): Promise<void> {
    await chrome.storage.local.remove(STORAGE_KEY)
}

export async function enqueueResumeParseJob({
    sourceUrl,
    rawResumeText,
}: EnqueueResumeParseJobInput): Promise<ResumeParseJob> {
    const timestamp = new Date().toISOString()
    const job: ResumeParseJob = {
        jobId: crypto.randomUUID(),
        status: 'pending',
        sourceUrl,
        rawResumeText,
        requestedAt: timestamp,
        updatedAt: timestamp,
    }

    await saveResumeParseJob(job)

    return job
}

export { STORAGE_KEY as RESUME_PARSE_JOB_STORAGE_KEY }
