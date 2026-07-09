export function isExtensionNetworkContext(): boolean {
    if (typeof window === 'undefined') {
        return true
    }

    return window.location.protocol === 'chrome-extension:'
}

export function assertExtensionNetworkContext(): void {
    if (isExtensionNetworkContext()) {
        return
    }

    throw new Error(
        'Сетевые запросы выполняются только в контексте расширения (service worker или extension page), а не со страницы целевого сайта.',
    )
}
