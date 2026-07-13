import { useEffect, useRef, useState } from 'react'
import { useAppStatus } from '@/components/Status'
import { healthCheckOpenAiCompatible } from '@/lib/api/llm/openaiCompatible'
import { DEFAULT_CONTENT_CONFIG } from '@/lib/configs/content/config'
import { loadContentConfig, saveContentConfig } from '@/lib/configs/content/storage'
import {
    DEFAULT_COVER_LETTER_CONFIG,
    loadCoverLetterConfig,
    saveCoverLetterConfig,
} from '@/lib/configs/coverLetter/storage'
import { DEFAULT_LLM_CONFIG } from '@/lib/configs/llm/storage'
import { loadLlmConfig, saveLlmConfig } from '@/lib/configs/llm/storage'
import {
    DEFAULT_RESUME_PARSING_CONFIG,
    loadResumeParsingConfig,
    saveResumeParsingConfig,
} from '@/lib/configs/resumeParsing/storage'
import type { ContentConfig, ContentPlatform } from '@/lib/types/content/types'
import type { CoverLetterConfig } from '@/lib/types/coverLetter/types'
import type { OpenAiCompatibleConfig } from '@/lib/types/llm/types'
import type { ResumeParsingConfig } from '@/lib/types/resumeParsing/types'

type SettingsScreenData = {
    llmConfig: OpenAiCompatibleConfig
    contentConfig: ContentConfig
    coverLetterConfig: CoverLetterConfig
    resumeParsingConfig: ResumeParsingConfig
}

let settingsScreenDataPromise: Promise<SettingsScreenData> | null = null

export function loadSettingsScreenData(): Promise<SettingsScreenData> {
    if (!settingsScreenDataPromise) {
        settingsScreenDataPromise = Promise.all([
            loadLlmConfig(),
            loadContentConfig(),
            loadCoverLetterConfig(),
            loadResumeParsingConfig(),
        ]).then(([llmConfig, contentConfig, coverLetterConfig, resumeParsingConfig]) => ({
            llmConfig,
            contentConfig,
            coverLetterConfig,
            resumeParsingConfig,
        }))
    }

    return settingsScreenDataPromise
}

export function resetSettingsScreenData(): void {
    settingsScreenDataPromise = null
}

type HealthCheckState = 'idle' | 'checking' | 'success' | 'error'

const HEALTH_CHECK_RESET_MS = 2000

