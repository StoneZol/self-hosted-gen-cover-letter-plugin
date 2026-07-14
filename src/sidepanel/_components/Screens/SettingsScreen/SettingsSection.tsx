import { useState } from 'react'
import { cn } from "@/lib/helpers/cn"
import { ConfirmDeleteButton } from './ConfirmDeleteButton'
import { SettingsFieldPopover } from './SettingsFieldPopover'

export type TextareaField = {
    key: string
    label: string
    value: string
    description: string
    defaultExample: string
    rows?: number
    readOnly?: boolean
    onChange?: (value: string) => void
    helperText?: string
}

type SettingsSectionProps = {
    title: string
    description?: string
    fields: TextareaField[]
    defaultCollapsed?: boolean
    onDelete?: () => void
    deleteLabel?: string
}

export const SettingsSection = ({
    title,
    description,
    fields,
    defaultCollapsed = false,
    onDelete,
    deleteLabel = 'Удалить',
}: SettingsSectionProps) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

    const headerActions = onDelete ? (
        <ConfirmDeleteButton label={deleteLabel} onConfirm={onDelete} />
    ) : null

    const content = (
        <div className="mt-4 flex flex-col gap-3">
            {fields.map((field) => (
                <label key={field.key} className="flex flex-col gap-2">
                    <span className="relative flex items-center gap-2 text-sm font-medium text-foreground">
                        <span>{field.label}</span>
                        <SettingsFieldPopover
                            description={field.description}
                            defaultExample={field.defaultExample}
                        />
                    </span>
                    <textarea
                        value={field.value}
                        rows={field.rows ?? 2}
                        readOnly={field.readOnly}
                        onChange={
                            field.onChange
                                ? (event) => field.onChange?.(event.target.value)
                                : undefined
                        }
                        className={cn("min-h-12 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 read-only:cursor-default read-only:bg-muted/60",
                            field.readOnly ? "resize-none" : "resize-y"
                        )}
                    />
                    {field.helperText ? (
                        <span className="text-xs text-muted-foreground">{field.helperText}</span>
                    ) : null}
                </label>
            ))}
        </div>
    )

    const sectionHeader = (
        <div className="flex items-start justify-between gap-3">
            <div>
                <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                {description ? (
                    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
            {headerActions}
        </div>
    )

    if (defaultCollapsed) {
        return (
            <details
                className="rounded-xl border border-border bg-card p-4"
                open={!isCollapsed}
            >
                <summary
                    className="cursor-pointer list-none"
                    onClick={(event) => {
                        event.preventDefault()
                        setIsCollapsed((currentValue) => !currentValue)
                    }}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                            {description ? (
                                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                            ) : null}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            {headerActions}
                            <span className="text-xs font-medium text-primary">
                                {isCollapsed ? 'Развернуть' : 'Свернуть'}
                            </span>
                        </div>
                    </div>
                </summary>
                {content}
            </details>
        )
    }

    return (
        <section className="rounded-xl border border-border bg-card p-4">
            {sectionHeader}
            {content}
        </section>
    )
}
