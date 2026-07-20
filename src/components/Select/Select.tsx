import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'
import { useSelect, type SelectOption } from './Select.hooks'

export type { SelectOption }

type SelectProps<T extends string = string> = {
    value: T | null
    options: SelectOption<T>[]
    onChange: (value: T) => void
    placeholder?: string
    disabled?: boolean
    id?: string
    label?: string
    className?: string
}

export function Select<T extends string = string>({
    value,
    options,
    onChange,
    placeholder,
    disabled = false,
    id,
    label,
    className,
}: SelectProps<T>) {
    const {
        rootRef,
        selectId,
        listboxId,
        isOpen,
        selectedOption,
        displayLabel,
        isTriggerDisabled,
        toggleOpen,
        handleSelect,
    } = useSelect({
        value,
        options,
        onChange,
        placeholder,
        id,
    })

    return (
        <div ref={rootRef} className={cn('relative flex flex-col gap-2', className)}>
            {label ? (
                <label htmlFor={selectId} className="text-sm font-medium text-foreground">
                    {label}
                </label>
            ) : null}

            <button
                id={selectId}
                type="button"
                disabled={disabled || isTriggerDisabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                onClick={toggleOpen}
                className={cn(
                    'flex min-h-11 w-full items-start justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm leading-snug text-foreground transition-colors',
                    'hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    !selectedOption && 'text-muted-foreground',
                )}
            >
                <span className="min-w-0 flex-1 wrap-break-word whitespace-normal">{displayLabel}</span>
                <ChevronDown
                    aria-hidden
                    className={cn(
                        'mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                        isOpen && 'rotate-180',
                    )}
                />
            </button>

            {isOpen ? (
                <ul
                    id={listboxId}
                    role="listbox"
                    aria-labelledby={selectId}
                    className="absolute top-full z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-xl"
                >
                    {options.map((option) => {
                        const isSelected = option.value === value

                        return (
                            <li key={option.value} role="presentation">
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    disabled={option.disabled}
                                    onClick={() => handleSelect(option.value)}
                                    className={cn(
                                        'flex w-full px-3 py-2 text-left text-sm leading-snug wrap-break-word whitespace-normal transition-colors',
                                        'hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60',
                                        isSelected
                                            ? 'bg-primary/10 font-medium text-foreground'
                                            : 'text-foreground',
                                    )}
                                >
                                    {option.label}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            ) : null}
        </div>
    )
}
