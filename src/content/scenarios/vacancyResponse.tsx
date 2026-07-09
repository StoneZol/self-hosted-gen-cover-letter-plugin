import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { GenerateCoverLetter } from '../_components/GenerateCoverLetter'
import {
    getVacancyLetterInjectElement,
    getVacancyLetterInputElement,
    isVacancyLetterInjectTargetConfigured,
} from '../vacancyResponsePage'
import { publishVacancyObserverState } from '../publishObserverState'
import { INJECTED_COVER_LETTER_WIDGET_SELECTOR } from '@/lib/configs/content/config'

let mountObserver: MutationObserver | null = null
let widgetRoot: Root | null = null
let isScenarioActive = false

function getExistingContainer(): HTMLElement | null {
    return document.querySelector<HTMLElement>(INJECTED_COVER_LETTER_WIDGET_SELECTOR)
}

function mountWidget(letterInput: HTMLElement): boolean {
    const existingContainer = getExistingContainer()

    if (existingContainer) {
        return true
    }

    const injectTarget = getVacancyLetterInjectElement(letterInput)
    const parentElement = injectTarget ?? letterInput.parentElement

    if (!parentElement) {
        return false
    }

    const container = document.createElement('div')
    container.id = INJECTED_COVER_LETTER_WIDGET_SELECTOR.replace(/^#/, '')

    if (injectTarget) {
        parentElement.appendChild(container)
    } else {
        parentElement.insertBefore(container, letterInput.nextSibling)
    }

    widgetRoot = createRoot(container)
    widgetRoot.render(
        <StrictMode>
            <GenerateCoverLetter />
        </StrictMode>,
    )

    return true
}

function unmountWidget(): void {
    widgetRoot?.unmount()
    widgetRoot = null
    getExistingContainer()?.remove()
}

function syncVacancyWidget(): void {
    const letterInput = getVacancyLetterInputElement()
    const widgetMounted = Boolean(getExistingContainer())

    if (letterInput) {
        const injectTargetConfigured = isVacancyLetterInjectTargetConfigured()
        const injectTarget = getVacancyLetterInjectElement(letterInput)

        if (injectTargetConfigured && !injectTarget) {
            void publishVacancyObserverState({
                status: 'watching',
                observerActive: Boolean(mountObserver),
                letterInputFound: true,
                widgetMounted: false,
                message:
                    'Поле найдено, ждём якорь инжекта из конфига (предок поля, связанный контейнер или уникальный на странице).',
            })

            return
        }

        const mounted = mountWidget(letterInput)

        void publishVacancyObserverState({
            status: mounted ? 'mounted' : 'watching',
            observerActive: Boolean(mountObserver),
            letterInputFound: true,
            widgetMounted: mounted,
            message: mounted
                ? injectTargetConfigured
                    ? 'Контейнер инжекта найден, кнопка смонтирована.'
                    : 'Поле сопроводительного найдено, кнопка смонтирована рядом с полем.'
                : 'Поле найдено, но контейнер для кнопки пока не удалось вставить.',
        })

        return
    }

    if (widgetMounted) {
        unmountWidget()
    }

    void publishVacancyObserverState({
        status: 'watching',
        observerActive: Boolean(mountObserver),
        letterInputFound: false,
        widgetMounted: false,
        message: 'Ждём появление поля сопроводительного в DOM.',
    })
}

function stopMountObserver(): void {
    mountObserver?.disconnect()
    mountObserver = null
}

function startMountObserver(): void {
    if (mountObserver) {
        return
    }

    mountObserver = new MutationObserver(() => {
        syncVacancyWidget()
    })

    mountObserver.observe(document.body, {
        childList: true,
        subtree: true,
    })
}

export function mountVacancyResponseScenario(): void {
    isScenarioActive = true
    syncVacancyWidget()
    startMountObserver()
}

export function unmountVacancyResponseScenario(): void {
    isScenarioActive = false
    stopMountObserver()
    unmountWidget()

    void publishVacancyObserverState({
        status: 'idle',
        observerActive: false,
        letterInputFound: false,
        widgetMounted: false,
        message: 'Страница не относится к vacancy-flow, наблюдатель остановлен.',
    })
}

export function isVacancyScenarioActive(): boolean {
    return isScenarioActive
}
