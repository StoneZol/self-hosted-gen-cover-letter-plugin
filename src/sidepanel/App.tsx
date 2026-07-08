import { useEffect, useState } from 'react'
import {
    extractAssistantText,
    generateChatCompletion,
    healthCheckOpenAiCompatible,
} from '@/lib/api/llm/openaiCompatible'
import { loadLlmConfig, saveLlmConfig } from '@/lib/configs/llm/storage'
import type { OpenAiCompatibleConfig } from '@/lib/types/llm/types'

export default function App() {
    const [config, setConfig] = useState<OpenAiCompatibleConfig | null>(null)
    const [status, setStatus] = useState('Loading config...')
    const [prompt, setPrompt] = useState('Напиши короткий и уверенный сопроводительный текст для frontend вакансии.')
    const [responseText, setResponseText] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        loadLlmConfig()
            .then((loadedConfig) => {
                setConfig(loadedConfig)
                setStatus('Config loaded. Ready to test LM Studio.')
            })
            .catch((error: unknown) => {
                setStatus(error instanceof Error ? error.message : 'Failed to load config.')
            })
    }, [])

    function updateConfig<K extends keyof OpenAiCompatibleConfig>(key: K, value: OpenAiCompatibleConfig[K]) {
        setConfig((currentConfig) => {
            if (!currentConfig) {
                return currentConfig
            }

            return {
                ...currentConfig,
                [key]: value,
            }
        })
    }

    async function handleSaveConfig() {
        if (!config) {
            return
        }

        setIsSaving(true)
        setStatus('Saving config...')

        try {
            await saveLlmConfig(config)
            setStatus('Config saved to chrome.storage.local.')
        } catch (error: unknown) {
            setStatus(error instanceof Error ? error.message : 'Failed to save config.')
        } finally {
            setIsSaving(false)
        }
    }

    async function handleHealthCheck() {
        if (!config) {
            return
        }

        setIsChecking(true)
        setStatus('Checking connection...')

        try {
            const result = await healthCheckOpenAiCompatible(config)
            setStatus(`Provider reachable. Model reply: ${result || '(empty response)'}`)
        } catch (error: unknown) {
            setStatus(error instanceof Error ? error.message : 'Health check failed.')
        } finally {
            setIsChecking(false)
        }
    }

    async function handleGenerateDemo() {
        if (!config) {
            return
        }

        setIsGenerating(true)
        setStatus('Generating demo response...')

        try {
            const response = await generateChatCompletion(config, [
                {
                    role: 'developer',
                    content: 'You write concise and practical cover letters in Russian.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ])

            setResponseText(extractAssistantText(response))
            setStatus(`Generation complete. Tokens: ${response?.usage?.total_tokens ?? 'n/a'}`)
        } catch (error: unknown) {
            setStatus(error instanceof Error ? error.message : 'Generation failed.')
        } finally {
            setIsGenerating(false)
        }
    }

    if (!config) {
        return <div className="app-shell">Loading...</div>
    }

    return (
        <div className="">
            <header className="">
                <p className="eyebrow">HH Free Cheat</p>
                <h1>LLM API Setup</h1>
                <p className="">
                    First provider is `LM Studio`, but the contract is `OpenAI-compatible /v1/chat/completions`.
                </p>
            </header>
            <section className="">
                <h2>Provider config</h2>
                <label className="">
                    <span>Base URL</span>
                    <input
                        value={config.baseUrl}
                        onChange={(event) => updateConfig('baseUrl', event.target.value)}
                        placeholder="http://localhost:1234/v1"
                    />
                </label>

                <label className="field">
                    <span>API key</span>
                    <input
                        value={config.apiKey}
                        onChange={(event) => updateConfig('apiKey', event.target.value)}
                        placeholder="lm-studio"
                    />
                </label>

                <label className="field">
                    <span>Model</span>
                    <input
                        value={config.model}
                        onChange={(event) => updateConfig('model', event.target.value)}
                        placeholder="qwen2.5-7b-instruct"
                    />
                </label>

                <div className="field-row">
                    <label className="field">
                        <span>Temperature</span>
                        <input
                            type="number"
                            min="0"
                            max="2"
                            step="0.1"
                            value={config.temperature}
                            onChange={(event) => updateConfig('temperature', Number(event.target.value))}
                        />
                    </label>

                    <label className="field">
                        <span>Max tokens</span>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={config.maxTokens}
                            onChange={(event) => updateConfig('maxTokens', Number(event.target.value))}
                        />
                    </label>
                </div>

                <div className="button-row">
                    <button onClick={handleSaveConfig} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save config'}
                    </button>
                    <button onClick={handleHealthCheck} disabled={isChecking}>
                        {isChecking ? 'Checking...' : 'Health check'}
                    </button>
                </div>
            </section>

            <section className="panel-card">
                <h2>Chat completions demo</h2>

                <label className="field">
                    <span>Prompt</span>
                    <textarea
                        rows={6}
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                    />
                </label>

                <div className="button-row">
                    <button onClick={handleGenerateDemo} disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                <label className="field">
                    <span>Assistant response</span>
                    <textarea rows={10} value={responseText} readOnly />
                </label>
            </section>

            <section className="panel-card">
                <h2>Status</h2>
                <p className="status-text">{status}</p>
            </section>
        </div>
    )
}
