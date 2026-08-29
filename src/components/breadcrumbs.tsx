import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <CaretRightIcon size={13} aria-hidden="true" />
              ) : null}
              {item.href && !current ? (
                <Link
                  href={item.href}
                  className="rounded-sm transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={current ? "page" : undefined} className="text-ink">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
