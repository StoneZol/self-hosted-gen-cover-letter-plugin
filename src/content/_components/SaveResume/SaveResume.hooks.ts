import { extractResumeText } from '../../resumePage'

const useSaveResumeHook = () => {
    const handleSaveResume = () => {
        const resumeText = extractResumeText()
        const sourceUrl = window.location.href

        if (!resumeText) {
            console.warn('[HH Free Cheat] Resume content was not found or is empty.')
            return
        }

        console.log('[HH Free Cheat] Parsed resume text:\n', 'sourceUrl:', sourceUrl, 'resumeText:', resumeText)
    }

    return {
        handleSaveResume,
    }
}

export default useSaveResumeHook