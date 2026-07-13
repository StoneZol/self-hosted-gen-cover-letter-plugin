export function startServiceWorkerKeepAlive(): () => void {
    if (typeof chrome === 'undefined' || typeof chrome.runtime === 'undefined') {
        return () => {}
    }

    const intervalId = setInterval(() => {
        void chrome.runtime.getPlatformInfo()
    }, 10_000)

    return () => {
        clearInterval(intervalId)
    }
}
