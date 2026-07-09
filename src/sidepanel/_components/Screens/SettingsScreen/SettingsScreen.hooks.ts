import { useState } from 'react'
import { useAppStatus } from '@/components/Status'
import { DEFAULT_CONTENT_CONFIG } from '@/lib/configs/content/config'
import { loadContentConfig, saveContentConfig } from '@/lib/configs/content/storage'
import {
    DEFAULT_COVER_LETTER_CONFIG,
    loadCoverLetterConfig,
    saveCoverLetterConfig,
} from '@/lib/configs/coverLetter/storage'
import { DEFAULT_LLM_CONFIG } from '@/lib/configs/llm/storage'
import { loadLlmConfig, saveLlmConfig } from '@/lib/configs/llm/storage'
import type { ContentConfig, ContentPlatform } from '@/lib/types/content/types'
import type { CoverLetterConfig } from '@/lib/types/coverLetter/types'
import type { OpenAiCompatibleConfig } from '@/lib/types/llm/types'

type SettingsScreenData = {
    llmConfig: OpenAiCompatibleConfig
    contentConfig: ContentConfig
    coverLetterConfig: CoverLetterConfig
}

let settingsScreenDataPromise: Promise<SettingsScreenData> | null = null

export function loadSettingsScreenData(): Promise<SettingsScreenData> {
    if (!settingsScreenDataPromise) {
        settingsScreenDataPromise = Promise.all([
            loadLlmConfig(),
            loadContentConfig(),
            loadCoverLetterConfig(),
        ]).then(([llmConfig, contentConfig, coverLetterConfig]) => ({
            llmConfig,
            contentConfig,
            coverLetterConfig,
        }))
    }

    return settingsScreenDataPromise
}

export function resetSettingsScreenData(): void {
    settingsScreenDataPromise = null
}

export function useSettingsScreen(initialData: SettingsScreenData) {
    const { setStatus } = useAppStatus()
    const [llmConfig, setLlmConfig] = useState(initialData.llmConfig)
    const [contentConfig, setContentConfig] = useState(initialData.contentConfig)
    const [coverLetterConfig, setCoverLetterConfig] = useState(initialData.coverLetterConfig)
    const [isSaving, setIsSaving] = useState(false)

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
            ])

            setLlmConfig(DEFAULT_LLM_CONFIG)
            setContentConfig(DEFAULT_CONTENT_CONFIG)
            setCoverLetterConfig(DEFAULT_COVER_LETTER_CONFIG)
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

    return {
        llmConfig,
        contentConfig,
        coverLetterConfig,
        isSaving,
        updateLlmConfig,
        updateCoverLetterConfig,
        updateContentConfig,
        updateContentPlatform,
        handleSaveConfigs,
        handleResetConfigs,
    }
}
