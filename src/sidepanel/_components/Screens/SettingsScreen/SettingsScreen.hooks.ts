import { useEffect, useRef, useState } from 'react'
import { useAppStatus } from '@/components/Status'
import { healthCheckLlm } from '@/lib/api/llm/client'
import { DEFAULT_CONTENT_CONFIG, createDefaultContentPlatform } from '@/lib/configs/content/config'
import { loadContentConfig, saveContentConfig } from '@/lib/configs/content/storage'
import {
    DEFAULT_COVER_LETTER_CONFIG,
    loadCoverLetterConfig,
    saveCoverLetterConfig,
} from '@/lib/configs/coverLetter/storage'
import {
    DEFAULT_OPENAI_COMPATIBLE_LLM_CONFIG,
    getDefaultLlmConfigForProvider,
    loadLlmConfig,
    saveLlmConfig,
} from '@/lib/configs/llm/storage'
import {
    DEFAULT_RESUME_PARSING_CONFIG,
    loadResumeParsingConfig,
    saveResumeParsingConfig,
} from '@/lib/configs/resumeParsing/storage'
import {
    DEFAULT_QUICK_CHAT_CONFIG,
    loadQuickChatConfig,
    saveQuickChatConfig,
} from '@/lib/configs/quickChat/storage'
import type { ContentConfig, ContentPlatform } from '@/lib/types/content/types'
import type { CoverLetterConfig } from '@/lib/types/coverLetter/types'
import type { LlmConfig, LlmProviderType } from '@/lib/types/llm/types'
import type { QuickChatConfig } from '@/lib/types/quickChat/types'
import type { ResumeParsingConfig } from '@/lib/types/resumeParsing/types'
import {
    parseImportedContentPlatform,
    serializeContentPlatform,
} from './contentPlatformImportExport'

type SettingsScreenData = {
    llmConfig: LlmConfig
    contentConfig: ContentConfig
    coverLetterConfig: CoverLetterConfig
    resumeParsingConfig: ResumeParsingConfig
    quickChatConfig: QuickChatConfig
}

let settingsScreenDataPromise: Promise<SettingsScreenData> | null = null

export function loadSettingsScreenData(): Promise<SettingsScreenData> {
    if (!settingsScreenDataPromise) {
        settingsScreenDataPromise = Promise.all([
            loadLlmConfig(),
            loadContentConfig(),
            loadCoverLetterConfig(),
            loadResumeParsingConfig(),
            loadQuickChatConfig(),
        ]).then(([llmConfig, contentConfig, coverLetterConfig, resumeParsingConfig, quickChatConfig]) => ({
            llmConfig,
            contentConfig,
            coverLetterConfig,
            resumeParsingConfig,
            quickChatConfig,
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
    const [quickChatConfig, setQuickChatConfig] = useState(initialData.quickChatConfig)
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

    function updateLlmConfig<K extends keyof LlmConfig>(key: K, value: LlmConfig[K]) {
        setLlmConfig((currentConfig) => ({
            ...currentConfig,
            [key]: value,
        }))
    }

    function updateLlmProviderType(providerType: LlmProviderType) {
        setLlmConfig((currentConfig) => {
            if (currentConfig.providerType === providerType) {
                return currentConfig
            }

            const defaults = getDefaultLlmConfigForProvider(providerType)

            return {
                ...defaults,
                providerType,
                temperature: currentConfig.temperature,
                maxTokens: currentConfig.maxTokens,
            }
        })
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

    function updateQuickChatConfig<K extends keyof QuickChatConfig>(key: K, value: QuickChatConfig[K]) {
        setQuickChatConfig((currentConfig) => ({
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

    function removeContentPlatform(platformIndex: number) {
        setContentConfig((currentConfig) => ({
            ...currentConfig,
            platforms: currentConfig.platforms.filter((_, index) => index !== platformIndex),
        }))
    }

    function replaceContentPlatform(platformIndex: number, platform: ContentPlatform) {
        setContentConfig((currentConfig) => ({
            ...currentConfig,
            platforms: currentConfig.platforms.map((currentPlatform, index) =>
                index === platformIndex ? platform : currentPlatform,
            ),
        }))
    }

    async function exportContentPlatform(platformIndex: number) {
        const platform = contentConfig.platforms[platformIndex]

        if (!platform) {
            await setStatus('Платформа не найдена.', 'error')
            return
        }

        try {
            await navigator.clipboard.writeText(serializeContentPlatform(platform))
            await setStatus('Конфиг платформы скопирован в буфер обмена.', 'success')
        } catch (error: unknown) {
            await setStatus(
                error instanceof Error ? error.message : 'Не удалось экспортировать конфиг платформы.',
                'error',
            )
        }
    }

    async function importContentPlatform(platformIndex: number, raw: string) {
        try {
            const platform = parseImportedContentPlatform(raw)
            replaceContentPlatform(platformIndex, platform)
            await setStatus('Конфиг платформы вставлен из буфера обмена.', 'success')
        } catch (error: unknown) {
            await setStatus(
                error instanceof Error
                    ? `Не удалось импортировать конфиг: ${error.message}`
                    : 'Не удалось импортировать конфиг платформы из буфера обмена.',
                'error',
            )
        }
    }

    async function reportPlatformImportError(message: string) {
        await setStatus(message, 'error')
    }

    function addContentPlatform() {
        setContentConfig((currentConfig) => ({
            ...currentConfig,
            platforms: [...currentConfig.platforms, createDefaultContentPlatform()],
        }))
    }

    async function handleSaveConfigs() {
        setIsSaving(true)
        await setStatus('Сохраняю конфиги...', 'loading')

        try {
            await Promise.all([
                saveLlmConfig({
                    ...llmConfig,
                    temperature: Number(llmConfig.temperature) || 0,
                    maxTokens: Number(llmConfig.maxTokens) || 0,
                }),
                saveContentConfig(contentConfig),
                saveCoverLetterConfig(coverLetterConfig),
                saveResumeParsingConfig(resumeParsingConfig),
                saveQuickChatConfig(quickChatConfig),
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
                saveLlmConfig(DEFAULT_OPENAI_COMPATIBLE_LLM_CONFIG),
                saveContentConfig(DEFAULT_CONTENT_CONFIG),
                saveCoverLetterConfig(DEFAULT_COVER_LETTER_CONFIG),
                saveResumeParsingConfig(DEFAULT_RESUME_PARSING_CONFIG),
                saveQuickChatConfig(DEFAULT_QUICK_CHAT_CONFIG),
            ])

            setLlmConfig(DEFAULT_OPENAI_COMPATIBLE_LLM_CONFIG)
            setContentConfig(DEFAULT_CONTENT_CONFIG)
            setCoverLetterConfig(DEFAULT_COVER_LETTER_CONFIG)
            setResumeParsingConfig(DEFAULT_RESUME_PARSING_CONFIG)
            setQuickChatConfig(DEFAULT_QUICK_CHAT_CONFIG)
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
            await healthCheckLlm({
                ...llmConfig,
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
        quickChatConfig,
        isSaving,
        healthCheckState,
        updateLlmConfig,
        updateLlmProviderType,
        updateCoverLetterConfig,
        updateResumeParsingConfig,
        updateQuickChatConfig,
        updateContentConfig,
        updateContentPlatform,
        addContentPlatform,
        removeContentPlatform,
        replaceContentPlatform,
        exportContentPlatform,
        importContentPlatform,
        reportPlatformImportError,
        handleSaveConfigs,
        handleResetConfigs,
        handleLlmHealthCheck,
    }
}
