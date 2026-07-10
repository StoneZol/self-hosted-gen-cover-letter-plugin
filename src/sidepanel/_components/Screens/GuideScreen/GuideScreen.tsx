import { BookOpen, CheckCircle2 } from 'lucide-react'
import useScreenStore from '@/sidepanel/store'
import { ScreenHeader } from '../../ScreenHeader'

const GUIDE_STEPS = [
    {
        title: 'Подключите языковую модель',
        body: 'Расширение работает с любым OpenAI-compatible API: локальная модель через LM Studio или облачный провайдер вроде OpenAI.',
        details: [
            'Для LM Studio: запустите приложение, загрузите модель и включите Local Server (обычно http://localhost:1234/v1).',
            'Для OpenAI: используйте base URL и API key от провайдера.',
        ],
    },
    {
        title: 'Заполните настройки LLM в плагине',
        body: 'Откройте Настройки и укажите base URL, API key, модель, temperature и max tokens.',
        details: [
            'Нажмите «Проверить подключение» в блоке LLM — healthcheck отправит тестовый запрос и покажет результат в статусе внизу.',
            'Если проверка не прошла, сверьте URL, ключ и что сервер модели запущен.',
        ],
    },
    {
        title: 'По желанию настройте сопроводительное',
        body: 'В том же экране настроек можно отредактировать промпт генерации и локальную подпись, которая добавляется к письму без отправки в LLM.',
    },
    {
        title: 'Сохраните резюме на hh.ru',
        body: 'Откройте своё резюме на HeadHunter и нажмите кнопку расширения на странице. Резюме распарсится через LLM и появится в sidepanel.',
    },
    {
        title: 'Откройте вакансии',
        body: 'На странице вакансии текст автоматически спарсится и проверится через LLM. Подтверждённая вакансия отображается на главной в sidepanel.',
        details: [
            'При переходе на форму отклика сохранённая вакансия остаётся доступной для генерации сопроводительного.',
        ],
    },
    {
        title: 'Сгенерируйте сопроводительное',
        body: 'На странице отклика нажмите «Сгенерировать сопровод». Расширение возьмёт выбранное резюме и последнюю вакансию, сгенерирует текст и вставит его в поле на hh.ru.',
    },
] as const

export const GuideScreen = () => {
    const setScreen = useScreenStore((state) => state.setScreen)

    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Гайд" showBack />

            <section className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center gap-2 text-primary">
                    <BookOpen className="h-4 w-4" />
                    <h2 className="text-sm font-semibold">Как пользоваться</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                    Короткий флоу от первого запуска до генерации сопроводительного на hh.ru.
                </p>
            </section>

            <ol className="flex flex-col gap-3">
                {GUIDE_STEPS.map((step, index) => (
                    <li
                        key={step.title}
                        className="rounded-xl border border-border bg-card p-4"
                    >
                        <div className="flex items-start gap-3">
                            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                                {index + 1}
                            </span>
                            <div className="min-w-0">
                                <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                                {'details' in step && step.details ? (
                                    <ul className="mt-2 flex flex-col gap-1.5">
                                        {step.details.map((detail) => (
                                            <li
                                                key={detail}
                                                className="flex gap-2 text-sm text-muted-foreground"
                                            >
                                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        </div>
                    </li>
                ))}
            </ol>

            <button
                type="button"
                onClick={() => setScreen('settings')}
                className="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10"
            >
                Перейти в настройки
            </button>
        </div>
    )
}
