export type ExtensionJobStatus = 'pending' | 'processing' | 'done' | 'error'

export type ExtensionJobTimestamps = {
    jobId: string
    status: ExtensionJobStatus
    requestedAt: string
    updatedAt: string
}
