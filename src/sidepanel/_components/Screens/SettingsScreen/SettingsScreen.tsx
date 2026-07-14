import { Suspense, use } from 'react'
import { DEFAULT_CONTENT_CONFIG } from '@/lib/configs/content/config'
import { DEFAULT_COVER_LETTER_CONFIG } from '@/lib/configs/coverLetter/storage'
import { DEFAULT_QUICK_CHAT_CONFIG } from '@/lib/configs/quickChat/storage'
import { DEFAULT_RESUME_PARSING_CONFIG } from '@/lib/configs/resumeParsing/storage'
import { cn } from '@/lib/helpers/cn'
import { ScreenHeader } from '../../ScreenHeader'
import {
    getPlatformDisplayTitle,
    parseNullableLinesForEdit,
    parseNullableString,
    stringifyNullable,
    stringifyNullableLines,
} from './contentPlatformFieldUtils'
import { loadSettingsScreenData, useSettingsScreen } from './SettingsScreen.hooks'
import { SettingsSection } from './SettingsSection'

function getHealthCheckButtonLabel(
    healthCheckState: 'idle' | 'checking' | 'success' | 'error',
): string {
    switch (healthCheckState) {
        case 'checking':
            return 'Проверяю подключение...'
        case 'success':
            return 'Соединение установлено'
        case 'error':
            return 'Ошибка подключения'
        default:
            return 'Проверить подключение к LLM'
    }
}

