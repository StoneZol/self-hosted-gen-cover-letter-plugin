import type { CoverLetterConfig } from '@/lib/types/coverLetter/types'

export const DEFAULT_COVER_LETTER_CONFIG: CoverLetterConfig = {
    basePrompt: `Ты помощник по составлению сопроводительных писем для отклика на вакансии.
Напиши краткое, убедительное сопроводительное письмо на русском языке.
Опирайся на резюме кандидата и описание вакансии.
Не добавляй подпись, контакты и прощание в конце — их добавим отдельно.`,
    letterSignature: `С уважением,
Иван Иванов
+7 (999) 123-45-67
ivan@example.com`,
}

const STORAGE_KEY = 'coverLetterConfig'

export async function loadCoverLetterConfig(): Promise<CoverLetterConfig> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const storedConfig = result[STORAGE_KEY] as Partial<CoverLetterConfig> | undefined

    return {
        ...DEFAULT_COVER_LETTER_CONFIG,
        ...storedConfig,
    }
}

export async function saveCoverLetterConfig(config: CoverLetterConfig): Promise<void> {
    await chrome.storage.local.set({
        [STORAGE_KEY]: config,
    })
}

export { STORAGE_KEY as COVER_LETTER_CONFIG_STORAGE_KEY }
