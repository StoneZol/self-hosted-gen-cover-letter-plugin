import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SaveResume } from './_components/SaveResume'

function isResumePage(url: string): boolean {
  return /^https:\/\/(?:[^./]+\.)?hh\.ru\/resume\/[^/?#]+/i.test(url)
}

function mountResumeActions(): void {
  const targetElement = document.querySelector<HTMLElement>('[data-qa="main-content"]')

  if (!targetElement) {
    return
  }

  const container = document.createElement('div')
  container.id = 'hh-free-cheat-save-resume'
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
