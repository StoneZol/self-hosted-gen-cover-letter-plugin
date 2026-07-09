import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SaveResume } from '../_components/SaveResume'
import { getResumeContentElement } from '../resumePage'
import { INJECTED_WIDGET_SELECTOR } from '@/lib/configs/content/config'

export function mountResumeScenario(): void {
    const targetElement = getResumeContentElement()

    if (!targetElement) {
        return
    }

    const existingContainer = document.querySelector<HTMLElement>(INJECTED_WIDGET_SELECTOR)

    if (existingContainer) {
        return
    }

    const container = document.createElement('div')
    container.id = INJECTED_WIDGET_SELECTOR.replace(/^#/, '')
    targetElement.prepend(container)

    createRoot(container).render(
        <StrictMode>
            <SaveResume />
        </StrictMode>,
    )
}
