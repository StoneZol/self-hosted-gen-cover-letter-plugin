import { create } from "zustand";

export type ScreenType = 'settings' | 'main' | 'resume'

const useScreenStore = create<{
    screen: ScreenType
    setScreen: (screen: ScreenType) => void
}>((set) => ({
    screen: 'main',
    setScreen: (screen: ScreenType) => set({ screen })
}));

export default useScreenStore;