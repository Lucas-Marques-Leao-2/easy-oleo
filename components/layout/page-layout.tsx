import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 pb-20 text-[15px] leading-snug">
      <header className="border-b border-slate-200/90 pb-6 dark:border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-typography-lv1 dark:text-slate-100 sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm text-typography-lv3 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </header>

      <div className="mt-8 flex flex-col gap-8 lg:mt-10 lg:gap-10">
        {children}
      </div>
    </main>
  );
}

type SectionCardProps = {
  title: string;
  titleId?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  titleId,
  children,
  className = "",
}: SectionCardProps) {
  const headingId = titleId ?? "section-card-heading";
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5 lg:p-6 ${className}`}
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="mb-4 text-base font-semibold text-typography-lv2 dark:text-slate-300"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

type ListSectionProps = {
  title: string;
  subtitle?: string;
  headingId: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function ListSection({
  title,
  subtitle,
  headingId,
  actions,
  children,
}: ListSectionProps) {
  const descId = `${headingId}-desc`;

  return (
    <section
      aria-labelledby={headingId}
      aria-describedby={subtitle ? descId : undefined}
      className="min-w-0"
    >
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h2
            id={headingId}
            className="text-base font-semibold text-typography-lv2 dark:text-slate-300"
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              id={descId}
              className="mt-1 max-w-2xl text-sm leading-snug text-typography-lv3 dark:text-slate-400"
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center justify-start sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

type HomeMainProps = { children: ReactNode };

export function HomeMain({ children }: HomeMainProps) {
  return (
    <main className="relative z-0 mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 pb-20 text-[15px] leading-snug sm:px-6 lg:gap-10 lg:px-8">
      {children}
    </main>
  );
}
