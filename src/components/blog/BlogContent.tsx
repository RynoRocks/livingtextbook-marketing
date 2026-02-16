'use client';

import ReactMarkdown from 'react-markdown';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>,
        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        code: ({ className, children }) => {
          const isInline = !className;
          if (isInline) {
            return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
          }
          return <code className="block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">{children}</code>;
        },
        pre: ({ children }) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
        blockquote: ({ children }) => <blockquote className="border-l-4 border-accent pl-4 italic my-4">{children}</blockquote>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-accent hover:text-primary underline transition-colors"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
        hr: () => <hr className="my-8 border-border" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
