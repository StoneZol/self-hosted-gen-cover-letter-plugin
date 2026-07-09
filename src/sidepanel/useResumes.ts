import { useCallback, useEffect, useState } from 'react'
import {
    loadResumeSelectionState,
    RESUMES_STORAGE_KEY,
    saveResumes,
    saveSelectedResumeId,
    SELECTED_RESUME_ID_STORAGE_KEY,
} from '@/lib/configs/resume/storage'
import type { Resume, ResumeSelectionState } from '@/lib/types/resume/types'

const EMPTY_SELECTION: ResumeSelectionState = {
    resumes: [],
    selectedResumeId: null,
    selectedResume: null,
}

export function useResumes() {
    const [selection, setSelection] = useState<ResumeSelectionState>(EMPTY_SELECTION)
    const [isLoading, setIsLoading] = useState(true)

    const refreshSelection = useCallback(async () => {
        const nextSelection = await loadResumeSelectionState()
        setSelection(nextSelection)
    }, [])

    useEffect(() => {
        void refreshSelection().finally(() => {
            setIsLoading(false)
        })

        function handleStorageChange(
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) {
            if (areaName !== 'local') {
                return
            }

            if (changes[RESUMES_STORAGE_KEY] || changes[SELECTED_RESUME_ID_STORAGE_KEY]) {
                void refreshSelection()
            }
        }

        chrome.storage.onChanged.addListener(handleStorageChange)

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
        }
    }, [refreshSelection])

    const setSelectedResumeId = useCallback(async (selectedResumeId: string) => {
        await saveSelectedResumeId(selectedResumeId)
        setSelection((currentSelection) => ({
            ...currentSelection,
            selectedResumeId,
            selectedResume:
                currentSelection.resumes.find((resume) => resume.id === selectedResumeId) ?? null,
        }))
    }, [])

    const deleteResume = useCallback(
        async (resumeId: string) => {
            const resumeToDelete = selection.resumes.find((resume) => resume.id === resumeId)

            if (!resumeToDelete) {
                return false
            }

            const confirmed = window.confirm(`Удалить резюме «${resumeToDelete.title}»?`)

            if (!confirmed) {
                return false
            }

            const nextResumes = selection.resumes.filter((resume) => resume.id !== resumeId)
            const nextSelectedResumeId =
                selection.selectedResumeId === resumeId
                    ? (nextResumes[0]?.id ?? null)
                    : selection.selectedResumeId

            await Promise.all([
                saveResumes(nextResumes),
                saveSelectedResumeId(nextSelectedResumeId),
            ])

            setSelection({
                resumes: nextResumes,
                selectedResumeId: nextSelectedResumeId,
                selectedResume:
                    nextResumes.find((resume) => resume.id === nextSelectedResumeId) ?? null,
            })

            return true
        },
        [selection.resumes, selection.selectedResumeId],
    )

    return {
        resumes: selection.resumes,
        selectedResumeId: selection.selectedResumeId,
        selectedResume: selection.selectedResume,
        isLoading,
        setSelectedResumeId,
        deleteResume,
        refreshSelection,
    }
}

export type { Resume }
