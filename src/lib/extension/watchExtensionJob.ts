import type { ExtensionJobStatus } from '@/lib/types/jobs/types'

type ExtensionJobLike<TResult> = {
    jobId: string
    status: ExtensionJobStatus
    result?: TResult
    error?: string
}

type WatchExtensionJobOptions<TResult, TJob extends ExtensionJobLike<TResult>> = {
    storageKey: string
    onPending?: (job: TJob) => void | Promise<void>
    onProcessing?: (job: TJob) => void | Promise<void>
    onDone: (job: TJob, result: TResult) => void | Promise<void>
    onError: (job: TJob, error: string) => void | Promise<void>
}

export function watchExtensionJob<TResult, TJob extends ExtensionJobLike<TResult>>({
    storageKey,
    onPending,
    onProcessing,
    onDone,
    onError,
}: WatchExtensionJobOptions<TResult, TJob>) {
    const activeJobIdRef = { current: null as string | null }

    function trackJob(jobId: string): void {
        activeJobIdRef.current = jobId
    }

    function clearTrackedJob(): void {
        activeJobIdRef.current = null
    }

    function isTrackedJob(job: TJob | null | undefined): job is TJob {
        return Boolean(job && job.jobId === activeJobIdRef.current)
    }

    async function handleJobUpdate(job: TJob | null | undefined): Promise<void> {
        if (!isTrackedJob(job)) {
            return
        }

        if (job.status === 'pending') {
            await onPending?.(job)
            return
        }

        if (job.status === 'processing') {
            await onProcessing?.(job)
            return
        }

        if (job.status === 'done' && job.result !== undefined) {
            clearTrackedJob()
            await onDone(job, job.result)
            return
        }

        if (job.status === 'error') {
            clearTrackedJob()
            await onError(job, job.error ?? 'Неизвестная ошибка.')
        }
    }

    function subscribe(): () => void {
        function handleStorageChange(
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) {
            if (areaName !== 'local' || !changes[storageKey]) {
                return
            }

            void handleJobUpdate(changes[storageKey].newValue as TJob | undefined)
        }

        chrome.storage.onChanged.addListener(handleStorageChange)

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
        }
    }

    return {
        trackJob,
        clearTrackedJob,
        subscribe,
        handleJobUpdate,
    }
}
