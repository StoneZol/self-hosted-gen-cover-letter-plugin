import type { ResumeParsingConfig } from '@/lib/types/resumeParsing/types'

export const DEFAULT_RESUME_PARSING_CONFIG: ResumeParsingConfig = {
    parsingPrompt: `Ты помощник по структурированию резюме.
Получаешь полную ссылку на страницу резюме и сырой текст, извлечённый с этой страницы.
Твоя задача — упорядочить текст и преобразовать его в JSON строго по схеме ниже.

Правила:
- Из переданной sourceUrl извлеки:
  - id — идентификатор резюме на платформе;
  - source — человекочитаемое название ресурса/платформы, например "HeadHunter" для hh.ru.
- Не придумывай id и source, если их нельзя разумно вывести из ссылки.
- language укажи полным названием языка резюме на естественном языке, например "Русский", "English", "Deutsch". Не используй коды вроде ru/en.
- Не выдумывай факты, которых нет в исходном тексте.
- Если секции нет в тексте, верни пустой массив или не указывай selfAbout.
- Для опциональных полей не используй null. Если значения нет, просто не включай поле в JSON.
- Даты experience приводи к короткому читаемому виду из текста как есть.
- В experience.description оставляй суть, до 3–4 коротких пунктов на место работы.

Раздел selfAbout («О себе»):
- Клади в selfAbout ТОЛЬКО текст из явного раздела «О себе» / «About me» / «Обо мне».
- Не включай в selfAbout: должность/заголовок резюме, строку «Язык: ...», служебный UI hh.ru.
- Служебный UI hh.ru — НЕ selfAbout: «Поднятие резюме», «Поднимать автоматически», «Видно всем работодателям», «зарегистрированным на hh.ru», «Можно сегодня в ...» и похожие подсказки интерфейса.
- Если раздела «О себе» нет, он пустой или там только служебный текст — не указывай selfAbout вообще.
- Не придумывай и не перефразируй selfAbout из должности, навыков или опыта. Без отсебятины.

Разделение skills, education и certifications:
- skills: только из явных секций навыков резюме — «Навыки», «Ключевые навыки», skill tags, подтверждённые навыки, результаты skill-тестов.
- НЕ добавляй в skills технологии из описания опыта работы, блоков «Стек:» в experience и перечислений внутри обязанностей.
- Каждый навык — отдельный короткий пункт. Без группировок вроде «TypeScript, JavaScript, React...» одной строкой.
- Без дубликатов: если навык уже есть, не повторяй его другой формулировкой.
- education: основное и высшее образование, вузы, колледжи, факультеты, специальности.
- certifications: только реальное дополнительное обучение — курсы, повышение квалификации, тренинги, bootcamp, онлайн-курсы с завершением, сертификационные программы.
- Подтверждённые навыки, результаты skill-тестов и обычные skill tags НЕ клади в certifications. Они всегда относятся к skills.
- Основное образование НЕ дублируй в certifications. Оно относится только к education.
- Если дополнительного обучения в тексте нет, верни certifications: [].`,
}

const STORAGE_KEY = 'resumeParsingConfig'

export async function loadResumeParsingConfig(): Promise<ResumeParsingConfig> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedConfig = result[STORAGE_KEY] as Partial<ResumeParsingConfig> | undefined

    return {
        parsingPrompt:
            storedConfig?.parsingPrompt ?? DEFAULT_RESUME_PARSING_CONFIG.parsingPrompt,
    }
}

export async function saveResumeParsingConfig(config: ResumeParsingConfig): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: config,
    })
}

export { STORAGE_KEY as RESUME_PARSING_CONFIG_STORAGE_KEY }
