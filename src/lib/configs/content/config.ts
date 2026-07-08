import type { ContentConfig } from '@/lib/types/content/types'

export const DEFAULT_CONTENT_CONFIG: ContentConfig = {
    resumePagePattern: '^https://(?:[^./]+\\.)?hh\\.ru/resume/[^/?#]+',
    resumeContentSelector: '[data-qa="main-content"]',
}

export const INJECTED_WIDGET_SELECTOR = '#hh-free-cheat-save-resume'
