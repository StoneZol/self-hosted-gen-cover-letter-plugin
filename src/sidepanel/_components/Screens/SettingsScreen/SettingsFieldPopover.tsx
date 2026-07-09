import { CircleHelp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type SettingsFieldPopoverProps = {
    description: string
    defaultExample: string
}

export const SettingsFieldPopover = ({
    description,
    defaultExample,
}: SettingsFieldPopoverProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const rootRef = useRef<HTMLSpanElement | null>(null)

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            if (!rootRef.current?.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handlePointerDown)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handlePointerDown)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    return (
        <span ref={rootRef} className="ml-auto inline-flex">
            <button
                type="button"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary focus:text-primary focus:outline-none"
                aria-label="Описание поля"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((currentValue) => !currentValue)}
            >
                <CircleHelp className="h-4 w-4" />
            </button>

            <span
                className="absolute right-0 top-full z-20 mt-2 w-64 max-w-[calc(100vw-3rem)] rounded-xl border border-border bg-card p-3 text-left shadow-xl"
                hidden={!isOpen}
            >
                <span className="block text-xs font-medium text-foreground">
                    Для чего нужно
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {description}
                </span>

                <span className="mt-3 block text-xs font-medium text-foreground">
                    Значение по умолчанию
                </span>
                <span className="mt-1 block whitespace-pre-wrap break-all rounded-md bg-background px-2 py-1 text-xs text-primary select-text">
                    {defaultExample}
                </span>
            </span>
        </span>
    )
}
