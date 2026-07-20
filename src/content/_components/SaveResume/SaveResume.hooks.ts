import { useEffect, useMemo, useState } from 'react'
import { saveAppStatus } from '@/lib/configs/app/statusStorage'
import {
    clearResumeParseJob,
    enqueueResumeParseJob,
    RESUME_PARSE_JOB_STORAGE_KEY,
} from '@/lib/configs/jobs/resumeParseJobStorage'
import { watchExtensionJob } from '@/lib/extension/watchExtensionJob'
import { formatResumeDisplayTitle } from '@/lib/resume/formatResumeDisplayTitle'
import type { ResumeParseJob } from '@/lib/types/jobs/resumeParseJob'
import { extractResumeText } from '../../resumePage'

const useSaveResumeHook = () => {
    const sourceUrl = window.location.href
    const [isSaving, setIsSaving] = useState(false)

    const jobWatcher = useMemo(
        () =>
            watchExtensionJob<
                NonNullable<ResumeParseJob['result']>,
                ResumeParseJob
            >({
                storageKey: RESUME_PARSE_JOB_STORAGE_KEY,
                onProcessing: async () => {
                    setIsSaving(true)
                    await saveAppStatus({
                        message: 'Обрабатываю резюме через LLM...',
                        type: 'loading',
                    })
                },
                onDone: async (_job, result) => {
                    await saveAppStatus({
                        message: result.isUpdate
                            ? `Резюме «${formatResumeDisplayTitle(result.resume)}» обновлено.`
                            : `Резюме «${formatResumeDisplayTitle(result.resume)}» сохранено.`,
                        type: 'success',
                    })
                    setIsSaving(false)
                    await clearResumeParseJob()
                },
                onError: async (_job, error) => {
                    await saveAppStatus({
                        message: error,
                        type: 'error',
                    })
                    setIsSaving(false)
                    await clearResumeParseJob()
                },
            }),
        [],
    )

    useEffect(() => jobWatcher.subscribe(), [jobWatcher])

    async function handleSaveResume() {
        if (isSaving) {
            return
        }

        const resumeText = extractResumeText()

        if (!resumeText) {
            await saveAppStatus({
                message: 'Не удалось извлечь текст резюме со страницы.',
                type: 'error',
            })
            return
        }

        setIsSaving(true)
        await saveAppStatus({
            message: 'Отправляю резюме в расширение для обработки...',
            type: 'loading',
        })

        try {
            const job = await enqueueResumeParseJob({
                sourceUrl,
                rawResumeText: resumeText,
            })

            jobWatcher.trackJob(job.jobId)
        } catch (error: unknown) {
            await saveAppStatus({
                message: error instanceof Error ? error.message : 'Не удалось поставить задачу в очередь.',
                type: 'error',
            })
            setIsSaving(false)
        }
    }

    return {
        handleSaveResume,
        isSaving,
    }
}

export default useSaveResumeHook
