import { extractResumeText } from '../../resumePage'

const useSaveResumeHook = () => {
    const handleSaveResume = () => {
        const resumeText = extractResumeText()
        const parsedUrl = window.location.href
        const resumeId = parsedUrl.split('/').pop()

        if (!resumeId) {
            console.warn('[HH Free Cheat] Resume ID was not found.')
            return
        }

        if (!resumeText) {
            console.warn('[HH Free Cheat] Resume content was not found or is empty.')
            return
        }

        console.log('[HH Free Cheat] Parsed resume text:\n', 'resumeId:', resumeId, 'resumeText:', resumeText)
    }

    return {
        handleSaveResume,
    }
}

export default useSaveResumeHook