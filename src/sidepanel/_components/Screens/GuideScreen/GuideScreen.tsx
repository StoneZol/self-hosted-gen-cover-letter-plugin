import { BookOpen, CheckCircle2 } from 'lucide-react'
import { APP_SLUG } from '@/lib/constants/appName'
import useScreenStore from '@/sidepanel/store'
import { ScreenHeader } from '../../ScreenHeader'

const GUIDE_STEPS = [
    {
        title: 'Подключите языковую модель',
        body: 'Расширение работает с любым OpenAI-compatible API: локальная модель через LM Studio или облачный провайдер вроде OpenAI.',
        details: [
            'Для LM Studio: запустите приложение, загрузите модель и включите Local Server (обычно http://localhost:1234/v1).',
            'Для OpenAI: используйте base URL и API key от провайдера.',
            'Парсинг резюме, проверка вакансий и генерация сопроводительного полностью выполняются вашей LLM — расширение только снимает текст со страницы и отправляет запросы на указанный endpoint.',
        ],
    },
    {
        title: 'Заполните настройки LLM в плагине',
        body: 'Откройте Настройки и укажите base URL, API key, модель, temperature и max tokens.',
        details: [
            'Нажмите «Проверить подключение» в блоке LLM — healthcheck отправит тестовый запрос и покажет результат в статусе сверху.',
            'Если проверка не прошла, сверьте URL, ключ и что сервер модели запущен.',
        ],
    },
    {
        title: 'По желанию настройте сопроводительное',
        body: 'В том же экране настроек можно отредактировать промпт генерации и локальную подпись, которая добавляется к письму без отправки в LLM.',
    },
    {
        title: 'Сохраните резюме на hh.ru',
        body: 'Откройте своё резюме на HeadHunter и нажмите «Сохранить резюме» на странице. Расширение снимет текст со страницы, а структурирование в JSON выполнит ваша LLM.',
        details: [
            'Парсинг резюме полностью на стороне подключённой модели — обычно это локальный LM Studio или другой OpenAI-compatible сервер из настроек.',
            'Качество полей (id, навыки, опыт) зависит от модели и промпта в Настройках → Парсинг резюме.',
            'Если модель вернёт тот же id — резюме перезапишется. Если id отличается — появится дубликат; лишнее можно удалить в разделе «Резюме».',
        ],
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
        body: 'На странице отклика нажмите «Сгенерировать сопровод». Расширение возьмёт выбранное резюме и последнюю вакансию, отправит их в LLM и вставит ответ в поле на hh.ru.',
        details: [
            'Текст письма генерирует та же LLM, что указана в настройках — данные не уходят на серверы расширения.',
        ],
    },
] as const