const SettingsScreenContent = () => {
    const initialData = use(loadSettingsScreenData())
    const {
        llmConfig,
        contentConfig,
        coverLetterConfig,
        resumeParsingConfig,
        quickChatConfig,
        isSaving,
        healthCheckState,
        updateLlmConfig,
        updateCoverLetterConfig,
        updateResumeParsingConfig,
        updateQuickChatConfig,
        updateContentPlatform,
        addContentPlatform,
        removeContentPlatform,
        handleSaveConfigs,
        handleResetConfigs,
        handleLlmHealthCheck,
    } = useSettingsScreen(initialData)

    const defaultPlatform = DEFAULT_CONTENT_CONFIG.platforms[0]

    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Настройки" />

            <p className="text-sm text-muted-foreground">
                Все конфиги всегда видны на экране. Для длинных значений используем `textarea`,
                чтобы без боли хранить URL, regex, селекторы и будущие промпты.
            </p>

            <SettingsSection
                title="LLM"
                description="Подключение к OpenAI-compatible провайдеру."
                fields={[
                    {
                        key: 'providerType',
                        label: 'Тип провайдера',
                        value: llmConfig.providerType,
                        description: 'Тип провайдера LLM. Пока поддерживаем только OpenAI-compatible контракт.',
                        defaultExample: 'openai-compatible',
                        readOnly: true,
                    },
                    {
                        key: 'baseUrl',
                        label: 'Базовый URL',
                        value: llmConfig.baseUrl,
                        description: 'Базовый URL до OpenAI-compatible API. Для LM Studio это обычно локальный `/v1` endpoint.',
                        defaultExample: 'http://localhost:1234/v1',
                        helperText: 'Одно значение.',
                        onChange: (value) => updateLlmConfig('baseUrl', value),
                    },
                    {
                        key: 'apiKey',
                        label: 'API ключ',
                        value: llmConfig.apiKey,
                        description: 'Ключ доступа к провайдеру. Для локального LM Studio можно хранить простое техническое значение.',
                        defaultExample: 'lm-studio',
                        helperText: 'Одно значение.',
                        onChange: (value) => updateLlmConfig('apiKey', value),
                    },
                    {
                        key: 'model',
                        label: 'Модель',
                        value: llmConfig.model,
                        description: 'Идентификатор модели, которую будем использовать для генерации и парсинга.',
                        defaultExample: 'local-model',
                        helperText: 'Одно значение.',
                        onChange: (value) => updateLlmConfig('model', value),
                    },
                    {
                        key: 'temperature',
                        label: 'Температура',
                        value: String(llmConfig.temperature),
                        description: 'Степень вариативности ответа модели. Чем ниже, тем стабильнее и суше ответы.',
                        defaultExample: '0.2',
                        helperText: 'Одно значение.',
                        onChange: (value) => updateLlmConfig('temperature', Number(value) || 0),
                    },
                    {
                        key: 'maxTokens',
                        label: 'Макс. токены',
                        value: String(llmConfig.maxTokens),
                        description: 'Максимальное количество токенов в ответе модели.',
                        defaultExample: '6000',
                        helperText: 'Одно значение.',
                        onChange: (value) => updateLlmConfig('maxTokens', Number(value) || 0),
                    },
                ]}
            />

            <button
                type="button"
                onClick={() => void handleLlmHealthCheck()}
                disabled={isSaving || healthCheckState !== 'idle'}
                className={cn(
                    'rounded-lg border px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed',
                    healthCheckState === 'idle' &&
                        'border-border bg-background text-foreground hover:border-primary hover:bg-primary/10',
                    healthCheckState === 'checking' &&
                        'border-border bg-background text-foreground opacity-70',
                    healthCheckState === 'success' &&
                        'border-green-500/50 bg-green-500/15 text-green-200',
                    healthCheckState === 'error' &&
                        'border-red-500/40 bg-red-500/10 text-red-200',
                )}
            >
                {getHealthCheckButtonLabel(healthCheckState)}
            </button>

            <SettingsSection
                title="Сопроводительное письмо"
                description="Промпт и подпись настраиваются здесь. Модель следует вашему промпту — правьте стиль, тон и правила под себя."
                fields={[
                    {
                        key: 'generationPrompt',
                        label: 'Промпт генерации',
                        value: coverLetterConfig.generationPrompt,
                        description:
                            'Полные инструкции для LLM: стиль, характер, структура, ограничения. Это единственный промпт, который уходит в модель.',
                        defaultExample: DEFAULT_COVER_LETTER_CONFIG.generationPrompt,
                        rows: 16,
                        helperText: 'Редактируйте свободно. Подпись добавляется локально, не в промпт.',
                        onChange: (value) => updateCoverLetterConfig('generationPrompt', value),
                    },
                    {
                        key: 'letterSignature',
                        label: 'Подпись в конце письма',
                        value: coverLetterConfig.letterSignature,
                        description:
                            'Текст, который добавляется в конец готового сопроводительного после генерации: прощание, имя, контакты.',
                        defaultExample: DEFAULT_COVER_LETTER_CONFIG.letterSignature,
                        rows: 5,
                        helperText: 'Не передаётся в нейросеть. Добавляется к ответу модели на нашей стороне.',
                        onChange: (value) => updateCoverLetterConfig('letterSignature', value),
                    },
                ]}
            />

            <SettingsSection
                title="Парсинг резюме"
                description="Правила извлечения данных из текста резюме. Схема JSON подставляется автоматически и не редактируется."
                fields={[
                    {
                        key: 'parsingPrompt',
                        label: 'Промпт парсинга',
                        value: resumeParsingConfig.parsingPrompt,
                        description:
                            'Инструкции для LLM: как раскладывать резюме по полям, что класть в skills, selfAbout и т.д. Структура JSON-объекта добавляется к промпту автоматически.',
                        defaultExample: DEFAULT_RESUME_PARSING_CONFIG.parsingPrompt,
                        rows: 18,
                        helperText: 'Редактируйте правила. Схему объекта менять не нужно — она фиксирована.',
                        onChange: (value) => updateResumeParsingConfig('parsingPrompt', value),
                    },
                ]}
            />

            <SettingsSection
                title="Быстрый чат"
                description="System prompt для экрана чата в sidepanel. Используется как системное сообщение при каждом запросе."
                fields={[
                    {
                        key: 'systemPrompt',
                        label: 'System prompt',
                        value: quickChatConfig.systemPrompt,
                        description:
                            'Инструкции для LLM: чем помогать, как отвечать про regex, селекторы и конфиги платформ.',
                        defaultExample: DEFAULT_QUICK_CHAT_CONFIG.systemPrompt,
                        rows: 16,
                        helperText: 'Редактируйте под себя. Применяется после сохранения конфигов.',
                        onChange: (value) => updateQuickChatConfig('systemPrompt', value),
                    },
                ]}
            />

            <section className="rounded-xl border border-border bg-card p-4">
                <h2 className="text-sm font-semibold text-foreground">Контент</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Каждая платформа ниже — отдельный сайт или ресурс, который расширение умеет матчить и парсить.
                    Укажите id, название, regex URL и CSS-селекторы. Для пустых значений используйте null.
                </p>
            </section>

            {contentConfig.platforms.map((platform, platformIndex) => (
                <SettingsSection
                    key={`platform-${platformIndex}`}
                    title={`Платформа: ${getPlatformDisplayTitle(platform, platformIndex)}`}
                    defaultCollapsed
                    onDelete={() => removeContentPlatform(platformIndex)}
                    deleteLabel="Удалить платформу"
                    fields={[
                        {
                            key: `${platformIndex}-id`,
                            label: 'ID платформы',
                            value: stringifyNullable(platform.id),
                            description: 'Технический уникальный идентификатор платформы. Задаётся вручную и используется кодом.',
                            defaultExample: defaultPlatform.id ?? 'null',
                            helperText: 'Одно значение или null.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    id: parseNullableString(value),
                                })),
                        },
                        {
                            key: `${platformIndex}-title`,
                            label: 'Название платформы',
                            value: stringifyNullable(platform.title),
                            description: 'Человеческое название платформы для UI и чтения настроек.',
                            defaultExample: defaultPlatform.title ?? 'null',
                            helperText: 'Одно значение или null.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    title: parseNullableString(value),
                                })),
                        },
                        {
                            key: `${platformIndex}-enabled`,
                            label: 'Включено',
                            value: String(platform.enabled),
                            description: 'Флаг активности платформы. `true` участвует в матчинге, `false` временно отключает правило.',
                            defaultExample: String(defaultPlatform.enabled),
                            helperText: 'Одно значение: `true` или `false`.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    enabled: value.trim().toLowerCase() === 'true',
                                })),
                        },
                        {
                            key: `${platformIndex}-resumePagePatterns`,
                            label: 'Паттерны страниц резюме',
                            value: stringifyNullableLines(platform.resumePagePatterns),
                            description: 'Один или несколько regex-паттернов для определения страниц резюме.',
                            defaultExample: stringifyNullableLines(defaultPlatform.resumePagePatterns),
                            rows: Math.max(3, (platform.resumePagePatterns?.length ?? 0) + 1),
                            helperText: 'Каждый паттерн с новой строки или null.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    resumePagePatterns: parseNullableLinesForEdit(value),
                                })),
                        },
                        {
                            key: `${platformIndex}-resumeContentSelectors`,
                            label: 'Селекторы контента резюме',
                            value: stringifyNullableLines(platform.resumeContentSelectors),
                            description: 'Один или несколько CSS-селекторов контейнера с текстом резюме. Пробуем по очереди.',
                            defaultExample: stringifyNullableLines(defaultPlatform.resumeContentSelectors),
                            rows: Math.max(3, (platform.resumeContentSelectors?.length ?? 0) + 1),
                            helperText: 'Каждый селектор с новой строки или null.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    resumeContentSelectors: parseNullableLinesForEdit(value),
                                })),
                        },
                        {
                            key: `${platformIndex}-vacancyPagePatterns`,
                            label: 'Паттерны страниц вакансий',
                            value: stringifyNullableLines(platform.vacancyPagePatterns),
                            description: 'Regex-паттерны для vacancy-flow: страница вакансии и отклик/опрос.',
                            defaultExample: stringifyNullableLines(defaultPlatform.vacancyPagePatterns),
                            rows: Math.max(3, (platform.vacancyPagePatterns?.length ?? 0) + 1),
                            helperText: 'Каждый паттерн с новой строки или null.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    vacancyPagePatterns: parseNullableLinesForEdit(value),
                                })),
                        },
                        {
                            key: `${platformIndex}-vacancyParsePagePatterns`,
                            label: 'Паттерны страниц парсинга вакансии',
                            value: stringifyNullableLines(platform.vacancyParsePagePatterns),
                            description:
                                'Regex-паттерны страниц, с которых читаем текст вакансии для генерации сопроводительного.',
                            defaultExample: stringifyNullableLines(defaultPlatform.vacancyParsePagePatterns),
                            rows: Math.max(3, (platform.vacancyParsePagePatterns?.length ?? 0) + 1),
                            helperText: 'Каждый паттерн с новой строки или null.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    vacancyParsePagePatterns: parseNullableLinesForEdit(value),
                                })),
                        },
                        {
                            key: `${platformIndex}-vacancyParseContentSelectors`,
                            label: 'Селекторы якоря контента вакансии',
                            value: stringifyNullableLines(platform.vacancyParseContentSelectors),
                            description:
                                'CSS-селекторы контейнера с описанием вакансии. Если null — парсинг по якорю недоступен.',
                            defaultExample: stringifyNullableLines(defaultPlatform.vacancyParseContentSelectors),
                            rows: Math.max(3, (platform.vacancyParseContentSelectors?.length ?? 0) + 1),
                            helperText: 'Каждый селектор с новой строки или null.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    vacancyParseContentSelectors: parseNullableLinesForEdit(value),
                                })),
                        },
                        {
                            key: `${platformIndex}-vacancyLetterInputSelectors`,
                            label: 'Селекторы поля сопроводительного',
                            value: stringifyNullableLines(platform.vacancyLetterInputSelectors),
                            description: 'CSS-селекторы поля ввода сопроводительного письма на всех vacancy-related страницах.',
                            defaultExample: stringifyNullableLines(defaultPlatform.vacancyLetterInputSelectors),
                            rows: Math.max(3, (platform.vacancyLetterInputSelectors?.length ?? 0) + 1),
                            helperText: 'Каждый селектор с новой строки или null.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    vacancyLetterInputSelectors: parseNullableLinesForEdit(value),
                                })),
                        },
                        {
                            key: `${platformIndex}-vacancyLetterInjectSelectors`,
                            label: 'Селекторы контейнера инжекта кнопки',
                            value: stringifyNullableLines(platform.vacancyLetterInjectSelectors),
                            description:
                                'Куда монтировать кнопку. Если null — рядом с полем сопроводительного.',
                            defaultExample: stringifyNullableLines(defaultPlatform.vacancyLetterInjectSelectors),
                            rows: Math.max(3, (platform.vacancyLetterInjectSelectors?.length ?? 0) + 1),
                            helperText: 'Каждый селектор с новой строки или null.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    vacancyLetterInjectSelectors: parseNullableLinesForEdit(value),
                                })),
                        },
                    ]}
                />
            ))}

            <button
                type="button"
                onClick={addContentPlatform}
                disabled={isSaving}
                className="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
                Добавить платформу
            </button>

            <div className="flex flex-col gap-3">
                <button
                    type="button"
                    onClick={() => void handleSaveConfigs()}
                    disabled={isSaving}
                    className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSaving ? 'Сохраняю...' : 'Сохранить конфиги'}
                </button>

                <button
                    type="button"
                    onClick={() => void handleResetConfigs()}
                    disabled={isSaving}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Сбросить все к дефолту
                </button>
            </div>
        </div>
    )
}

const SettingsScreenFallback = () => {
    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Настройки" />
            <section className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                Загружаю конфиги...
            </section>
        </div>
    )
}

export const SettingsScreen = () => {
    return (
        <Suspense fallback={<SettingsScreenFallback />}>
            <SettingsScreenContent />
        </Suspense>
    )
}
