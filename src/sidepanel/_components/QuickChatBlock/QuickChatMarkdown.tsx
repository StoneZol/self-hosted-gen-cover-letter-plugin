import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type QuickChatMarkdownProps = {
    content: string
}

const markdownComponents: Components = {
    p: ({ children }) => <p className="mb-2 text-sm text-foreground last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5 text-sm text-foreground">{children}</ul>,
    ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 text-sm text-foreground">{children}</ol>,
    li: ({ children }) => <li className="text-foreground">{children}</li>,
    h1: ({ children }) => <h1 className="mb-2 text-base font-semibold text-foreground">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-2 text-sm font-semibold text-foreground">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-2 text-sm font-medium text-foreground">{children}</h3>,
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic text-foreground">{children}</em>,
    blockquote: ({ children }) => (
        <blockquote className="my-2 border-l-2 border-primary/40 pl-3 text-sm text-muted-foreground">
            {children}
        </blockquote>
    ),
    a: ({ children, href }) => (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
        >
            {children}
        </a>
    ),
    code: ({ className, children }) => {
        const isBlock = Boolean(className)

        if (isBlock) {
            return (
                <code className="block font-mono text-xs text-foreground whitespace-pre-wrap">{children}</code>
            )
        }

        return (
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">{children}</code>
        )
    },
    pre: ({ children }) => (
        <pre className="my-2 overflow-x-auto rounded-lg border border-border bg-muted/40 p-3">{children}</pre>
    ),
    table: ({ children }) => (
        <div className="my-2 overflow-x-auto">
            <table className="w-full min-w-full border-collapse text-left text-sm text-foreground">{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-border last:border-b-0">{children}</tr>,
    th: ({ children }) => (
        <th className="border border-border px-2 py-1.5 font-medium text-foreground">{children}</th>
    ),
    td: ({ children }) => <td className="border border-border px-2 py-1.5 text-foreground">{children}</td>,
    hr: () => <hr className="my-3 border-border" />,
}

export function QuickChatMarkdown({ content }: QuickChatMarkdownProps) {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
        </ReactMarkdown>
    )
}
