import { useMemo } from 'react'
import { formatResumeDisplayTitle } from '@/lib/resume/formatResumeDisplayTitle'
import type { SelectOption } from '@/components/Select'
import { useResumes } from '@/sidepanel/useResumes'

export type ResumePickerAction = 'open' | 'delete'

type UseResumePickerParams = {
    action: ResumePickerAction
    onOpen?: () => void
}

export function useResumePicker({ action, onOpen }: UseResumePickerParams) {
    const {
        resumes,
        selectedResumeId,
        selectedResume,
        isLoading,
        setSelectedResumeId,
        deleteResume,
    } = useResumes()

    const hasResumes = resumes.length > 0
    const isActionDisabled = !selectedResumeId

    const options = useMemo<SelectOption[]>(
        () =>
            resumes.map((resume) => ({
                value: resume.id,
                label: formatResumeDisplayTitle(resume),
            })),
        [resumes],
    )

    async function handleAction() {
        if (!selectedResumeId) {
            return
        }

        if (action === 'open') {
            onOpen?.()
            return
        }

        await deleteResume(selectedResumeId)
    }

    return {
        resumes,
        selectedResumeId,
        selectedResume,
        isLoading,
        hasResumes,
        options,
        isActionDisabled,
        setSelectedResumeId,
        handleAction,
    }
}
