import { saveResumeParseJob } from '@/lib/configs/jobs/resumeParseJobStorage'
import { upsertResume } from '@/lib/configs/resume/storage'
import { parseResumeWithLlm } from '@/lib/resume/parseResumeWithLlm'
import type { ResumeParseJob } from '@/lib/types/jobs/resumeParseJob'

export async function processResumeParseJob(job: ResumeParseJob): Promise<ResumeParseJob> {
    const processingJob: ResumeParseJob = {
        ...job,
        status: 'processing',
        updatedAt: new Date().toISOString(),
    }

    await saveResumeParseJob(processingJob)

    try {
        const parsedResume = await parseResumeWithLlm({
            sourceUrl: job.sourceUrl,
            rawResumeText: job.rawResumeText,
        })
        const { isUpdate } = await upsertResume(parsedResume)
        const doneJob: ResumeParseJob = {
            ...processingJob,
            status: 'done',
            updatedAt: new Date().toISOString(),
            result: {
                resume: parsedResume,
                isUpdate,
            },
        }

        await saveResumeParseJob(doneJob)

        return doneJob
    } catch (error: unknown) {
        const errorJob: ResumeParseJob = {
            ...processingJob,
            status: 'error',
            updatedAt: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Не удалось обработать резюме.',
        }

        await saveResumeParseJob(errorJob)

        return errorJob
    }
}