export function useSettingsScreen(initialData: SettingsScreenData) {
    const { setStatus } = useAppStatus()
    const [llmConfig, setLlmConfig] = useState(initialData.llmConfig)
    const [contentConfig, setContentConfig] = useState(initialData.contentConfig)
    const [coverLetterConfig, setCoverLetterConfig] = useState(initialData.coverLetterConfig)
    const [resumeParsingConfig, setResumeParsingConfig] = useState(initialData.resumeParsingConfig)
    const [isSaving, setIsSaving] = useState(false)
    const [healthCheckState, setHealthCheckState] = useState<HealthCheckState>('idle')
    const healthCheckResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (healthCheckResetTimerRef.current) {
                clearTimeout(healthCheckResetTimerRef.current)
            }
        }
    }, [])

    function scheduleHealthCheckReset(): void {
        if (healthCheckResetTimerRef.current) {
            clearTimeout(healthCheckResetTimerRef.current)
        }

        healthCheckResetTimerRef.current = setTimeout(() => {
            setHealthCheckState('idle')
            healthCheckResetTimerRef.current = null
        }, HEALTH_CHECK_RESET_MS)
    }

    function updateLlmConfig<K extends keyof OpenAiCompatibleConfig>(
        key: K,
        value: OpenAiCompatibleConfig[K],
    ) {
        setLlmConfig((currentConfig) => ({
            ...currentConfig,
            [key]: value,
        }))
    }

    function updateCoverLetterConfig<K extends keyof CoverLetterConfig>(
        key: K,
        value: CoverLetterConfig[K],
    ) {
        setCoverLetterConfig((currentConfig) => ({
            ...currentConfig,
            [key]: value,
        }))
    }

    function updateResumeParsingConfig<K extends keyof ResumeParsingConfig>(
        key: K,
        value: ResumeParsingConfig[K],
    ) {
        setResumeParsingConfig((currentConfig) => ({
            ...currentConfig,
            [key]: value,
        }))
    }

    function updateContentConfig<K extends keyof ContentConfig>(key: K, value: ContentConfig[K]) {
        setContentConfig((currentConfig) => ({
            ...currentConfig,
            [key]: value,
        }))
    }

    function updateContentPlatform(
        platformIndex: number,
        updater: (platform: ContentPlatform) => ContentPlatform,
    ) {
        setContentConfig((currentConfig) => ({
            ...currentConfig,
            platforms: currentConfig.platforms.map((platform, index) =>
                index === platformIndex ? updater(platform) : platform,
            ),
        }))
    }

    async function handleSaveConfigs() {
        setIsSaving(true)
        await setStatus('Сохраняю конфиги...', 'loading')

        try {
            await Promise.all([
                saveLlmConfig({
                    ...llmConfig,
                    providerType: 'openai-compatible',
                    temperature: Number(llmConfig.temperature) || 0,
                    maxTokens: Number(llmConfig.maxTokens) || 0,
                }),
                saveContentConfig(contentConfig),
                saveCoverLetterConfig(coverLetterConfig),
                saveResumeParsingConfig(resumeParsingConfig),
            ])

            resetSettingsScreenData()
            await setStatus('Конфиги сохранены.', 'success')
        } catch (error: unknown) {
            await setStatus(
                error instanceof Error ? error.message : 'Не удалось сохранить конфиги.',
                'error',
            )
        } finally {
            setIsSaving(false)
        }
    }

    async function handleResetConfigs() {
        setIsSaving(true)
        await setStatus('Сбрасываю конфиги к дефолту...', 'loading')

        try {
            await Promise.all([
                saveLlmConfig(DEFAULT_LLM_CONFIG),
                saveContentConfig(DEFAULT_CONTENT_CONFIG),
                saveCoverLetterConfig(DEFAULT_COVER_LETTER_CONFIG),
                saveResumeParsingConfig(DEFAULT_RESUME_PARSING_CONFIG),
            ])

            setLlmConfig(DEFAULT_LLM_CONFIG)
            setContentConfig(DEFAULT_CONTENT_CONFIG)
            setCoverLetterConfig(DEFAULT_COVER_LETTER_CONFIG)
            setResumeParsingConfig(DEFAULT_RESUME_PARSING_CONFIG)
            resetSettingsScreenData()
            await setStatus('Конфиги сброшены к значениям по умолчанию.', 'success')
        } catch (error: unknown) {
            await setStatus(
                error instanceof Error ? error.message : 'Не удалось сбросить конфиги.',
                'error',
            )
        } finally {
            setIsSaving(false)
        }
    }

    async function handleLlmHealthCheck() {
        if (healthCheckState === 'checking') {
            return
        }

        setHealthCheckState('checking')

        try {
            await healthCheckOpenAiCompatible({
                ...llmConfig,
                providerType: 'openai-compatible',
                temperature: Number(llmConfig.temperature) || 0,
                maxTokens: Number(llmConfig.maxTokens) || 0,
            })

            setHealthCheckState('success')
            scheduleHealthCheckReset()
        } catch {
            setHealthCheckState('error')
            scheduleHealthCheckReset()
        }
    }

    return {
        llmConfig,
        contentConfig,
        coverLetterConfig,
        resumeParsingConfig,
        isSaving,
        healthCheckState,
        updateLlmConfig,
        updateCoverLetterConfig,
        updateResumeParsingConfig,
        updateContentConfig,
        updateContentPlatform,
        handleSaveConfigs,
        handleResetConfigs,
        handleLlmHealthCheck,
    }
}
