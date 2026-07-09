type UrlChangeHandler = (url: string) => void

export function watchUrlChanges(onChange: UrlChangeHandler): () => void {
    let lastUrl = window.location.href

    function notifyIfChanged(): void {
        const nextUrl = window.location.href

        if (nextUrl === lastUrl) {
            return
        }

        lastUrl = nextUrl
        onChange(nextUrl)
    }

    const originalPushState = history.pushState.bind(history)
    const originalReplaceState = history.replaceState.bind(history)

    history.pushState = (...args) => {
        originalPushState(...args)
        notifyIfChanged()
    }

    history.replaceState = (...args) => {
        originalReplaceState(...args)
        notifyIfChanged()
    }

    window.addEventListener('popstate', notifyIfChanged)

    const intervalId = window.setInterval(notifyIfChanged, 1000)

    return () => {
        history.pushState = originalPushState
        history.replaceState = originalReplaceState
        window.removeEventListener('popstate', notifyIfChanged)
        window.clearInterval(intervalId)
    }
}
