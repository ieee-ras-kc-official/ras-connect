import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="grid min-h-64 place-items-center rounded-[14px] border border-dashed border-line bg-surface-soft/45 px-6 py-12 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-[10px] border border-line bg-surface text-brand shadow-soft">
          <MagnifyingGlassIcon size={22} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-ink">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        ) : null}
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  );
}
