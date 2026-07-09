import { Suspense, use } from 'react'
import { DEFAULT_CONTENT_CONFIG } from '@/lib/configs/content/config'
import { DEFAULT_COVER_LETTER_CONFIG } from '@/lib/configs/coverLetter/storage'
import { ScreenHeader } from '../../ScreenHeader'
import { loadSettingsScreenData, useSettingsScreen } from './SettingsScreen.hooks'
import { SettingsSection } from './SettingsSection'

function stringifyLines(values: string[]): string {
    return values.join('\n')
}

function parseLinesForEdit(value: string): string[] {
    return value.split('\n')
}

const SettingsScreenContent = () => {
    const initialData = use(loadSettingsScreenData())
    const {
        llmConfig,
        contentConfig,
        coverLetterConfig,
        isSaving,
        updateLlmConfig,
        updateCoverLetterConfig,
        updateContentPlatform,
        handleSaveConfigs,
        handleResetConfigs,
    } = useSettingsScreen(initialData)

    const defaultPlatform = DEFAULT_CONTENT_CONFIG.platforms[0]

    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Настройки" showBack />

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
                        defaultExample: '700',
                        helperText: 'Одно значение.',
                        onChange: (value) => updateLlmConfig('maxTokens', Number(value) || 0),
                    },
                ]}
            />

            <SettingsSection
                title="Сопроводительное письмо"
                description="Промпт уходит в нейросеть. Подпись приклеиваем к результату локально, без отправки в LLM."
                fields={[
                    {
                        key: 'basePrompt',
                        label: 'Базовый промпт',
                        value: coverLetterConfig.basePrompt,
                        description:
                            'Системные инструкции для генерации сопроводительного. Сюда можно описать тон, структуру и ограничения для модели.',
                        defaultExample: DEFAULT_COVER_LETTER_CONFIG.basePrompt,
                        rows: 8,
                        helperText: 'Передаётся в LLM при генерации.',
                        onChange: (value) => updateCoverLetterConfig('basePrompt', value),
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
                title="Контент"
                description="Список платформ с ручным `id`, названием, флагом включения и массивами matcher/selectors."
                fields={[]}
            />

            {contentConfig.platforms.map((platform, platformIndex) => (
                <SettingsSection
                    key={platform.id}
                    title={`Платформа: ${platform.title || platform.id}`}
                    description="Одна запись описывает одну платформу или сайт, который умеем матчить и парсить."
                    defaultCollapsed
                    fields={[
                        {
                            key: `${platform.id}-id`,
                            label: 'ID платформы',
                            value: platform.id,
                            description: 'Технический уникальный идентификатор платформы. Задаётся вручную и используется кодом.',
                            defaultExample: defaultPlatform.id,
                            helperText: 'Одно значение.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    id: value,
                                })),
                        },
                        {
                            key: `${platform.id}-title`,
                            label: 'Название платформы',
                            value: platform.title,
                            description: 'Человеческое название платформы для UI и чтения настроек.',
                            defaultExample: defaultPlatform.title,
                            helperText: 'Одно значение.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    title: value,
                                })),
                        },
                        {
                            key: `${platform.id}-enabled`,
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
                            key: `${platform.id}-resumePagePatterns`,
                            label: 'Паттерны страниц резюме',
                            value: stringifyLines(platform.resumePagePatterns),
                            description: 'Один или несколько regex-паттернов для определения страниц резюме.',
                            defaultExample: stringifyLines(defaultPlatform.resumePagePatterns),
                            rows: Math.max(3, platform.resumePagePatterns.length + 1),
                            helperText: 'Можно указать несколько значений. Каждый паттерн с новой строки.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    resumePagePatterns: parseLinesForEdit(value),
                                })),
                        },
                        {
                            key: `${platform.id}-resumeContentSelectors`,
                            label: 'Селекторы контента резюме',
                            value: stringifyLines(platform.resumeContentSelectors),
                            description: 'Один или несколько CSS-селекторов контейнера с текстом резюме. Пробуем по очереди.',
                            defaultExample: stringifyLines(defaultPlatform.resumeContentSelectors),
                            rows: Math.max(3, platform.resumeContentSelectors.length + 1),
                            helperText: 'Можно указать несколько значений. Каждый селектор с новой строки.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    resumeContentSelectors: parseLinesForEdit(value),
                                })),
                        },
                        {
                            key: `${platform.id}-vacancyPagePatterns`,
                            label: 'Паттерны страниц вакансий',
                            value: stringifyLines(platform.vacancyPagePatterns),
                            description: 'Regex-паттерны для страниц вакансий вида `https://{city}.hh.ru/vacancy/{id}`.',
                            defaultExample: stringifyLines(defaultPlatform.vacancyPagePatterns),
                            rows: Math.max(3, platform.vacancyPagePatterns.length + 1),
                            helperText: 'Можно указать несколько значений. Каждый паттерн с новой строки.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    vacancyPagePatterns: parseLinesForEdit(value),
                                })),
                        },
                        {
                            key: `${platform.id}-vacancyLetterInputSelectors`,
                            label: 'Селекторы поля сопроводительного',
                            value: stringifyLines(platform.vacancyLetterInputSelectors),
                            description: 'CSS-селекторы поля ввода сопроводительного письма на всех vacancy-related страницах.',
                            defaultExample: stringifyLines(defaultPlatform.vacancyLetterInputSelectors),
                            rows: Math.max(3, platform.vacancyLetterInputSelectors.length + 1),
                            helperText: 'Можно указать несколько значений. Каждый селектор с новой строки.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    vacancyLetterInputSelectors: parseLinesForEdit(value),
                                })),
                        },
                        {
                            key: `${platform.id}-vacancyLetterInjectSelectors`,
                            label: 'Селекторы контейнера инжекта кнопки',
                            value: stringifyLines(platform.vacancyLetterInjectSelectors),
                            description:
                                'Опционально. Куда монтировать кнопку. Сначала ищем предка найденного поля, затем связанный контейнер, затем единственный элемент на странице. Если пусто — рядом с полем.',
                            defaultExample: stringifyLines(defaultPlatform.vacancyLetterInjectSelectors),
                            rows: Math.max(3, platform.vacancyLetterInjectSelectors.length + 1),
                            helperText:
                                'Опционально. Можно оставить пустым. Каждый селектор с новой строки.',
                            onChange: (value) =>
                                updateContentPlatform(platformIndex, (currentPlatform) => ({
                                    ...currentPlatform,
                                    vacancyLetterInjectSelectors: parseLinesForEdit(value),
                                })),
                        },
                    ]}
                />
            ))}

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
            <ScreenHeader title="Настройки" showBack />
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
