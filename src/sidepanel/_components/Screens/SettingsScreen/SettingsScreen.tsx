import { ScreenHeader } from '../../ScreenHeader'

const SETTINGS_BLOCKS = [
    {
        title: 'LLM',
        description: 'Base URL, model, API key, temperature, max tokens.',
    },
    {
        title: 'Content selectors',
        description: 'Селекторы для резюме, вакансий и полей hh.',
    },
    {
        title: 'Generation',
        description: 'Тон, дополнительный промпт и поведение генерации.',
    },
]

export const SettingsScreen = () => {
    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Настройки" showBack />

            <p className="text-sm text-muted-foreground">
                Здесь будут все пользовательские конфиги. Пока это заглушка под будущие формы.
            </p>

            <div className="flex flex-col gap-3">
                {SETTINGS_BLOCKS.map((block) => (
                    <section
                        key={block.title}
                        className="rounded-xl border border-border bg-card p-4"
                    >
                        <h2 className="text-sm font-semibold text-foreground">{block.title}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">{block.description}</p>
                        <button
                            type="button"
                            className="mt-4 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            Настроить
                        </button>
                    </section>
                ))}
            </div>
        </div>
    )
}
