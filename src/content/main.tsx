import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SaveResume } from './_components/SaveResume'
import { getResumeContentElement } from './resumePage'
import { DEFAULT_CONTENT_CONFIG, INJECTED_WIDGET_SELECTOR } from '@/lib/configs/content/config'

function isResumePage(url: string): boolean {
  return new RegExp(DEFAULT_CONTENT_CONFIG.resumePagePattern, 'i').test(url)
}

function mountResumeActions(): void {
  const targetElement = getResumeContentElement()

  if (!targetElement) {
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

if (isResumePage(window.location.href)) {
  mountResumeActions()
}
