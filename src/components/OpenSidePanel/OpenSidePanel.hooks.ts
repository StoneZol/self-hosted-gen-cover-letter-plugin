const useOpenSidePanelHook = () => {
  const openSidePanel = async () => {
    const currentWindow = await chrome.windows.getCurrent()

    if (!currentWindow.id) {
      throw new Error('Current window id is unavailable.')
    }

    await chrome.sidePanel.open({ windowId: currentWindow.id })
    window.close()
  }

  return {
    openSidePanel,
  }
}

export default useOpenSidePanelHook