const PLATFORM_FIELD_GUIDE = [
    {
        title: 'Паттерны URL (regex)',
        body: 'Определяют, на каких страницах срабатывает платформа. Каждый паттерн — с новой строки. Совпадение проверяется по полному URL.',
        examples: [
            '^https://hh\\.ru/resume/[^/?#]+',
            '^https://[^./]+\\.hh\\.ru/resume/[^/?#]+',
            '^https://[\\w-]+\\.careerist\\.ru/resume/[^/?#]+\\.html',
            '^https://hh\\.ru/vacancy/\\d+',
        ],
        notes: [
            'Используйте ^ и $, если хотите матчить URL целиком или с начала.',
            'На hh.ru часть городов без субдомена (просто hh.ru), часть — с городом (spb.hh.ru). Лучше держать оба паттерна.',
            'Для slug-ов не используйте только цифры — часто бывает ivanov-ivan-12345678.html, а не 123.html.',
            'null — платформа не участвует в этом flow.',
        ],
    },
    {
        title: 'CSS-селекторы контента и полей',
        body: 'Ищут элементы на странице через document.querySelector. Каждый селектор — с новой строки; перебираются сверху вниз, берётся первый найденный.',
        examples: [
            '[data-qa="main-content"]',
            '#mainPageCenter',
            'textarea[placeholder*="Сопровод"]',
            'label:has(+ textarea)',
            '[contenteditable="true"]',
        ],
        notes: [
            'Поддерживается обычный CSS и :has() по структуре DOM.',
            'Не поддерживается: :contains("текст"), text=, XPath — querySelector их не понимает.',
            'Для поля сопроводительного ищется textarea, input или contenteditable внутри найденного элемента.',
            'null — поиск по этому полю отключён.',
        ],
    },
    {
        title: 'Какие поля за что отвечают',
        body: 'В настройках платформы несколько групп паттернов и селекторов.',
        notes: [
            'Паттерны страниц резюме + селекторы контента резюме — кнопка «Сохранить резюме» и парсинг текста.',
            'Паттерны страниц вакансий — общий vacancy-flow (страница вакансии и отклик).',
            'Паттерны парсинга вакансии + селекторы контента — текст вакансии для sidepanel и LLM.',
            'Селекторы поля сопроводительного — куда вставлять текст (если сайт позволяет).',
            'Селекторы контейнера инжекта — куда монтировать кнопку «Сгенерировать»; если null — рядом с полем.',
        ],
    },
    {
        title: 'Пример минимальной платформы',
        body: 'Новая платформа: regex URL + селектор контейнера. Остальное можно оставить null, пока не нужны вакансии или отклик.',
        examples: [
            'resumePagePatterns: ^https://site\\.ru/resume/.+',
            'resumeContentSelectors: [id="resume-body"]',
            'enabled: true',
        ],
        notes: [
            'Если кнопка не появляется — проверьте regex в Debug (Type: resume) и что селектор есть в DOM.',
            'Если текст не вставляется в кастомный редактор — используйте кнопку копирования рядом с «Сгенерировать».',
            'Быстрый чат может подсказать regex и CSS-селектор по описанию страницы.',
        ],
    },
    {
        title: 'Обмен конфигами платформ',
        body: 'На каждой карточке платформы в Настройках → Контент можно быстро поделиться готовым конфигом или вставить чужой. Данные ходят через буфер обмена в виде JSON-объекта.',
        examples: [
            `{ "type": "${APP_SLUG}-content-platform", "version": 1, "platform": { ... } }`,
            'Можно вставить и голый объект platform без обёртки — импорт тоже примет.',
        ],
        notes: [
            'Экспорт — иконка «стрелка вверх»: копирует JSON текущей карточки в буфер обмена.',
            'Импорт — иконка «стрелка вниз»: читает JSON из буфера и подставляет в эту карточку.',
            'Перед импортом спросим подтверждение «Перезаписать настройки?», чтобы случайно не затереть свои поля.',
            'После импорта нажмите «Сохранить конфиги» — иначе изменения останутся только на экране.',
            'Удобно, когда кто-то уже настроил сайт: скопировал → отправил → друг вставил в свою карточку.',
        ],
    },
] as const

export const GuideScreen = () => {
    const setScreen = useScreenStore((state) => state.setScreen)

    return (
        <div className="flex flex-col gap-4">
            <ScreenHeader title="Гайд" />

            <section className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center gap-2 text-primary">
                    <BookOpen className="h-4 w-4" />
                    <h2 className="text-sm font-semibold">Как пользоваться</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                    Короткий флоу от первого запуска до генерации сопроводительного. Парсинг резюме и генерация текста полностью выполняются вашей LLM — обычно локальной. Ниже — формат настроек платформ для других сайтов.
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

            <section className="rounded-xl border border-border bg-card p-4">
                <h2 className="text-sm font-semibold text-foreground">Настройки платформ: паттерны и селекторы</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    В Настройках → Контент можно добавить сайты кроме hh.ru. URL матчится regex-паттернами, элементы на
                    странице — CSS-селекторами.
                </p>
            </section>

            <div className="flex flex-col gap-3">
                {PLATFORM_FIELD_GUIDE.map((section) => (
                    <section
                        key={section.title}
                        className="rounded-xl border border-border bg-card p-4"
                    >
                        <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{section.body}</p>

                        {'examples' in section && section.examples ? (
                            <div className="mt-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-primary">Примеры</p>
                                <ul className="mt-2 flex flex-col gap-1.5">
                                    {section.examples.map((example) => (
                                        <li key={example}>
                                            <code className="block break-all rounded-md bg-background px-2 py-1.5 text-xs text-foreground">
                                                {example}
                                            </code>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        {'notes' in section && section.notes ? (
                            <ul className="mt-3 flex flex-col gap-1.5">
                                {section.notes.map((note) => (
                                    <li key={note} className="flex gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                        <span>{note}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </section>
                ))}
            </div>

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
