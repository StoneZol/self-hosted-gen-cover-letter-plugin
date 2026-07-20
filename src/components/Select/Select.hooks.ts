import { useEffect, useId, useRef, useState } from 'react'

export type SelectOption<T extends string = string> = {
    value: T
    label: string
    disabled?: boolean
}

type UseSelectParams<T extends string = string> = {
    value: T | null
    options: SelectOption<T>[]
    onChange: (value: T) => void
    placeholder?: string
    id?: string
}

export function useSelect<T extends string = string>({
    value,
    options,
    onChange,
    placeholder = 'Выберите значение',
    id,
}: UseSelectParams<T>) {
    const generatedId = useId()
    const selectId = id ?? generatedId
    const listboxId = `${selectId}-listbox`
    const rootRef = useRef<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const selectedOption = options.find((option) => option.value === value) ?? null
    const displayLabel = selectedOption?.label ?? placeholder
    const isTriggerDisabled = options.length === 0

    useEffect(() => {
        if (!isOpen) {
            return
        }

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
    }, [isOpen])

    function toggleOpen() {
        setIsOpen((currentValue) => !currentValue)
    }

    function handleSelect(nextValue: T) {
        onChange(nextValue)
        setIsOpen(false)
    }

    return {
        rootRef,
        selectId,
        listboxId,
        isOpen,
        selectedOption,
        displayLabel,
        isTriggerDisabled,
        toggleOpen,
        close,
        handleSelect,
    }
}
