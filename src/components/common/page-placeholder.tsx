import type { ReactNode } from "react";

interface PagePlaceholderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

/**
 * Temporary shell for routes that are scaffolded but not implemented yet.
 * Replace it with real feature UI as each route comes online.
 */
export function PagePlaceholder({
  title,
  description,
  children,
}: PagePlaceholderProps) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
