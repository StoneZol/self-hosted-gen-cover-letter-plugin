import { useCallback, useEffect, useMemo, useState } from 'react'
import { saveAppStatus } from '@/lib/configs/app/statusStorage'
import {
    clearResumeParseJob,
    enqueueResumeParseJob,
    RESUME_PARSE_JOB_STORAGE_KEY,
} from '@/lib/configs/jobs/resumeParseJobStorage'
import { findResumeById, RESUMES_STORAGE_KEY } from '@/lib/configs/resume/storage'
import { watchExtensionJob } from '@/lib/extension/watchExtensionJob'
import { extractResumeIdFromUrl } from '@/lib/resume/extractResumeIdFromUrl'
import type { Resume } from '@/lib/types/resume/types'
import type { ResumeParseJob } from '@/lib/types/jobs/resumeParseJob'
import { extractResumeText } from '../../resumePage'

function getSaveHint(existingResume: Resume | null, resumeIdFromUrl: string | null): string {
    if (existingResume) {
        return `Резюме «${existingResume.title}» уже сохранено. При клике оно будет перезаписано новой версией.`
    }

    if (resumeIdFromUrl) {
        return 'Резюме с этой страницы ещё не сохранено. После обработки оно будет добавлено в расширение.'
    }

    return 'После обработки резюме будет добавлено или обновлено по id из ссылки.'
}

const useSaveResumeHook = () => {
    const sourceUrl = window.location.href
    const resumeIdFromUrl = extractResumeIdFromUrl(sourceUrl)
    const [existingResume, setExistingResume] = useState<Resume | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const refreshExistingResume = useCallback(async () => {
        if (!resumeIdFromUrl) {
            setExistingResume(null)
            return
        }

        const storedResume = await findResumeById(resumeIdFromUrl)
        setExistingResume(storedResume)
    }, [resumeIdFromUrl])

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
                    setExistingResume(result.resume)
                    await saveAppStatus({
                        message: result.isUpdate
                            ? `Резюме «${result.resume.title}» обновлено.`
                            : `Резюме «${result.resume.title}» сохранено.`,
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

    useEffect(() => {
        void refreshExistingResume()

        function handleStorageChange(
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) {
            if (areaName !== 'local' || !changes[RESUMES_STORAGE_KEY]) {
                return
            }

            void refreshExistingResume()
        }

        chrome.storage.onChanged.addListener(handleStorageChange)

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
        }
    }, [refreshExistingResume])

    useEffect(() => jobWatcher.subscribe(), [jobWatcher])

    const saveHint = useMemo(
        () => getSaveHint(existingResume, resumeIdFromUrl),
        [existingResume, resumeIdFromUrl],
    )

    const buttonLabel = existingResume ? 'Обновить резюме' : 'Сохранить резюме'

    const handleSaveResume = async () => {
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
        saveHint,
        buttonLabel,
        isSaving,
        isUpdateMode: Boolean(existingResume),
    }
}

export default useSaveResumeHook
